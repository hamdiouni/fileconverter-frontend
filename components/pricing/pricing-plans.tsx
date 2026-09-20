'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown, Building2 } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
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
    name: 'Pro',
    price: '$29',
    period: '/month',
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
    name: 'Business',
    price: '$99',
    period: '/month',
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

export function PricingPlans() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground">
            All plans include our core conversion engine. Upgrade to unlock premium features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
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
                  <CardDescription className="text-sm">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-secondary hover:bg-secondary/90'
                    }`}
                    asChild
                  >
                    <Link href={plan.href}>
                      {plan.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            All plans include 99.9% uptime SLA and enterprise-grade security.
            <br />
            Need a custom plan? <Link href="/contact-sales" className="text-primary hover:underline">Contact our sales team</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
