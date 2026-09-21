'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, ArrowLeft, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { auth, ApiClientError } from '@/lib/api-client';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});
type FormValues = z.infer<typeof schema>;

export default function ResetPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, getValues, formState: { errors } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setServerError(null);
    try {
      await auth.requestPasswordReset(values.email);
      setSent(true);
    } catch (err) {
      // Show success even on 404 to avoid email enumeration
      if (err instanceof ApiClientError && err.status === 404) {
        setSent(true);
      } else {
        setServerError(
          err instanceof ApiClientError
            ? err.message
            : 'Something went wrong. Please try again.',
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">FileConverter Pro</span>
        </Link>

        <Card>
          {sent ? (
            <>
              <CardHeader className="text-center pb-3">
                <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Check your inbox</CardTitle>
                <CardDescription>
                  If an account exists for <strong>{getValues('email')}</strong>, we sent
                  a password reset link. Check your email and follow the instructions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground text-center">
                  Didn&apos;t receive it? Check your spam folder or{' '}
                  <button
                    className="text-primary hover:underline"
                    onClick={() => { setSent(false); setServerError(null); }}
                  >
                    try again
                  </button>.
                </p>
                <Button variant="outline" className="w-full gap-2" asChild>
                  <Link href="/auth/login">
                    <ArrowLeft className="h-4 w-4" /> Back to sign in
                  </Link>
                </Button>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle>Forgot your password?</CardTitle>
                <CardDescription>
                  Enter your email and we&apos;ll send you a link to reset your password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  {serverError && (
                    <div className="flex gap-3 bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-lg">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{serverError}</span>
                    </div>
                  )}

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

                  <Button type="submit" className="w-full gap-2" disabled={submitting}>
                    {submitting
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                      : <><Mail className="h-4 w-4" /> Send reset link</>}
                  </Button>

                  <Button variant="outline" className="w-full gap-2" asChild>
                    <Link href="/auth/login">
                      <ArrowLeft className="h-4 w-4" /> Back to sign in
                    </Link>
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
