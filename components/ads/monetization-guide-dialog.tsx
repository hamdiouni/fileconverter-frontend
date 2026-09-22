'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  HelpCircle,
  ExternalLink,
  Copy,
  Check,
  TrendingUp,
  CreditCard,
  Layers,
  Code2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function MonetizationGuideDialog() {
  const [copied, setCopied] = useState(false);

  const adsTxtSample = `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`;

  const handleCopy = () => {
    navigator.clipboard.writeText(adsTxtSample);
    setCopied(true);
    toast.success('Copied ads.txt line to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-xs border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30">
          <DollarSign className="w-3.5 h-3.5" />
          <span>How to Connect Ads & Earn Money</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">Ad Monetization Guide</DialogTitle>
              <DialogDescription>
                How to connect ad networks (Google AdSense, Mediavine) and generate revenue.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="steps" className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="steps">1. Setup Steps</TabsTrigger>
            <TabsTrigger value="code">2. Code Integration</TabsTrigger>
            <TabsTrigger value="revenue">3. How You Get Paid</TabsTrigger>
          </TabsList>

          {/* Tab 1: Setup Steps */}
          <TabsContent value="steps" className="space-y-4 pt-4">
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-border bg-card/60 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Step 1</Badge>
                  <h4 className="font-semibold text-sm">Sign Up for an Ad Network</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The most popular network for file converter tools is <strong>Google AdSense</strong>. Alternatives include <strong>EthicalAds</strong> (developer-focused), <strong>Mediavine / Monumetric</strong> (for high traffic), and <strong>Adsterra</strong>.
                </p>
                <div className="pt-2">
                  <Button size="sm" variant="outline" className="text-xs gap-1" asChild>
                    <a href="https://www.google.com/adsense/start/" target="_blank" rel="noopener noreferrer">
                      <span>Apply to Google AdSense</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card/60 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Step 2</Badge>
                  <h4 className="font-semibold text-sm">Place your ads.txt in the Public Directory</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ad networks require an <code>ads.txt</code> file located at <code>https://yourdomain.com/ads.txt</code> to verify you own the website. We have already created <code>public/ads.txt</code> for you.
                </p>
                <div className="flex items-center justify-between bg-muted/60 p-2.5 rounded-lg text-xs font-mono">
                  <span>{adsTxtSample}</span>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleCopy}>
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card/60 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Step 3</Badge>
                  <h4 className="font-semibold text-sm">Create Ad Units</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  In your AdSense dashboard:
                  <br />• Create a <strong>Horizontal Display Banner (728x90)</strong> for the bottom ad.
                  <br />• Create a <strong>Vertical Skyscraper (160x600 or 300x600)</strong> for the left and right sidebars.
                  <br />Copy your <code>data-ad-client</code> (e.g. <code>ca-pub-1234567890</code>) and <code>data-ad-slot</code>.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Code Integration */}
          <TabsContent value="code" className="space-y-4 pt-4">
            <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm">Connecting your AdSense IDs</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Open <code>app/convert/page.tsx</code> and pass your AdSense IDs to the <code>AdBanner</code> components:
              </p>
              <pre className="bg-muted/80 p-3 rounded-lg text-[11px] font-mono overflow-x-auto text-foreground">
{`<AdBanner 
  position="bottom" 
  adClient="ca-pub-YOUR_ID_HERE" 
  adSlot="YOUR_SLOT_ID_HERE" 
/>`}
              </pre>
              <p className="text-xs text-muted-foreground">
                In <code>app/layout.tsx</code>, include the official Google AdSense script tag inside your <code>&lt;head&gt;</code>:
              </p>
              <pre className="bg-muted/80 p-3 rounded-lg text-[11px] font-mono overflow-x-auto text-foreground">
{`<script 
  async 
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID_HERE"
  crossOrigin="anonymous"
/>`}
              </pre>
            </div>
          </TabsContent>

          {/* Tab 3: How You Get Paid */}
          <TabsContent value="revenue" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-border bg-card/60 space-y-2">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>How Earnings Work</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  • <strong>CPM (Cost Per 1,000 Views)</strong>: You earn $1 to $6 per 1,000 visitors who see your converter pages.
                  <br />• <strong>CPC (Cost Per Click)</strong>: You earn $0.20 to $2.50 every time a visitor clicks on an ad.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card/60 space-y-2">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm">
                  <CreditCard className="w-4 h-4" />
                  <span>Payout Methods</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Google pays automatically every month (around the 21st) when your balance reaches <strong>$100</strong> via:
                  <br />• Direct Bank Wire Transfer (EFT)
                  <br />• Check or Single Euro Payments Area (SEPA)
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <h4 className="font-semibold text-xs text-primary flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                Tips to Maximize File Converter Revenue:
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li>Converter sites naturally have high conversion times (5–30 seconds), giving users high ad viewability.</li>
                <li>Position ads near the "Download File" and "Convert" buttons for natural engagement.</li>
                <li>Ensure organic traffic through SEO keywords (e.g., "PNG to PDF online", "Free MP4 converter").</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
