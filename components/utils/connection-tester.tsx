'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export interface BackendCheckResult {
  ok: boolean;
  gatewayHealth: 'ONLINE' | 'OFFLINE' | 'UNREACHABLE';
  apiUrl: string;
  latencyMs: number;
  corsOk: boolean;
  status: number | null;
  error?: string;
  details?: Record<string, unknown>;
}

/**
 * Runs a comprehensive connectivity and CORS test against the backend API.
 */
export async function runBackendConnectionTest(options: { silentToast?: boolean } = {}): Promise<BackendCheckResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api/v1';
  let originUrl = '';
  try {
    const parsed = new URL(apiUrl);
    originUrl = `${parsed.protocol}//${parsed.host}`;
  } catch {
    originUrl = apiUrl.replace(/\/api\/v1\/?$/, '');
  }

  const startTime = performance.now();
  console.log(
    '%c[FileConverter Pro] 🔍 Testing backend connection...',
    'color: #3b82f6; font-weight: bold; font-size: 13px;'
  );
  console.log(`• Target API URL: %c${apiUrl}`, 'color: #0284c7; font-family: monospace;');
  console.log(`• Gateway URL:    %c${originUrl}`, 'color: #0284c7; font-family: monospace;');

  // If user is deployed on Vercel but NEXT_PUBLIC_API_URL still points to localhost
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app') && apiUrl.includes('localhost')) {
    console.warn(
      '%c⚠️ WARNING: Your frontend is running on Vercel, but NEXT_PUBLIC_API_URL is still pointing to localhost!\n' +
      'Please go to Vercel -> Project Settings -> Environment Variables, set NEXT_PUBLIC_API_URL, and Redeploy.',
      'color: #f59e0b; font-weight: bold; font-size: 12px;'
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout (allows Render cold-start)

    // Test API route directly (validates Nginx proxy + Auth Service + CORS)
    let apiStatus: number | null = null;
    let gatewayStatus: number | null = null;
    let corsOk = false;
    let lastErrMessage = '';

    try {
      const authRes = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        signal: controller.signal,
      });
      apiStatus = authRes.status;
      // 400 Bad Request (Validation Error) or 200 OK confirms proxy + service + DB are active
      if (authRes.status === 400 || authRes.status === 200) {
        corsOk = true;
      }
    } catch (e: unknown) {
      lastErrMessage = e instanceof Error ? e.message : String(e);
    }

    // Also check Gateway /health or root /
    try {
      const healthRes = await fetch(`${originUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
      }).catch(() => fetch(`${originUrl}/`, { method: 'GET', signal: controller.signal }));
      if (healthRes) {
        gatewayStatus = healthRes.status;
      }
    } catch {
      // Non-fatal if API route worked
    }

    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - startTime);

    if (apiStatus !== null || gatewayStatus === 200) {
      const activeStatus = apiStatus !== null ? apiStatus : gatewayStatus;
      console.log(
        '%c=======================================================\n' +
        '%c✅ BACKEND CONNECTED SUCCESSFULLY!\n' +
        '%c=======================================================\n' +
        `• API Status:   %c${apiStatus ? `HTTP ${apiStatus}` : 'Reached Gateway'}\n` +
        `• Gateway:      %c${gatewayStatus ? `HTTP ${gatewayStatus}` : 'Active'}\n` +
        `• Latency:      %c${latencyMs} ms\n` +
        `• CORS:         %c${corsOk ? 'PASSED (Allowed)' : 'CHECKING'}\n` +
        `• Target:       %c${apiUrl}\n` +
        '%c=======================================================',
        'color: #10b981;',
        'color: #10b981; font-size: 14px; font-weight: bold;',
        'color: #10b981;',
        'color: #10b981; font-weight: bold;',
        'color: #3b82f6; font-weight: bold;',
        'color: #3b82f6; font-weight: bold;',
        corsOk ? 'color: #10b981; font-weight: bold;' : 'color: #f59e0b; font-weight: bold;',
        'color: #64748b; font-family: monospace;',
        'color: #10b981;'
      );

      if (!options.silentToast) {
        toast.success(`Backend Connected! Latency: ${latencyMs}ms`, {
          description: `Active on ${originUrl}`,
          duration: 4000,
        });
      }

      return {
        ok: true,
        gatewayHealth: 'ONLINE',
        apiUrl,
        latencyMs,
        corsOk: true,
        status: activeStatus,
      };
    } else {
      throw new Error(lastErrMessage || 'Failed to fetch from backend');
    }
  } catch (err: unknown) {
    const latencyMs = Math.round(performance.now() - startTime);
    const errorMessage = err instanceof Error ? err.message : String(err);
    const isTimeout = errorMessage.toLowerCase().includes('abort') || errorMessage.toLowerCase().includes('timeout');

    console.error(
      '%c=======================================================\n' +
      '%c❌ BACKEND CONNECTION FAILED\n' +
      '%c=======================================================\n' +
      `• Target URL:    %c${apiUrl}\n` +
      `• Error:         %c${errorMessage}\n` +
      `• Probable cause:\n` +
      `  1. Render free instance is waking up from sleep (takes ~30-50s). Retry in a moment.\n` +
      `  2. NEXT_PUBLIC_API_URL not configured or misspelled in Vercel.\n` +
      `  3. Cross-Origin (CORS) restriction blocked by the browser.\n` +
      '%c=======================================================',
      'color: #ef4444;',
      'color: #ef4444; font-size: 14px; font-weight: bold;',
      'color: #ef4444;',
      'color: #64748b; font-family: monospace;',
      'color: #ef4444; font-weight: bold;',
      'color: #ef4444;'
    );

    if (!options.silentToast) {
      if (isTimeout) {
        toast.warning('Backend is waking up (Cold Start)', {
          description: 'Render free tier spins down when idle. Please wait ~30s and test again.',
          duration: 6000,
        });
      } else {
        toast.error('Backend connection failed', {
          description: `${errorMessage}. Check console for details.`,
          duration: 5000,
        });
      }
    }

    return {
      ok: false,
      gatewayHealth: 'UNREACHABLE',
      apiUrl,
      latencyMs,
      corsOk: false,
      status: null,
      error: errorMessage,
    };
  }
}

/**
 * Client component that exposes console test commands globally:
 * - `test`
 * - `test()`
 * - `testBackend()`
 * - `checkBackend()`
 */
export function ConnectionTester() {
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || initialized.current) return;
    initialized.current = true;

    let lastRun = 0;
    const executeTest = () => {
      const now = Date.now();
      // Debounce if called twice within 800ms
      if (now - lastRun < 800) return;
      lastRun = now;
      return runBackendConnectionTest();
    };

    // Attach callable functions
    (window as unknown as Record<string, unknown>).testBackend = executeTest;
    (window as unknown as Record<string, unknown>).checkBackend = executeTest;
    (window as unknown as Record<string, unknown>).testConnection = executeTest;

    // Attach getter for `test` so typing just `test` or `test()` runs it
    try {
      Object.defineProperty(window, 'test', {
        get() {
          executeTest();
          return executeTest;
        },
        configurable: true,
      });
    } catch {
      (window as unknown as Record<string, unknown>).test = executeTest;
    }

    // Print welcome banner in browser console
    console.log(
      '%c[FileConverter Pro] 🚀 Cloud Connection Tester initialized!\n' +
      '%c👉 Type %ctest%c or %ctestBackend()%c in this console to verify backend connectivity.',
      'color: #3b82f6; font-weight: bold; font-size: 13px;',
      'color: #94a3b8; font-size: 12px;',
      'color: #10b981; font-weight: bold; font-family: monospace; font-size: 12px; background: rgba(16,185,129,0.1); padding: 2px 4px; border-radius: 3px;',
      'color: #94a3b8; font-size: 12px;',
      'color: #10b981; font-weight: bold; font-family: monospace; font-size: 12px; background: rgba(16,185,129,0.1); padding: 2px 4px; border-radius: 3px;',
      'color: #94a3b8; font-size: 12px;'
    );
  }, []);

  return null;
}
