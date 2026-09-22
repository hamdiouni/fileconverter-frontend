import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '';

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const stateParam = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  // Handle errors or user cancellation from Google
  if (error || !code) {
    const errorMsg = error || 'oauth_cancelled';
    return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(errorMsg)}`, url.origin));
  }

  let returnTo = '/dashboard';
  let redirectUri = `${url.origin}/api/auth/callback/google`;

  if (stateParam) {
    try {
      const decoded = JSON.parse(decodeURIComponent(stateParam));
      if (decoded.returnTo && typeof decoded.returnTo === 'string' && decoded.returnTo.startsWith('/')) {
        returnTo = decoded.returnTo;
      }
      if (decoded.redirectUri && typeof decoded.redirectUri === 'string') {
        redirectUri = decoded.redirectUri;
      }
    } catch {
      // Keep defaults
    }
  }

  try {
    // 1. Exchange code for Google tokens
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
      console.error('Google token exchange error:', errBody);
      return NextResponse.redirect(new URL('/auth/login?error=token_exchange_failed', url.origin));
    }

    const tokens = await tokenRes.json();

    // 2. Fetch User Profile from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userRes.ok) {
      console.error('Failed to fetch Google user info');
      return NextResponse.redirect(new URL('/auth/login?error=profile_fetch_failed', url.origin));
    }

    const googleProfile = await userRes.json();

    // 3. Assemble application auth state
    const authUser = {
      id: googleProfile.id || `google_${Date.now()}`,
      email: googleProfile.email || 'google_user@gmail.com',
      name: googleProfile.name || googleProfile.email?.split('@')[0] || 'Google User',
      avatar: googleProfile.picture || null,
    };

    const authTokens = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || `google_rt_${authUser.id}`,
      expiresIn: tokens.expires_in || 3600,
      tokenType: 'Bearer' as const,
    };

    const storedAuthPayload = {
      accessToken: authTokens.accessToken,
      refreshToken: authTokens.refreshToken,
      expiresAt: Date.now() + authTokens.expiresIn * 1000,
      user: authUser,
    };

    // 4. Return an HTML landing that persists auth to localStorage and redirects smoothly
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
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    h2 { margin: 0 0 0.5rem; font-size: 1.25rem; }
    p { margin: 0; color: #94a3b8; font-size: 0.875rem; }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h2>Signing In with Google</h2>
    <p>Welcome back, ${escapeHtml(authUser.name || authUser.email)}! Redirecting to your dashboard...</p>
  </div>
  <script>
    try {
      localStorage.setItem('fc_auth', JSON.stringify(${JSON.stringify(storedAuthPayload)}));
      localStorage.setItem('fc_user_profile', JSON.stringify(${JSON.stringify({
        userId: authUser.id,
        email: authUser.email,
        name: authUser.name,
        company: null,
        avatar: authUser.avatar,
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

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (err: any) {
    console.error('OAuth Callback Exception:', err);
    return NextResponse.redirect(new URL('/auth/login?error=server_error', url.origin));
  }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
