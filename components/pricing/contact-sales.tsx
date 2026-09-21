'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Mail, Phone, MessageSquare, Users, Globe, Zap } from 'lucide-react';

export function ContactSales() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our Enterprise team is here to help you build the perfect file conversion solution 
            for your organization. Get custom pricing, dedicated support, and white-label options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="p-8">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl">Get in Touch</CardTitle>
              <CardDescription>
                Tell us about your needs and we&apos;ll create a custom solution for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" placeholder="Doe" required />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Work Email *</Label>
                <Input id="email" type="email" placeholder="john@company.com" required />
              </div>

              <div>
                <Label htmlFor="company">Company *</Label>
                <Input id="company" placeholder="Your Company Inc." required />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
              </div>

              <div>
                <Label htmlFor="companySize">Company Size *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-1000">201-1,000 employees</SelectItem>
                    <SelectItem value="1000+">1,000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="useCase">Primary Use Case *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary use case" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal document conversion</SelectItem>
                    <SelectItem value="customer-facing">Customer-facing conversions</SelectItem>
                    <SelectItem value="api-integration">API integration</SelectItem>
                    <SelectItem value="white-label">White-label solution</SelectItem>
                    <SelectItem value="enterprise">Enterprise workflow automation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="monthlyVolume">Estimated Monthly Conversions</Label>
                <Input id="monthlyVolume" placeholder="e.g., 50,000 conversions" />
              </div>

              <div>
                <Label htmlFor="requirements">Specific Requirements</Label>
                <Textarea 
                  id="requirements" 
                  placeholder="Tell us about your specific needs, integrations, compliance requirements, or any other details..."
                  rows={4}
                />
              </div>

              <Button className="w-full" size="lg">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Sales Team
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information & Benefits */}
          <div className="space-y-8">
            {/* Contact Info */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Enterprise Sales</p>
                    <p className="text-sm text-muted-foreground">enterprise@fileconverterpro.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Sales Hotline</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Available during business hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Benefits */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Enterprise Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Custom Pricing:</strong> Volume discounts and flexible billing options
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Dedicated Support:</strong> Technical account management and priority support
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">
                    <strong>White-Label Solutions:</strong> Custom branding and domain integration
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">
                    <strong>SLA Guarantees:</strong> 99.9% uptime and response time commitments
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Custom Integrations:</strong> API customization and workflow automation
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <CardContent className="text-center pt-6">
                <div className="text-3xl font-bold text-primary mb-2">24 Hours</div>
                <p className="text-sm text-muted-foreground">
                  Average response time for enterprise inquiries
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
