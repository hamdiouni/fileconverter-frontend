'use client';

import { Container } from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';
import { FEATURES } from '@/lib/constants';
import * as Icons from 'lucide-react';

export function Features() {
  return (
    <section className="py-20 bg-muted/30">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Why Choose FileConverter Pro?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built for developers, trusted by enterprises. Our platform delivers 
            industry-leading conversion capabilities with the reliability and 
            security your business demands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => {
            const IconComponent = Icons[feature.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
            return (
              <Card 
                key={feature.title} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group bg-background"
              >
                <CardContent className="p-8">
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}