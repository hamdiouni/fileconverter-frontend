'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Zap, FileText, ArrowRight, Download, Clock, CheckCircle,
  AlertCircle, XCircle, Loader2, Key, ChevronRight, TrendingUp,
  BarChart2, RefreshCw, Plus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

import {
  users, conversions, uploads,
  type UserProfile, type UsageStats, type ConversionJob, type PaginatedResponse,
  ApiClientError,
} from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth-store';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min  = Math.floor(diff / 60_000);
  if (min < 1)  return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24)  return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

function statusBadge(status: ConversionJob['status']) {
  const map: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    queued:     { label: 'Queued',     className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',      icon: <Clock className="h-3 w-3" /> },
    processing: { label: 'Processing', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: <Loader2 className="h-3 w-3 animate-spin" /> },
    completed:  { label: 'Completed',  className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',   icon: <CheckCircle className="h-3 w-3" /> },
    failed:     { label: 'Failed',     className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',           icon: <AlertCircle className="h-3 w-3" /> },
    cancelled:  { label: 'Cancelled',  className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',      icon: <XCircle className="h-3 w-3" /> },
  };
  const s = map[status] ?? map['cancelled']!;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${s.className}`}>
      {s.icon}{s.label}
    </span>
  );
}

// ─── Skeleton loaders ─────────────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <Skeleton className="h-8 w-16 mb-1" />
        <Skeleton className="h-4 w-28" />
      </CardContent>
    </Card>
  );
}

function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-36" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
    </TableRow>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const { user, init } = useAuthStore();

  const [profile, setProfile]   = useState<UserProfile | null>(null);
  const [usage, setUsage]       = useState<UsageStats | null>(null);
  const [jobs, setJobs]         = useState<PaginatedResponse<ConversionJob> | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Initialise auth from localStorage
  useEffect(() => { init(); }, [init]);

  // Guard: redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.replace('/auth/login?redirect=/dashboard');
    }
  }, [user, router]);

  const fetchData = async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);

    try {
      const [p, u, j] = await Promise.all([
        users.getProfile(),
        users.getUsage(),
        conversions.list({ pageSize: 10 }),
      ]);
      setProfile(p);
      setUsage(u);
      setJobs(j);
      setError(null);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401) {
        router.replace('/auth/login?redirect=/dashboard');
      } else {
        setError((err as Error).message ?? 'Failed to load dashboard data.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Early states ────────────────────────────────────────────────────────────

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const tierColors: Record<string, string> = {
    free:       'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    pro:        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    business:   'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    enterprise: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  };
  const tier = profile?.tier ?? 'free';
  const quotas = usage?.quotas;
  const convUsed  = usage?.conversionsThisMonth ?? 0;
  const convLimit = quotas?.conversionsPerMonth ?? 50;
  const convPct   = Math.min(100, Math.round((convUsed / convLimit) * 100));

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="border-b bg-background/95 backdrop-blur sticky top-16 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            {profile && (
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fetchData(true)}
              disabled={refreshing}
              aria-label="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button asChild className="gap-2">
              <Link href="/convert">
                <Plus className="h-4 w-4" /> New conversion
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* ── Error banner ───────────────────────────────────────────────── */}
        {error && (
          <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
            <Button variant="ghost" size="sm" className="ml-auto h-7 px-2" onClick={() => fetchData()}>
              Retry
            </Button>
          </div>
        )}

        {/* ── Usage overview ──────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-primary" /> Usage this month
            </h2>
            {profile && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${tierColors[tier]}`}>
                {tier} plan
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {loading ? (
              Array.from({ length: 4 }, (_, i) => <StatCardSkeleton key={i} />)
            ) : (
              <>
                <Card>
                  <CardContent className="pt-5">
                    <div className="text-2xl font-bold">{convUsed.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Conversions used
                    </div>
                    <div className="text-xs text-muted-foreground">
                      of {convLimit === Infinity ? '∞' : convLimit.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5">
                    <div className="text-2xl font-bold">
                      {formatBytes(usage?.storageUsed ?? 0)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">Storage used</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5">
                    <div className="text-2xl font-bold">
                      {(usage?.apiCallsThisMonth ?? 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">API calls</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5">
                    <div className="text-2xl font-bold">
                      {usage ? new Date(usage.resetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">Quota resets</div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Conversion quota bar */}
          {!loading && usage && (
            <Card>
              <CardContent className="pt-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Conversion quota</span>
                  <span className={`font-semibold ${convPct >= 90 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {convUsed} / {convLimit === Infinity ? '∞' : convLimit.toLocaleString()}
                  </span>
                </div>
                <Progress
                  value={convPct}
                  className={`h-2 ${convPct >= 90 ? '[&>div]:bg-destructive' : ''}`}
                />
                {convPct >= 80 && tier === 'free' && (
                  <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-3 py-2 rounded-lg">
                    <span>Running low — upgrade to avoid interruptions</span>
                    <Link href="/pricing" className="font-semibold underline">Upgrade</Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </section>

        {/* ── Quick actions ───────────────────────────────────────────────── */}
        <section>
          <h2 className="font-semibold mb-4">Quick actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: '/convert', icon: Zap, label: 'New conversion', desc: 'Upload & convert a file' },
              { href: '/tools',   icon: FileText, label: 'Browse tools', desc: 'Explore all formats' },
              { href: '/dashboard/api-keys', icon: Key, label: 'API keys', desc: 'Manage access keys' },
            ].map(({ href, icon: Icon, label, desc }) => (
              <Link key={label} href={href}>
                <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer h-full">
                  <CardContent className="pt-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{label}</div>
                      <div className="text-xs text-muted-foreground">{desc}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Conversion history ──────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Recent conversions
            </h2>
            <Button variant="ghost" size="sm" className="gap-1 text-xs" asChild>
              <Link href="/convert">View all <ChevronRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Conversion</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">When</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }, (_, i) => <TableRowSkeleton key={i} />)
                  ) : jobs && jobs.data.length > 0 ? (
                    jobs.data.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="max-w-[180px]">
                          <div className="truncate text-sm font-medium">{job.sourceFileId}</div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-mono">
                            {job.sourceFormat.toUpperCase()}
                            <ArrowRight className="h-3 w-3 inline mx-1 text-muted-foreground" />
                            {job.targetFormat.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell>{statusBadge(job.status)}</TableCell>
                        <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                          {relativeTime(job.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          {job.status === 'completed' && job.resultFileId ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 gap-1 text-xs"
                              onClick={async () => {
                                try {
                                  const { url } = await uploads.getDownloadUrl(job.resultFileId!);
                                  // Fetch as blob to avoid cross-origin navigation issue
                                  const res = await fetch(url);
                                  const blob = await res.blob();
                                  const objectUrl = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = objectUrl;
                                  a.download = job.resultFileId!;
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                  setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
                                } catch { /* ignore */ }
                              }}
                            >
                              <Download className="h-3.5 w-3.5" /> Download
                            </Button>
                          ) : job.status === 'failed' ? (
                            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" asChild>
                              <Link href="/convert"><RefreshCw className="h-3.5 w-3.5" /> Retry</Link>
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                        <FileText className="h-8 w-8 mx-auto mb-3 text-muted-foreground/30" />
                        <p className="text-sm mb-3">No conversions yet</p>
                        <Button asChild size="sm" className="gap-2">
                          <Link href="/convert"><Zap className="h-4 w-4" /> Convert your first file</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {jobs && jobs.total > 10 && (
            <p className="text-xs text-muted-foreground mt-3 text-right">
              Showing 10 of {jobs.total.toLocaleString()} conversions
            </p>
          )}
        </section>

        {/* ── Upgrade nudge (free only) ───────────────────────────────────── */}
        {!loading && tier === 'free' && (
          <Card className="border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-blue-50/0 dark:from-blue-950/20">
            <CardContent className="pt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Upgrade to Pro</p>
                <p className="text-sm text-muted-foreground">
                  500 conversions/month, 100 MB files, priority processing, and API access.
                </p>
              </div>
              <Button asChild className="flex-shrink-0 gap-2">
                <Link href="/pricing">
                  View plans <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
