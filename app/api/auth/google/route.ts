import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId =
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error('Google OAuth Error: GOOGLE_CLIENT_ID is not configured in environment variables.');
    return NextResponse.redirect(new URL('/auth/login?error=missing_google_client_id', request.url));
  }

  const url = new URL(request.url);
  const returnTo = url.searchParams.get('returnTo') || '/dashboard';

  // Determine redirect URI based on explicit config or current origin
  let redirectUri =
    process.env.GOOGLE_CALLBACK_URL ||
    `${url.origin}/api/auth/callback/google`;

  if (!process.env.GOOGLE_CALLBACK_URL) {
    if (url.port === '8080') {
      redirectUri = 'http://localhost:8080/api/auth/callback/google';
    } else if (url.port === '' || url.port === '80') {
      redirectUri = 'http://localhost/api/v1/auth/callback/google';
    }
  }

  const statePayload = {
    returnTo,
    redirectUri,
    nonce: Math.random().toString(36).substring(2, 15),
  };
  const state = encodeURIComponent(JSON.stringify(statePayload));

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account',
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return NextResponse.redirect(googleAuthUrl);
}
