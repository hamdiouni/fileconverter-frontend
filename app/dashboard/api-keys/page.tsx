'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Key, Plus, Trash2, Copy, Check, Eye, EyeOff,
  Loader2, AlertCircle, ChevronLeft, Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/lib/auth-store';
import { auth, ApiClientError, type ApiKey } from '@/lib/api-client';
import { toast } from 'sonner';
import Link from 'next/link';

const createSchema = z.object({
  name: z.string().min(1, 'Name is required').max(60),
});
type CreateValues = z.infer<typeof createSchema>;

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}

export default function ApiKeysPage() {
  const router = useRouter();
  const { user, init } = useAuthStore();
  const [keys, setKeys]         = useState<ApiKey[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey]     = useState<string | null>(null);
  const [showNewKey, setShowNewKey] = useState(false);
  const [copied, setCopied]     = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<CreateValues>({ resolver: zodResolver(createSchema) });

  useEffect(() => { init(); }, [init]);
  useEffect(() => {
    if (!user) { router.replace('/auth/login?redirect=/dashboard/api-keys'); return; }
    auth.listApiKeys()
      .then(setKeys)
      .catch(() => toast.error('Failed to load API keys'))
      .finally(() => setLoading(false));
  }, [user, router]);

  const handleCreate = async (values: CreateValues) => {
    setCreating(true);
    try {
      const result = await auth.createApiKey(values.name, ['conversions:read', 'conversions:write']);
      setNewKey(result.key);
      setKeys((prev) => [result, ...prev]);
      reset();
      setShowCreate(false);
    } catch (err) {
      toast.error((err as ApiClientError).message ?? 'Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id: string, name: string | null) => {
    if (!confirm(`Revoke key "${name ?? id}"? All requests using it will immediately fail.`)) return;
    setRevoking(id);
    try {
      await auth.revokeApiKey(id);
      setKeys((prev) => prev.filter((k) => k.id !== id));
      toast.success('API key revoked');
    } catch (err) {
      toast.error((err as ApiClientError).message ?? 'Failed to revoke key');
    } finally {
      setRevoking(null);
    }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  if (!user || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur sticky top-16 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard"><ChevronLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Key className="h-5 w-5" /> API Keys
              </h1>
              <p className="text-sm text-muted-foreground">{keys.filter(k => !k.revokedAt).length} active key{keys.filter(k => !k.revokedAt).length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <Button className="gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> New key
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        {/* New key reveal banner */}
        {newKey && (
          <Card className="border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-green-800 dark:text-green-300 flex items-center gap-2">
                <Shield className="h-4 w-4" /> Save your API key now
              </CardTitle>
              <CardDescription className="text-green-700 dark:text-green-400">
                This is the only time the full key will be shown.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-xs bg-background border rounded-md px-3 py-2 overflow-auto">
                  {showNewKey ? newKey : '•'.repeat(40)}
                </code>
                <Button variant="ghost" size="icon" onClick={() => setShowNewKey(v => !v)}>
                  {showNewKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => copyKey(newKey)}>
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => setNewKey(null)} className="w-full">
                I&apos;ve saved it — dismiss
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Security note */}
        <div className="flex gap-3 bg-muted/40 rounded-lg px-4 py-3 text-xs text-muted-foreground">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>
            API keys grant access to your account. Never share them publicly or commit them to source control.
            Use environment variables instead.
          </span>
        </div>

        {/* Keys list */}
        {keys.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Key className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No API keys yet</p>
              <Button className="gap-2" onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4" /> Create your first key
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {keys.map((key) => (
              <Card key={key.id} className={key.revokedAt ? 'opacity-50' : ''}>
                <CardContent className="py-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Key className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{key.name ?? 'Unnamed key'}</span>
                      {key.revokedAt ? (
                        <Badge variant="destructive" className="text-xs">Revoked</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-300">Active</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Created {relativeTime(key.createdAt)}
                      {key.lastUsedAt && ` · Last used ${relativeTime(key.lastUsedAt)}`}
                      {key.expiresAt && ` · Expires ${new Date(key.expiresAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  {!key.revokedAt && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 flex-shrink-0"
                      disabled={revoking === key.id}
                      onClick={() => handleRevoke(key.id, key.name)}
                    >
                      {revoking === key.id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Trash2 className="h-3.5 w-3.5" />}
                      Revoke
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API key</DialogTitle>
            <DialogDescription>Give it a memorable name so you can identify it later.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="keyname">Key name</Label>
              <Input id="keyname" placeholder="e.g. production-server, ci-pipeline" {...register('name')} autoFocus />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 gap-2" disabled={creating}>
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                Create key
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
