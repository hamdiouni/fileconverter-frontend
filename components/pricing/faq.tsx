'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';

const faqs = [
  {
    question: 'What file formats do you support?',
    answer: 'We support over 2,000 file formats across all major categories including documents, images, audio, video, archives, ebooks, presentations, spreadsheets, CAD files, and fonts. Our platform handles everything from common formats like PDF, JPG, and MP3 to specialized formats like DWG, EPUB, and RAW image files.'
  },
  {
    question: 'Is there a free tier available?',
    answer: 'Yes! We offer a free tier that includes 100 conversions per month with a 10MB file size limit. This is perfect for occasional users who want to try our service. You can upgrade to Pro ($29/month) or Business ($99/month) anytime to unlock more features and higher limits.'
  },
  {
    question: 'How does billing work?',
    answer: 'We offer simple, transparent pricing with no hidden fees. All plans are billed monthly and you can cancel anytime. Pro plans start at $29/month and include 1,000 conversions with 100MB file limits. Business plans at $99/month include 10,000 conversions with 500MB file limits. Enterprise plans have custom pricing based on your specific needs.'
  },
  {
    question: 'What happens if I exceed my monthly conversion limit?',
    answer: 'If you exceed your monthly conversion limit, you have a few options: 1) Upgrade to the next tier to get more conversions, 2) Wait until your limit resets next month, or 3) Contact us for a custom plan if you need more conversions immediately. We\'ll never charge you extra without your permission.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied with our service within the first 30 days, we\'ll provide a full refund. After 30 days, we don\'t offer refunds but you can cancel your subscription anytime and won\'t be charged for the next billing cycle.'
  },
  {
    question: 'Can I change my plan anytime?',
    answer: 'Absolutely! You can upgrade or downgrade your plan at any time. When you upgrade, you\'ll be charged the prorated difference for the current billing period. When you downgrade, the new rate will apply at your next billing cycle. All changes take effect immediately.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) and PayPal. For Enterprise customers, we also offer invoice-based billing with net 30 payment terms. All payments are processed securely through Stripe, and we never store your payment information.'
  },
  {
    question: 'Is there a setup fee?',
    answer: 'No setup fees! All our plans have zero setup costs. You can start using our service immediately after signing up. The only charges are the monthly subscription fees for paid plans. Enterprise customers may have custom setup requirements, but these are discussed during the sales process.'
  },
  {
    question: 'Do you offer discounts for nonprofits or educational institutions?',
    answer: 'Yes, we offer special pricing for qualified nonprofits, educational institutions, and government organizations. Please contact our sales team with your organization details and we\'ll provide you with a custom quote that fits your budget and needs.'
  },
  {
    question: 'What support do you provide?',
    answer: 'Free users get email support with response times within 24 hours. Pro and Business users get priority support with response times within 4 hours. Enterprise users get dedicated support with response times within 1 hour and access to our technical account management team. All users have access to our comprehensive documentation and knowledge base.'
  }
];

export function FAQ() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Get answers to common questions about our pricing and plans
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left py-6 hover:no-underline">
                  <span className="font-semibold text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Still have questions? <a href="/contact" className="text-primary hover:underline">Contact our support team</a> or{' '}
            <a href="/contact-sales" className="text-primary hover:underline">speak with sales</a> for personalized assistance.
          </p>
        </div>
      </div>
    </section>
  );
}
