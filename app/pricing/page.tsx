import { Metadata } from 'next';
import { PricingPlans } from '@/components/pricing/pricing-plans';
import { ComparisonTable } from '@/components/pricing/comparison-table';
import { FAQ } from '@/components/pricing/faq';
import { ContactSales } from '@/components/pricing/contact-sales';

export const metadata: Metadata = {
  title: 'Pricing - FileConverter Pro',
  description: 'Choose the perfect plan for your file conversion needs. Free tier available, with Pro and Business plans for power users and enterprises.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start converting files for free, or unlock premium features with our Pro and Business plans. 
            No hidden fees, cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <PricingPlans />

      {/* Feature Comparison */}
      <ComparisonTable />

      {/* FAQ Section */}
      <FAQ />

      {/* Contact Sales */}
      <ContactSales />
    </div>
  );
}
