'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, User, Lock, Trash2, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/auth-store';
import { users, ApiClientError, type UserProfile } from '@/lib/api-client';
import { toast } from 'sonner';

// ─── Schemas ──────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name:    z.string().min(1, 'Name is required').max(100),
  company: z.string().max(100).optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter();
  const { user, init, logout, isInitialized } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } =
    useForm<ProfileValues>({ resolver: zodResolver(profileSchema) });

  useEffect(() => { init(); }, [init]);
  useEffect(() => {
    if (!isInitialized) return;
    if (!user) { router.replace('/auth/login?redirect=/settings'); return; }
    users.getProfile()
      .then((p) => { setProfile(p); reset({ name: p.name ?? '', company: p.company ?? '' }); })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, [isInitialized, user, router, reset]);


  const onSave = async (values: ProfileValues) => {
    setSaving(true);
    try {
      const updated = await users.updateProfile({ name: values.name, company: values.company ?? undefined });
      setProfile(updated);
      reset({ name: updated.name ?? '', company: updated.company ?? '' });
      toast.success('Profile updated');
    } catch (err) {
      toast.error((err as ApiClientError).message ?? 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isInitialized || !user || loading) {

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

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur sticky top-16 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Account Settings</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-8">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" /> Profile
            </CardTitle>
            <CardDescription>Your public-facing account information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSave)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" value={user.email} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" placeholder="Jane Smith" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="company">Company <span className="text-muted-foreground">(optional)</span></Label>
                <Input id="company" placeholder="Acme Corp" {...register('company')} />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={saving || !isDirty} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save changes
                </Button>
                {!isDirty && profile && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" /> Up to date
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium capitalize">{profile?.tier ?? 'free'} Plan</span>
                <p className="text-sm text-muted-foreground">
                  {profile?.tier === 'free' ? '50 conversions/month' :
                   profile?.tier === 'pro'  ? '500 conversions/month' :
                   'Unlimited conversions'}
                </p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${tierColors[profile?.tier ?? 'free']}`}>
                {profile?.tier ?? 'free'}
              </span>
            </div>
            {profile?.tier === 'free' && (
              <Button variant="outline" asChild className="w-full">
                <a href="/pricing">Upgrade plan</a>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lock className="h-4 w-4" /> Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Use the password reset flow to set a new password.
            </p>
            <Button variant="outline" asChild>
              <a href="/auth/reset">Reset password</a>
            </Button>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <Trash2 className="h-4 w-4" /> Danger zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Deleting your account permanently removes all your data, files, and API keys.
              This action cannot be undone.
            </p>
            <Button
              variant="outline"
              className="border-destructive/30 text-destructive hover:bg-destructive/10 gap-2"
              disabled={deleting}
              onClick={async () => {
                if (!confirm('Are you absolutely sure? This will permanently delete your account and all associated data. This cannot be undone.')) return;
                setDeleting(true);
                try {
                  await users.deleteAccount();
                  logout();
                  toast.success('Account deleted. Goodbye!');
                  router.replace('/');
                } catch (err) {
                  toast.error((err as ApiClientError).message ?? 'Failed to delete account. Please try again.');
                  setDeleting(false);
                }
              }}
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete my account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
