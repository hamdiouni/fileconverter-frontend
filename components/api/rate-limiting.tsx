'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Clock, Zap, TrendingUp } from 'lucide-react';

const tiers = [
  {
    name: 'Free',
    requestsPerHour: 100,
    requestsPerMonth: 500,
    concurrentJobs: 1,
    maxFileSize: '10 MB',
    color: 'bg-slate-100 dark:bg-slate-800',
    barColor: 'bg-slate-400',
    pct: 5,
  },
  {
    name: 'Pro',
    requestsPerHour: 10_000,
    requestsPerMonth: 50_000,
    concurrentJobs: 5,
    maxFileSize: '100 MB',
    color: 'bg-blue-50 dark:bg-blue-950/30',
    barColor: 'bg-blue-500',
    pct: 50,
  },
  {
    name: 'Business',
    requestsPerHour: 100_000,
    requestsPerMonth: 1_000_000,
    concurrentJobs: 20,
    maxFileSize: '1 GB',
    color: 'bg-purple-50 dark:bg-purple-950/30',
    barColor: 'bg-purple-500',
    pct: 80,
  },
  {
    name: 'Enterprise',
    requestsPerHour: 'Unlimited',
    requestsPerMonth: 'Unlimited',
    concurrentJobs: 'Custom',
    maxFileSize: 'Custom',
    color: 'bg-amber-50 dark:bg-amber-950/30',
    barColor: 'bg-amber-500',
    pct: 100,
  },
];

const responseHeaders = [
  {
    header: 'X-RateLimit-Limit',
    description: 'Maximum number of requests allowed in the current window.',
    example: '10000',
  },
  {
    header: 'X-RateLimit-Remaining',
    description: 'Number of requests remaining before the limit is reached.',
    example: '9742',
  },
  {
    header: 'X-RateLimit-Reset',
    description: 'Unix timestamp (UTC) when the current rate limit window resets.',
    example: '1709251200',
  },
  {
    header: 'Retry-After',
    description: 'Seconds to wait before retrying (only present on HTTP 429 responses).',
    example: '3600',
  },
];

const retryExample = `async function convertWithRetry(payload, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const res = await fetch('https://api.fileconverterpro.com/v1/conversions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${API_KEY}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.status !== 429) return res;

    const retryAfter = parseInt(res.headers.get('Retry-After') ?? '60', 10);
    console.log(\`Rate limited. Retrying in \${retryAfter}s...\`);
    await new Promise(r => setTimeout(r, retryAfter * 1000));
  }
  throw new Error('Max retries exceeded');
}`;

export function RateLimiting() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Rate Limits</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Rate Limiting
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            All API requests are subject to rate limits based on your subscription tier.
            Limits reset every hour. Exceeding the limit returns{' '}
            <code className="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">HTTP 429</code>.
          </p>
        </div>

        {/* Tier comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`${tier.color} border-0`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{tier.name}</CardTitle>
                  {tier.name === 'Pro' && (
                    <Badge className="text-xs bg-blue-600">Popular</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Requests / hour</span>
                    <span className="font-medium text-foreground">
                      {typeof tier.requestsPerHour === 'number'
                        ? tier.requestsPerHour.toLocaleString()
                        : tier.requestsPerHour}
                    </span>
                  </div>
                  <Progress value={tier.pct} className="h-1.5" />
                </div>

                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly requests</span>
                    <span className="font-medium">
                      {typeof tier.requestsPerMonth === 'number'
                        ? tier.requestsPerMonth.toLocaleString()
                        : tier.requestsPerMonth}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Concurrent jobs</span>
                    <span className="font-medium">{tier.concurrentJobs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max file size</span>
                    <span className="font-medium">{tier.maxFileSize}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Response headers */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Rate Limit Headers
            </h3>
            <div className="space-y-4">
              {responseHeaders.map((h) => (
                <Card key={h.header} className="p-4">
                  <div className="space-y-1.5">
                    <code className="text-sm font-mono text-primary font-semibold">{h.header}</code>
                    <p className="text-sm text-muted-foreground">{h.description}</p>
                    <div className="bg-muted rounded px-3 py-1.5 inline-block">
                      <code className="text-xs font-mono">{h.header}: {h.example}</code>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* 429 handling */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Handling 429 Responses
            </h3>

            <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">
                      Best practice: exponential back-off
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      Always read the <code className="font-mono">Retry-After</code> header and wait
                      the specified number of seconds before retrying. Implement jitter to avoid
                      thundering-herd issues in high-throughput clients.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-slate-950 dark:bg-slate-900 rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800">
                <Zap className="h-3.5 w-3.5 text-yellow-400" />
                <span className="text-xs text-slate-400 font-mono">retry-example.js</span>
              </div>
              <pre className="text-xs text-slate-300 font-mono leading-relaxed p-4 overflow-x-auto whitespace-pre">
                {retryExample}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
