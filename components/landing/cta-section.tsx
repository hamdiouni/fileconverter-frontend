'use client';

import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Zap } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20">
      <Container>
        <div className="relative">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl" />
          
          {/* Content */}
          <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center text-white">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Code className="h-6 w-6" />
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Zap className="h-6 w-6" />
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
              Join thousands of developers building amazing applications with our 
              enterprise-grade file conversion platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8 py-6 h-auto bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 h-auto border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/api">
                  View API Docs
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 text-white/80">
              Already have an account?{' '}
              <Link href="/login" className="underline hover:no-underline font-medium">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}