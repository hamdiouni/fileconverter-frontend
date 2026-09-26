'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, CheckCircle2, XCircle, AlertTriangle, Activity } from 'lucide-react';
import { runBackendConnectionTest, BackendCheckResult } from '@/components/utils/connection-tester';

export function LiveStatusMonitor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BackendCheckResult | null>(null);

  const handleTest = async () => {
    setLoading(true);
    try {
      const res = await runBackendConnectionTest({ silentToast: false });
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border shadow-md my-8 bg-card/60 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary animate-pulse" />
              Live Backend Connectivity Test
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Target API: <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80/api/v1'}</code>
            </p>
          </div>
          <Button
            onClick={handleTest}
            disabled={loading}
            className="flex items-center gap-2"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Testing...' : 'Test Backend Now'}
          </Button>
        </div>

        {result ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg flex items-center gap-3 ${
              result.ok 
                ? 'bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-300' 
                : 'bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300'
            }`}>
              {result.ok ? (
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500 shrink-0" />
              )}
              <div className="text-sm">
                <p className="font-semibold text-base">
                  {result.ok ? 'Backend Connected Successfully!' : 'Backend Connection Failed'}
                </p>
                <p className="opacity-90">
                  {result.ok
                    ? `Gateway responded in ${result.latencyMs}ms with status ${result.status} OK.`
                    : result.error || 'Server is not reachable or still sleeping.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded border bg-background/50">
                <span className="text-muted-foreground block mb-1">Gateway Health</span>
                <span className={`font-semibold ${result.ok ? 'text-green-600' : 'text-red-600'}`}>
                  {result.gatewayHealth}
                </span>
              </div>
              <div className="p-3 rounded border bg-background/50">
                <span className="text-muted-foreground block mb-1">Latency</span>
                <span className="font-semibold text-foreground">{result.latencyMs} ms</span>
              </div>
              <div className="p-3 rounded border bg-background/50">
                <span className="text-muted-foreground block mb-1">CORS Policy</span>
                <span className={`font-semibold ${result.corsOk ? 'text-green-600' : 'text-amber-600'}`}>
                  {result.corsOk ? 'Allowed' : 'Blocked / Pending'}
                </span>
              </div>
              <div className="p-3 rounded border bg-background/50">
                <span className="text-muted-foreground block mb-1">Console Shortcut</span>
                <span className="font-mono text-primary font-bold">test</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <p className="mb-2">Click <strong>Test Backend Now</strong> above or open your browser console (F12) and type <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-primary">test</code>.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
