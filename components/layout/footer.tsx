import Link from 'next/link';
import { Container } from './container';
import * as Icons from 'lucide-react';
import { CONVERSION_CATEGORIES } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t mt-16">
      <Container>
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Icons.Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl text-foreground">
                  FileConverter Pro
                </span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Enterprise-grade file conversion with developer-friendly APIs. 
                Support for 2,000+ conversion types across 12 major categories.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Icons.Github className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Icons.Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <Icons.Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/tools" className="text-muted-foreground hover:text-foreground">
                    All Tools
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="text-muted-foreground hover:text-foreground">
                    API Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/enterprise" className="text-muted-foreground hover:text-foreground">
                    Enterprise
                  </Link>
                </li>
              </ul>
            </div>

            {/* Tools */}
            <div>
              <h3 className="font-semibold mb-4">Popular Tools</h3>
              <ul className="space-y-3 text-sm">
                {CONVERSION_CATEGORIES.slice(0, 4).map((category) => (
                  <li key={category.id}>
                    <Link 
                      href={`/tools/${category.id}`} 
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/help" className="text-muted-foreground hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="text-muted-foreground hover:text-foreground">
                    System Status
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="text-muted-foreground hover:text-foreground">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 FileConverter Pro. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}