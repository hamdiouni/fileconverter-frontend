'use client';

import { Container } from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';
import { TESTIMONIALS } from '@/lib/constants';
import { Quote } from 'lucide-react';

export function Testimonials() {
  return (
    <section className="py-20 bg-muted/30">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Trusted by Developers Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of developers and enterprises who rely on FileConverter Pro 
            for their critical file conversion needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg bg-background">
              <CardContent className="p-8">
                <div className="mb-4">
                  <Quote className="h-8 w-8 text-primary/20" />
                </div>
                <blockquote className="text-lg leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.title}, {testimonial.company}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}