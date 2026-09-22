import { NextRequest, NextResponse } from 'next/server';

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
  const clientId =
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error('Google OAuth Error: GOOGLE_CLIENT_ID is not configured in environment variables.');
    return NextResponse.redirect(new URL('/auth/login?error=missing_google_client_id', safeOrigin));
  }

  const returnTo = request.nextUrl.searchParams.get('returnTo') || '/dashboard';
  const redirectUri = getRedirectUri(request);

  const statePayload = {
    returnTo,
    redirectUri,
    nonce: Math.random().toString(36).substring(2, 15),
  };
  const state = Buffer.from(JSON.stringify(statePayload)).toString('base64url');

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
  return NextResponse.redirect(googleAuthUrl, 302);
}
