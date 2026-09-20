import { Metadata } from 'next';
import { ApiOverview } from '@/components/api/api-overview';
import { AuthenticationDocs } from '@/components/api/authentication-docs';
import { EndpointReference } from '@/components/api/endpoint-reference';
import { CodeExamples } from '@/components/api/code-examples';
import { SdkDownloads } from '@/components/api/sdk-downloads';
import { RateLimiting } from '@/components/api/rate-limiting';
import { WebhookDocs } from '@/components/api/webhook-docs';

export const metadata: Metadata = {
  title: 'API Documentation - FileConverter Pro',
  description: 'Comprehensive API documentation for FileConverter Pro. Get started with authentication, endpoints, code examples, and SDK downloads.',
};

export default function ApiPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            API Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Build powerful file conversion workflows with our RESTful API. 
            Support for 2,000+ formats with enterprise-grade reliability.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">&lt;100ms</div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* API Overview */}
      <ApiOverview />

      {/* Authentication Documentation */}
      <AuthenticationDocs />

      {/* Endpoint Reference */}
      <EndpointReference />

      {/* Code Examples */}
      <CodeExamples />

      {/* SDK Downloads */}
      <SdkDownloads />

      {/* Rate Limiting */}
      <RateLimiting />

      {/* Webhook Documentation */}
      <WebhookDocs />
    </div>
  );
}
