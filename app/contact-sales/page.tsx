import { Metadata } from 'next';
import { ContactSales } from '@/components/pricing/contact-sales';

export const metadata: Metadata = {
  title: 'Contact Sales - FileConverter Pro',
  description: 'Talk to our enterprise sales team for custom volume pricing, dedicated infrastructure, and white-label conversion solutions.',
};

export default function ContactSalesPage() {
  return (
    <div className="min-h-screen bg-background">
      <ContactSales />
    </div>
  );
}
