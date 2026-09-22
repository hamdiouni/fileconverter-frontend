'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown, Building2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getAccessToken } from '@/lib/api-client';
import { toast } from 'sonner';

// Stripe price IDs configured for both monthly and yearly intervals
const STRIPE_PRICES = {
  pro: {
    monthly: {
      price: '$29',
      period: '/month',
      stripePrice: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY ?? process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO ?? 'price_pro_monthly',
    },
    yearly: {
      price: '$24',
      period: '/month, billed yearly',
      stripePrice: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY ?? 'price_pro_yearly',
    },
  },
  business: {
    monthly: {
      price: '$99',
      period: '/month',
      stripePrice: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_MONTHLY ?? process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS ?? 'price_business_monthly',
    },
    yearly: {
      price: '$79',
      period: '/month, billed yearly',
      stripePrice: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_YEARLY ?? 'price_business_yearly',
    },
  },
};

const basePlans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for occasional file conversions',
    icon: Star,
    features: [
      '100 conversions per month',
      'File size limit: 10MB',
      'Basic conversion types',
      'Email support',
      'Standard processing speed',
      'No watermark'
    ],
    cta: 'Get Started Free',
    href: '/auth/signup',
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals and power users',
    icon: Zap,
    features: [
      '1,000 conversions per month',
      'File size limit: 100MB',
      'All conversion types',
      'Priority support',
      'Faster processing',
      'Batch conversions (up to 10 files)',
      'Conversion history',
      'API access (1,000 calls/month)'
    ],
    cta: 'Start Pro Trial',
    href: '/auth/signup?plan=pro',
    popular: true
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For teams and growing businesses',
    icon: Building2,
    features: [
      '10,000 conversions per month',
      'File size limit: 500MB',
      'All conversion types',
      'Priority support',
      'Fastest processing',
      'Batch conversions (up to 100 files)',
      'Team management',
      'API access (10,000 calls/month)',
      'White-label options',
      'Advanced analytics'
    ],
    cta: 'Start Business Trial',
    href: '/auth/signup?plan=business',
    popular: false
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with custom needs',
    icon: Crown,
    features: [
      'Unlimited conversions',
      'Custom file size limits',
      'All conversion types',
      'Dedicated support',
      'Custom processing speeds',
      'Unlimited batch conversions',
      'Advanced team management',
      'Unlimited API access',
      'Full white-label solution',
      'Custom integrations',
      'SLA guarantees',
      'On-premise options'
    ],
    cta: 'Contact Sales',
    href: '/contact-sales',
    popular: false
  }
];

async function startCheckout(priceId: string): Promise<void> {
  const token = getAccessToken();
  if (!token) {
    window.location.href = '/auth/signup';
    return;
  }

  const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:80/api/v1';
  const res = await fetch(`${BASE}/billing/checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      priceId,
      successUrl: `${window.location.origin}/dashboard?checkout=success`,
      cancelUrl:  `${window.location.origin}/pricing`,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.error?.message ?? `HTTP ${res.status}`);
  }

  const { url } = await res.json();
  window.location.href = url;
}

export function PricingPlans() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);

  const handlePlanClick = async (planName: string, stripePrice: string | null) => {
    if (!stripePrice) return; // Free or Enterprise — let Link handle it
    setLoading(planName);
    try {
      await startCheckout(stripePrice);
    } catch (err) {
      toast.error((err as Error).message ?? 'Failed to start checkout. Please try again.');
      setLoading(null);
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground">
            All plans include our core conversion engine. Upgrade to unlock premium features.
          </p>
        </div>

        {/* Billing Interval Toggle */}
        <div className="flex items-center justify-center gap-3 mb-14">
          <button
            type="button"
            onClick={() => setBillingInterval('monthly')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              billingInterval === 'monthly'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingInterval('yearly')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              billingInterval === 'yearly'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Yearly</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-700 dark:text-green-300 font-semibold">
              Save 20%
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {basePlans.map((plan) => {
            const IconComponent = plan.icon;
            const isLoading = loading === plan.name;
            const isPro = plan.id === 'pro';
            const isBusiness = plan.id === 'business';
            const tierConfig = isPro ? STRIPE_PRICES.pro[billingInterval] : isBusiness ? STRIPE_PRICES.business[billingInterval] : null;

            const priceDisplay = tierConfig ? tierConfig.price : plan.price;
            const periodDisplay = tierConfig ? tierConfig.period : plan.period;
            const stripePrice = tierConfig ? tierConfig.stripePrice : null;

            return (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.popular
                    ? 'border-primary shadow-lg scale-105'
                    : 'border-border'
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      plan.popular ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{priceDisplay}</span>
                    <span className="text-muted-foreground text-sm ml-1">{periodDisplay}</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {stripePrice ? (
                    <Button
                      className={`w-full gap-2 ${
                        plan.popular
                          ? 'bg-primary hover:bg-primary/90'
                          : 'bg-secondary hover:bg-secondary/90'
                      }`}
                      disabled={!!loading}
                      onClick={() => handlePlanClick(plan.name, stripePrice)}
                    >
                      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                      {plan.cta}
                    </Button>
                  ) : (
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? 'bg-primary hover:bg-primary/90'
                          : 'bg-secondary hover:bg-secondary/90'
                      }`}
                      asChild
                    >
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            All plans include 99.9% uptime SLA and enterprise-grade security.
            <br />
            Need a custom plan?{' '}
            <Link href="/contact-sales" className="text-primary hover:underline">
              Contact our sales team
            </Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
