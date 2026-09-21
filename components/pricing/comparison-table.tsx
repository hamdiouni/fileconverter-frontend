'use client';

import { Check, X, Minus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import React from 'react'; // Added missing import for React

const features = [
  {
    category: 'Conversion Limits',
    features: [
      { name: 'Conversions per month', free: '100', pro: '1,000', business: '10,000', enterprise: 'Unlimited' },
      { name: 'File size limit', free: '10MB', pro: '100MB', business: '500MB', enterprise: 'Custom' },
      { name: 'Batch conversions', free: '1 file', pro: 'Up to 10 files', business: 'Up to 100 files', enterprise: 'Unlimited' },
    ]
  },
  {
    category: 'Features',
    features: [
      { name: 'All conversion types', free: false, pro: true, business: true, enterprise: true },
      { name: 'Conversion history', free: false, pro: true, business: true, enterprise: true },
      { name: 'API access', free: false, pro: '1K calls/month', business: '10K calls/month', enterprise: 'Unlimited' },
      { name: 'White-label options', free: false, pro: false, business: 'Basic', enterprise: 'Full' },
      { name: 'Team management', free: false, pro: false, business: true, enterprise: true },
      { name: 'Advanced analytics', free: false, pro: false, business: true, enterprise: true },
    ]
  },
  {
    category: 'Support',
    features: [
      { name: 'Email support', free: true, pro: true, business: true, enterprise: true },
      { name: 'Priority support', free: false, pro: true, business: true, enterprise: true },
      { name: 'Dedicated support', free: false, pro: false, business: false, enterprise: true },
      { name: 'SLA guarantees', free: false, pro: false, business: false, enterprise: true },
    ]
  },
  {
    category: 'Security & Compliance',
    features: [
      { name: 'SOC 2 Type II', free: true, pro: true, business: true, enterprise: true },
      { name: 'ISO 27001', free: true, pro: true, business: true, enterprise: true },
      { name: 'GDPR compliance', free: true, pro: true, business: true, enterprise: true },
      { name: 'Custom security', free: false, pro: false, business: false, enterprise: true },
    ]
  }
];

const plans = [
  { name: 'Free', color: 'bg-muted' },
  { name: 'Pro', color: 'bg-primary/10' },
  { name: 'Business', color: 'bg-secondary/10' },
  { name: 'Enterprise', color: 'bg-accent/10' }
];

export function ComparisonTable() {
  const renderFeatureValue = (value: string | boolean | number) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-red-500 mx-auto" />
      );
    }
    
    if (value === 'Custom' || value === 'Unlimited') {
      return (
        <Badge variant="secondary" className="mx-auto">
          {value}
        </Badge>
      );
    }
    
    return <span className="text-sm text-muted-foreground">{value}</span>;
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Feature Comparison
          </h2>
          <p className="text-lg text-muted-foreground">
            See exactly what&apos;s included in each plan
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table className="bg-background rounded-lg border">
            <TableHeader>
              <TableRow>
                <TableHead className="w-64 font-semibold">Features</TableHead>
                {plans.map((plan) => (
                  <TableHead key={plan.name} className="text-center">
                    <div className={`${plan.color} p-4 rounded-lg`}>
                      <div className="font-semibold text-lg">{plan.name}</div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((category) => (
                <React.Fragment key={category.category}>
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={5} className="font-semibold text-lg py-4">
                      {category.category}
                    </TableCell>
                  </TableRow>
                  {category.features.map((feature, index) => (
                    <TableRow key={index} className="hover:bg-muted/30">
                      <TableCell className="font-medium py-4">
                        {feature.name}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {renderFeatureValue(feature.free)}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {renderFeatureValue(feature.pro)}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {renderFeatureValue(feature.business)}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {renderFeatureValue(feature.enterprise)}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            All plans include our core conversion engine and basic security features.
            <br />
            Need help choosing? <a href="/contact-sales" className="text-primary hover:underline">Contact our team</a> for personalized recommendations.
          </p>
        </div>
      </div>
    </section>
  );
}
