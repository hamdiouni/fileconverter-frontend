'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, Globe, Zap, Shield, Clock, Database } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Code,
    title: 'RESTful API',
    description: 'Standard HTTP methods with JSON responses. Easy to integrate with any programming language.',
    color: 'bg-blue-500/10 text-blue-600'
  },
  {
    icon: Globe,
    title: 'Global CDN',
    description: 'Files are processed in the region closest to you for optimal performance and speed.',
    color: 'bg-green-500/10 text-green-600'
  },
  {
    icon: Zap,
    title: 'Async Processing',
    description: 'Non-blocking file conversions with webhook notifications when jobs complete.',
    color: 'bg-yellow-500/10 text-yellow-600'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 Type II & ISO 27001 compliant with end-to-end encryption and secure file handling.',
    color: 'bg-purple-500/10 text-purple-600'
  },
  {
    icon: Clock,
    title: 'Real-time Status',
    description: 'Track conversion progress with detailed status updates and estimated completion times.',
    color: 'bg-orange-500/10 text-orange-600'
  },
  {
    icon: Database,
    title: 'Format Support',
    description: '2,000+ input and output formats across all major file categories and use cases.',
    color: 'bg-red-500/10 text-red-600'
  }
];

export function ApiOverview() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Getting Started
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our API is designed to be simple yet powerful. Get up and running in minutes with our comprehensive documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Base URL and Quick Start */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Base URL */}
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Base URL
              </CardTitle>
              <CardDescription>
                All API requests should be made to this base URL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <code className="text-sm font-mono text-primary">
                  https://api.fileconverterpro.com/v1
                </code>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Production:</strong> https://api.fileconverterpro.com/v1
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Sandbox:</strong> https://sandbox-api.fileconverterpro.com/v1
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Versioning:</strong> API versioning is handled in the URL path
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Start */}
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Quick Start
              </CardTitle>
              <CardDescription>
                Get your first conversion running in 3 simple steps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                    1
                  </Badge>
                  <span className="text-sm">Get your API key from the dashboard</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                    2
                  </Badge>
                  <span className="text-sm">Upload a file using the /upload endpoint</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                    3
                  </Badge>
                  <span className="text-sm">Convert using the /convert endpoint</span>
                </div>
              </div>
              <Button asChild className="w-full mt-4">
                <Link href="/auth/signup">
                  Get API Key
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* API Status */}
        <div className="mt-16 text-center">
          <Card className="inline-block p-6 bg-green-50 border-green-200">
            <CardContent className="p-0">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800">API Status: All Systems Operational</span>
                <Badge variant="outline" className="ml-2">99.9% Uptime</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
