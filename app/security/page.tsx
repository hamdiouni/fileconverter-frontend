import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Server, Zap, CheckCircle } from 'lucide-react';

export const metadata: Metadata = { title: 'Security - FileConverter Pro' };

const features = [
  { icon: Shield, title: 'SOC 2 Type II Certified', body: 'Independently audited annually to verify our security controls meet the highest industry standards.' },
  { icon: CheckCircle, title: 'ISO 27001 Certified', body: 'Our information security management system is certified to the globally recognised ISO 27001 standard.' },
  { icon: Lock, title: 'TLS 1.3 In Transit', body: 'All data transferred between your browser and our servers is protected with TLS 1.3 encryption.' },
  { icon: Server, title: 'AES-256 At Rest', body: 'Every file and database record is encrypted at rest using AES-256, the gold standard for data encryption.' },
  { icon: Eye, title: 'Virus Scanning', body: 'Every uploaded file is scanned with multi-engine antivirus before processing to protect you and our infrastructure.' },
  { icon: Zap, title: 'Auto-Deleted After 24 h', body: 'Uploaded and converted files are permanently deleted from our servers within 24 hours — no exceptions.' },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Green hero */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Shield className="w-16 h-16 opacity-90" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Security You Can Trust</h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            Enterprise-grade security built into every layer. Your files and data are protected at all times.
          </p>
        </div>
      </section>

      {/* Feature grid */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Responsible disclosure */}
        <div className="rounded-xl border bg-muted/40 p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Responsible Disclosure</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Found a vulnerability? We take security reports seriously. Please email{' '}
            <a href="mailto:security@fileconverterpro.com" className="text-primary underline">
              security@fileconverterpro.com
            </a>{' '}
            and we will respond within 48 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
