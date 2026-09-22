'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Webhook, Plus, Trash2, Loader2, ChevronLeft,
  CheckCircle, XCircle, Clock, Info, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuthStore } from '@/lib/auth-store';
import { webhooksApi, ApiClientError, type WebhookEndpoint } from '@/lib/api-client';
import { toast } from 'sonner';
import Link from 'next/link';

// ─── Static event list ────────────────────────────────────────────────────────
const EVENTS = [
  { id: 'conversion.completed', label: 'Conversion completed', desc: 'When a job finishes successfully' },
  { id: 'conversion.failed',    label: 'Conversion failed',    desc: 'When a job fails after all retries' },
  { id: 'conversion.processing',label: 'Conversion processing',desc: 'When a queued job starts' },
  { id: 'upload.completed',     label: 'Upload completed',     desc: 'When a file is scanned and ready' },
  { id: 'upload.infected',      label: 'Upload infected',      desc: 'When a file is flagged by virus scan' },
];

const schema = z.object({
  url: z.string().url('Enter a valid HTTPS URL').startsWith('https://', 'URL must use HTTPS'),
});
type FormValues = z.infer<typeof schema>;

export default function WebhooksPage() {
  const router = useRouter();
  const { user, init, isInitialized } = useAuthStore();
  const [hooks, setHooks]       = useState<WebhookEndpoint[]>([]);
  const [loading, setLoading]   = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['conversion.completed', 'conversion.failed']);

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) { router.replace('/auth/login?redirect=/dashboard/webhooks'); return; }
    webhooksApi.list()
      .then((data) => {
        setHooks(Array.isArray(data) ? data : (data as any)?.data ?? []);
        setLoadError(null);
      })
      .catch(() => {
        setHooks([]);
        setLoadError(null);
      })
      .finally(() => setLoading(false));
  }, [isInitialized, user, router]);


  const handleCreate = async (values: FormValues) => {
    if (selectedEvents.length === 0) {
      toast.error('Select at least one event');
      return;
    }
    setCreating(true);
    try {
      const newHook = await webhooksApi.create(values.url, selectedEvents);
      if (newHook) {
        setHooks((prev) => Array.isArray(prev) ? [newHook, ...prev] : [newHook]);
        reset();
        setSelectedEvents(['conversion.completed', 'conversion.failed']);
        setShowCreate(false);
        toast.success('Webhook endpoint registered');
      }
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : 'Failed to register webhook');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this webhook endpoint? It will stop receiving events immediately.')) return;
    setDeleting(id);
    try {
      await webhooksApi.delete(id);
      setHooks((prev) => Array.isArray(prev) ? prev.filter((h) => h.id !== id) : []);
      toast.success('Webhook deleted');
    } catch (err) {
      toast.error(err instanceof ApiClientError ? err.message : 'Failed to delete webhook');
    } finally {
      setDeleting(null);
    }
  };

  const toggleEvent = (id: string) =>
    setSelectedEvents((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id],
    );

  if (!user || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur sticky top-16 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard"><ChevronLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Webhook className="h-5 w-5" /> Webhooks
              </h1>
              <p className="text-sm text-muted-foreground">{Array.isArray(hooks) ? hooks.length : 0} endpoint{(Array.isArray(hooks) ? hooks.length : 0) !== 1 ? 's' : ''} registered</p>
            </div>
          </div>
          <Button className="gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> Add endpoint
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        {/* Load error */}
        {loadError && (
          <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{loadError}</span>
          </div>
        )}

        {/* Info */}
        <div className="flex gap-3 bg-muted/40 rounded-lg px-4 py-3 text-xs text-muted-foreground">
          <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>
            Webhooks send a signed <code className="font-mono">POST</code> request to your URL when events occur.
            Failed deliveries are retried up to 5 times with exponential back-off.
            Verify the <code className="font-mono">X-FileConverter-Signature</code> header on your server.
          </span>
        </div>

        {/* List */}
        {(!Array.isArray(hooks) || hooks.length === 0) && !loadError ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Webhook className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No webhook endpoints yet</p>
              <Button className="gap-2" onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4" /> Add your first endpoint
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {(Array.isArray(hooks) ? hooks : []).map((hook) => (
              <Card key={hook.id}>
                <CardContent className="py-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <code className="text-sm font-mono truncate block">{hook.url}</code>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {hook.active
                          ? <Badge variant="outline" className="text-xs text-green-600 border-green-300">Active</Badge>
                          : <Badge variant="secondary" className="text-xs">Disabled</Badge>}
                        {hook.lastStatus === 'success' && (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3" /> Last delivery succeeded
                          </span>
                        )}
                        {hook.lastStatus === 'failed' && (
                          <span className="flex items-center gap-1 text-xs text-destructive">
                            <XCircle className="h-3 w-3" /> Last delivery failed
                          </span>
                        )}
                        {!hook.lastStatus && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /> No deliveries yet
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                      disabled={deleting === hook.id}
                      onClick={() => handleDelete(hook.id)}
                    >
                      {deleting === hook.id
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {hook.events.map((e) => (
                      <Badge key={e} variant="secondary" className="text-xs font-mono">{e}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add webhook endpoint</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="webhook-url">Endpoint URL</Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://your-server.com/webhooks"
                {...register('url')}
                autoFocus
              />
              {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Events to receive</Label>
              <div className="space-y-2 rounded-lg border p-3">
                {EVENTS.map((event) => (
                  <div key={event.id} className="flex items-start gap-2.5">
                    <Checkbox
                      id={event.id}
                      checked={selectedEvents.includes(event.id)}
                      onCheckedChange={() => toggleEvent(event.id)}
                      className="mt-0.5"
                    />
                    <Label htmlFor={event.id} className="font-normal cursor-pointer leading-relaxed">
                      <span className="font-mono text-xs font-semibold">{event.label}</span>
                      <br />
                      <span className="text-xs text-muted-foreground">{event.desc}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit" className="flex-1 gap-2" disabled={creating}>
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Webhook className="h-4 w-4" />}
                Add endpoint
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
