/**
 * Centralized Google & Social OAuth Helper
 */

export const GOOGLE_OAUTH_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  redirectUris: [
    'http://localhost:8080/api/auth/callback/google',
    'http://localhost/api/v1/auth/callback/google',
    'http://localhost:3000/api/auth/callback/google',
  ],
};

/**
 * Determines the best redirect URI according to the current window location
 */
export function getGoogleRedirectUri(): string {
  if (typeof window === 'undefined') {
    return 'http://localhost/api/v1/auth/callback/google';
  }

  const { origin, port, hostname } = window.location;

  if (port === '8080') {
    return 'http://localhost:8080/api/auth/callback/google';
  }
  if (port === '3000') {
    return 'http://localhost:3000/api/auth/callback/google';
  }
  if (hostname.includes('vercel.app')) {
    return `${origin}/api/auth/callback/google`;
  }
  // Default to standard gateway URL
  return `${origin}/api/v1/auth/callback/google`;
}

/**
 * Generates the full Google OAuth authorization URL
 */
export function getGoogleAuthUrl(returnTo: string = '/dashboard'): string {
  const redirectUri = getGoogleRedirectUri();
  const statePayload = {
    returnTo,
    redirectUri,
    nonce: Math.random().toString(36).substring(2, 15),
  };
  const state = encodeURIComponent(JSON.stringify(statePayload));

  const params = new URLSearchParams({
    client_id: GOOGLE_OAUTH_CONFIG.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  ['466195313627', 'mf3t35danp4mqqq4d5vq8h6k2qdpclql.apps.googleusercontent.com'].join('-');

/**
 * Generates the direct external Google authorization URL
 * pointing straight to accounts.google.com to avoid Next.js soft-routing interference.
 */
export function getDirectGoogleAuthUrl(returnTo: string = '/dashboard'): string {
  let redirectUri = 'http://localhost:8080/api/auth/callback/google';

  if (typeof window !== 'undefined') {
    const { port, origin, hostname } = window.location;
    if (port === '8080') {
      redirectUri = 'http://localhost:8080/api/auth/callback/google';
    } else if (port === '3000') {
      redirectUri = 'http://localhost:3000/api/auth/callback/google';
    } else if (hostname.includes('vercel.app')) {
      redirectUri = `${origin}/api/auth/callback/google`;
    } else if (port === '' || port === '80') {
      redirectUri = `${origin}/api/v1/auth/callback/google`;
    } else {
      redirectUri = `${origin}/api/auth/callback/google`;
    }
  }

  const statePayload = {
    returnTo,
    redirectUri,
    nonce: Math.random().toString(36).substring(2, 15),
  };
  const state = encodeURIComponent(JSON.stringify(statePayload));

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Initiates the Google OAuth Sign-in flow via direct window navigation
 */
export function initiateGoogleLogin(returnTo: string = '/dashboard'): void {
  if (typeof window === 'undefined') return;
  window.location.href = getDirectGoogleAuthUrl(returnTo);
}
