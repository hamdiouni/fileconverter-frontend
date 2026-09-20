'use client';

import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CONVERSION_CATEGORIES } from '@/lib/constants';
import * as Icons from 'lucide-react';
import { ArrowRight } from 'lucide-react';

export function Categories() {
  return (
    <section className="py-20">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Comprehensive Format Support
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Convert between thousands of file formats across all major categories. 
            Our enterprise-grade conversion engine handles everything from simple 
            document conversions to complex media transformations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CONVERSION_CATEGORIES.slice(0, 6).map((category) => {
            const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
            return (
              <Card 
                key={category.id} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 shadow-sm bg-background"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {category.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {category.subcategories[0]?.formats.slice(0, 3).map((format) => (
                          <span
                            key={format}
                            className="text-xs bg-muted px-2 py-1 rounded font-mono"
                          >
                            {format}
                          </span>
                        ))}
                        <span className="text-xs text-muted-foreground px-2 py-1">
                          +{category.count - 3} more
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <Link href={`/tools/${category.id}`} className="absolute inset-0" />
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/tools">
              View All Categories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}