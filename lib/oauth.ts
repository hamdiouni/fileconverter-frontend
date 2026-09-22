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

  const { origin, port } = window.location;

  if (port === '8080') {
    return 'http://localhost:8080/api/auth/callback/google';
  }
  if (port === '3000') {
    // If running on local dev/prod server port 3000
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

/**
 * Initiates the Google OAuth Sign-in flow
 */
export function initiateGoogleLogin(returnTo: string = '/dashboard'): void {
  if (typeof window === 'undefined') return;
  const url = getGoogleAuthUrl(returnTo);
  window.location.href = url;
}
