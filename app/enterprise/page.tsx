import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck2, Headset, Palette, KeyRound, Server, Plug } from 'lucide-react';

export const metadata: Metadata = { title: 'Enterprise - FileConverter Pro' };

const features = [
  {
    icon: FileCheck2,
    title: 'Custom SLAs',
    body: 'Guaranteed uptime and response-time commitments tailored to your business needs, backed by financial penalties if we miss them.',
  },
  {
    icon: Headset,
    title: 'Dedicated Support',
    body: 'A named customer success manager and a private Slack channel with direct access to our engineering team — no ticket queues.',
  },
  {
    icon: Palette,
    title: 'White-Label Solutions',
    body: 'Deploy FileConverter Pro under your own brand with custom domains, logos, and colour schemes for a seamless customer experience.',
  },
  {
    icon: KeyRound,
    title: 'SSO & SAML',
    body: 'Integrate with Okta, Azure AD, Google Workspace, or any SAML 2.0 / OIDC identity provider for centralised access management.',
  },
  {
    icon: Server,
    title: 'On-Premise Deployment',
    body: 'Run FileConverter Pro entirely within your own infrastructure or private cloud for maximum data sovereignty and compliance.',
  },
  {
    icon: Plug,
    title: 'Custom Integrations',
    body: 'Our solutions engineers will build bespoke connectors for your ERP, CMS, or internal tools via webhooks and our GraphQL API.',
  },
];

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 border-b">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <span className="inline-block rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1 mb-4 uppercase tracking-wider">
            Enterprise
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-5">
            File Conversion at Enterprise Scale
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Security, compliance, and performance for organisations that demand the very best. Trusted by Fortune 500 companies worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Talk to Sales</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <h2 className="text-2xl font-semibold text-center mb-10">Everything Your Enterprise Needs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA banner */}
        <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border p-10 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Speak with our enterprise team to get a custom quote and a live demo tailored to your use case.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Contact Sales</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">Compare Plans</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
