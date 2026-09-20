'use client';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <Container>
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 border border-primary/20">
            <Sparkles className="h-4 w-4" />
            <span>2,000+ conversion types now available</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Convert Files Between{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              2,000+ Formats
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Enterprise-grade file conversion with developer-friendly APIs. 
            Support for documents, images, audio, video, archives, and more.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" className="text-lg px-8 py-6 h-auto" asChild>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto" asChild>
              <Link href="/tools">
                <Play className="mr-2 h-5 w-5" />
                View All Tools
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">2,000+</div>
              <div className="text-sm text-muted-foreground">Conversion Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">50M+</div>
              <div className="text-sm text-muted-foreground">Files Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">12</div>
              <div className="text-sm text-muted-foreground">File Categories</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}