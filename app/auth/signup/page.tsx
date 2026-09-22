'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Zap, ArrowRight, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/lib/auth-store';
import { ApiClientError } from '@/lib/api-client';
import { initiateGoogleLogin, getDirectGoogleAuthUrl } from '@/lib/oauth';

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z
  .object({
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms' }),
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type FormValues = z.infer<typeof schema>;

// ─── Plan labels ──────────────────────────────────────────────────────────────

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  free:       { label: 'Free',       color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  pro:        { label: 'Pro',        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  business:   { label: 'Business',   color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  enterprise: { label: 'Enterprise', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
};

const FREE_PERKS = [
  '50 conversions per month',
  '10 MB max file size',
  'All 2,000+ formats',
  'API access included',
];

// ─── Component ────────────────────────────────────────────────────────────────

// Wrap in Suspense because useSearchParams requires it in static-export mode
export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') ?? 'free';
  const planMeta = PLAN_LABELS[plan] ?? PLAN_LABELS['free']!;

  const { register: storeRegister, isLoading, error, clearError, user } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirmPassword: '', terms: undefined as any },
  });

  const [googleAuthUrl, setGoogleAuthUrl] = useState<string>('/api/auth/google');
  useEffect(() => {
    setGoogleAuthUrl(getDirectGoogleAuthUrl('/dashboard'));
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);

  // Clear store error on unmount
  useEffect(() => () => clearError(), [clearError]);

  const password = watch('password');
  const strength = password.length === 0 ? 0
    : password.length < 8 ? 1
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 3
    : 2;

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await storeRegister(values.email, values.password);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 409) {
        setServerError('An account with this email already exists.');
      } else {
        setServerError((err as Error).message ?? 'Sign-up failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex-col justify-between p-12 text-primary-foreground">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
            <Zap className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl">FileConverter Pro</span>
        </Link>

        <div className="space-y-8">
          <div>
            <div className="text-5xl font-bold leading-tight mb-4">
              Start converting<br />files today.
            </div>
            <p className="text-lg text-primary-foreground/80">
              Join 50,000+ developers and teams using FileConverter Pro to automate document workflows.
            </p>
          </div>

          <div className="space-y-3">
            {FREE_PERKS.map((p) => (
              <div key={p} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-sm text-primary-foreground/90">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} FileConverter Pro. SOC 2 Type II & ISO 27001 compliant.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">FileConverter Pro</span>
          </Link>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">Create your account</h1>
              {plan !== 'free' && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planMeta.color}`}>
                  {planMeta.label} plan
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* OAuth buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={googleAuthUrl}
              className="inline-flex items-center justify-center gap-2 text-sm border border-input bg-background hover:bg-muted/80 h-10 px-4 py-2 rounded-md font-medium transition-colors"
            >
              {/* Google SVG */}
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </a>
            <Button variant="outline" type="button" className="gap-2 text-sm"
              onClick={() => toast.info('GitHub OAuth coming soon. Please use Google or email/password.')}>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </Button>
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-background px-3 text-xs text-muted-foreground">
              or continue with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Server / store error */}
            {(serverError || error) && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-lg">
                {serverError ?? error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register('email')}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  className="pr-10"
                  {...register('password')}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="flex gap-1 mt-1" aria-label={`Password strength: ${['', 'weak', 'fair', 'strong'][strength]}`}>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i <= strength
                          ? strength === 1 ? 'bg-red-500'
                          : strength === 2 ? 'bg-amber-500'
                          : 'bg-green-500'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">
                    {['', 'Weak', 'Fair', 'Strong'][strength]}
                  </span>
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  className="pr-10"
                  {...register('confirmPassword')}
                  aria-invalid={!!errors.confirmPassword}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-input accent-primary cursor-pointer"
                {...register('terms')}
              />
              <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </Label>
            </div>
            {errors.terms && (
              <p className="text-xs text-destructive -mt-2">{errors.terms.message}</p>
            )}

            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
              ) : (
                <>Create free account <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Protected by enterprise-grade encryption.{' '}
            <Link href="/security" className="hover:underline">Learn more</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
