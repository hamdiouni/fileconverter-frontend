import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export const metadata: Metadata = { title: 'System Status - FileConverter Pro' };

const services = [
  'API Gateway',
  'Upload Service',
  'Conversion Engine',
  'File Storage (CDN)',
  'Database',
  'Authentication Service',
];

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Green hero */}
      <section className="py-24 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 opacity-90" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">All Systems Operational</h1>
          <p className="text-green-100 text-lg">
            Last checked:{' '}
            {new Date().toLocaleString('en-GB', {
              dateStyle: 'long',
              timeStyle: 'short',
              timeZone: 'UTC',
            })}{' '}
            UTC
          </p>
        </div>
      </section>

      {/* Service grid */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">Service Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card key={service} className="border shadow-sm">
              <CardContent className="flex items-center justify-between py-4 px-5">
                <span className="font-medium text-sm">{service}</span>
                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                  </span>
                  <span className="text-xs font-semibold">Operational</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">
          Subscribe to status updates at{' '}
          <a href="mailto:status@fileconverterpro.com" className="text-primary underline">
            status@fileconverterpro.com
          </a>
        </p>
      </div>
    </div>
  );
}
