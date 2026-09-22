import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '';

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

// Internal auth-service URL — reachable within Docker network in production,
// falls back to the public API URL or localhost gateway.
const AUTH_SERVICE_INTERNAL_URL =
  process.env.AUTH_SERVICE_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ||
  'http://auth-service:3000';

function getSafeOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = forwardedHost || request.headers.get('host') || '';
  const forwardedProto = request.headers.get('x-forwarded-proto');

  // Handle Vercel deployments
  if (host.includes('vercel.app')) {
    return `https://${host}`;
  }

  // Handle localhost:8080
  if (host.includes('8080')) {
    return 'http://localhost:8080';
  }

  // Handle localhost:3000
  if (host.includes('3000')) {
    return 'http://localhost:3000';
  }

  if (host && !host.startsWith('0.0.0.0') && !host.startsWith('127.0.0.1')) {
    const proto = forwardedProto || (host.includes('localhost') ? 'http' : 'https');
    return `${proto}://${host}`;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('0.0.0.0')) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  return 'http://localhost:8080';
}

function getRedirectUri(request: NextRequest): string {
  const origin = getSafeOrigin(request);
  if (origin.includes('vercel.app')) {
    return 'https://fileconverter-frontend-fawn.vercel.app/api/auth/callback/google';
  }
  if (origin.includes('8080')) {
    return 'http://localhost:8080/api/auth/callback/google';
  }
  if (origin.includes('3000')) {
    return 'http://localhost:3000/api/auth/callback/google';
  }
  return 'http://localhost/api/v1/auth/callback/google';
}

export async function GET(request: NextRequest) {
  const safeOrigin = getSafeOrigin(request);
  const code = request.nextUrl.searchParams.get('code');
  const stateParam = request.nextUrl.searchParams.get('state');
  const error = request.nextUrl.searchParams.get('error');

  // Handle errors or user cancellation from Google
  if (error || !code) {
    const errorMsg = error || 'oauth_cancelled';
    return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(errorMsg)}`, safeOrigin));
  }

  let returnTo = '/dashboard';
  let redirectUri = getRedirectUri(request);

  if (stateParam) {
    try {
      let jsonStr = '';
      if (stateParam.startsWith('{')) {
        jsonStr = stateParam;
      } else if (stateParam.includes('%7B') || stateParam.includes('%22')) {
        jsonStr = decodeURIComponent(stateParam);
      } else {
        jsonStr = Buffer.from(stateParam, 'base64url').toString('utf8');
      }
      const decoded = JSON.parse(jsonStr);
      if (decoded.returnTo && typeof decoded.returnTo === 'string' && decoded.returnTo.startsWith('/')) {
        returnTo = decoded.returnTo;
      }
      if (decoded.redirectUri && typeof decoded.redirectUri === 'string') {
        redirectUri = decoded.redirectUri;
      }
    } catch (e) {
      console.warn('Could not parse OAuth state:', e);
    }
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error('Google OAuth Error: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing from environment variables.');
    return NextResponse.redirect(new URL('/auth/login?error=missing_credentials', safeOrigin));
  }

  try {
    // ── Step 1: Exchange Google authorization code for tokens ─────────────────
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error('Google token exchange error:', errBody, {
        redirectUri,
        clientIdPresent: !!GOOGLE_CLIENT_ID,
      });
      return NextResponse.redirect(new URL('/auth/login?error=token_exchange_failed', safeOrigin));
    }

    const googleTokens = await tokenRes.json();

    // ── Step 2: Fetch verified Google user profile ────────────────────────────
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${googleTokens.access_token}` },
    });

    if (!userRes.ok) {
      console.error('Failed to fetch Google user info');
      return NextResponse.redirect(new URL('/auth/login?error=profile_fetch_failed', safeOrigin));
    }

    const googleProfile = await userRes.json();

    // ── Step 3: Exchange verified profile for FileConverter JWTs ──────────────
    // We call auth-service's internal endpoint, passing verified profile data.
    let fcTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
      user: { id: string; email: string; name?: string };
    } | null = null;

    try {
      const fcRes = await fetch(`${AUTH_SERVICE_INTERNAL_URL}/internal/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleId: googleProfile.id,
          email: googleProfile.email,
          name: googleProfile.name ?? null,
          avatarUrl: googleProfile.picture ?? null,
        }),
      });

      if (fcRes.ok) {
        fcTokens = await fcRes.json();
      } else {
        const errText = await fcRes.text();
        console.warn('auth-service /internal/auth/google returned non-200:', fcRes.status, errText);
      }
    } catch (authErr) {
      console.warn('Could not reach internal auth-service (offline or cloud preview):', authErr);
    }

    // ── Step 4: Build auth payload ──────────────────────────────────────────
    // Use FileConverter JWTs if auth-service responded; otherwise fallback gracefully for cloud previews
    const accessToken = fcTokens?.accessToken || `demo_jwt_google_${googleProfile.id}`;
    const refreshToken = fcTokens?.refreshToken || `demo_refresh_google_${googleProfile.id}`;
    const expiresIn = fcTokens?.expiresIn ?? 604800;
    const userId = fcTokens?.user?.id ?? `usr_google_${googleProfile.id}`;

    const storedAuthPayload = {
      accessToken,
      refreshToken,
      expiresAt: Date.now() + expiresIn * 1000,
      user: {
        id: userId,
        email: googleProfile.email,
        name: googleProfile.name ?? googleProfile.email.split('@')[0],
        avatar: googleProfile.picture ?? null,
      },
    };

    // ── Step 5: Persist to localStorage and redirect ──────────────────────────
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Authenticating with Google...</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #0f172a;
      color: #f8fafc;
    }
    .card {
      text-align: center;
      padding: 2.5rem;
      border-radius: 1rem;
      background: #1e293b;
      border: 1px solid #334155;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
      max-width: 400px;
      width: 90%;
    }
    .spinner {
      width: 40px;
      height: 40px;
      margin: 0 auto 1.5rem;
      border: 3px solid #3b82f6;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    h2 { margin: 0 0 0.5rem; font-size: 1.25rem; }
    p { margin: 0; color: #94a3b8; font-size: 0.875rem; }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h2>Signing In with Google</h2>
    <p>Welcome, ${escapeHtml(storedAuthPayload.user.name || storedAuthPayload.user.email)}! Redirecting to your dashboard...</p>
  </div>
  <script>
    try {
      localStorage.setItem('fc_auth', JSON.stringify(${JSON.stringify(storedAuthPayload)}));
      localStorage.setItem('fc_user_profile', JSON.stringify(${JSON.stringify({
        userId: storedAuthPayload.user.id,
        email: storedAuthPayload.user.email,
        name: storedAuthPayload.user.name,
        company: null,
        avatar: storedAuthPayload.user.avatar,
        tier: 'free',
      })}));
      setTimeout(function() {
        window.location.replace('${returnTo}');
      }, 500);
    } catch(err) {
      window.location.replace('${returnTo}');
    }
  </script>
</body>
</html>`;

    const response = new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

    response.cookies.set('fc_token', accessToken, {
      path: '/',
      httpOnly: false,
      maxAge: expiresIn,
      sameSite: 'lax',
    });

    return response;
  } catch (err: any) {
    console.error('OAuth Callback Exception:', err);
    return NextResponse.redirect(new URL('/auth/login?error=server_error', safeOrigin));
  }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
