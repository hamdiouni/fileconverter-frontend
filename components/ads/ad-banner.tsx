'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ExternalLink, Sparkles, ShieldCheck, DollarSign, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/auth-store';
import { ADS_CONFIG } from '@/lib/ads-config';

export interface AdBannerProps {
  position: 'left' | 'right' | 'bottom';
  adClient?: string;
  adSlot?: string;
  className?: string;
}

export function AdBanner({ position, adClient, adSlot, className = '' }: AdBannerProps) {
  const { profile } = useAuthStore();
  const [closed, setClosed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ── Paid Subscribers ('pro', 'business', 'enterprise') NEVER see ads ─────────
  const isPaidUser =
    profile?.tier === 'pro' ||
    profile?.tier === 'business' ||
    profile?.tier === 'enterprise' ||
    (typeof window !== 'undefined' && (
      localStorage.getItem('user_tier') === 'pro' ||
      localStorage.getItem('user_tier') === 'business' ||
      localStorage.getItem('user_tier') === 'enterprise' ||
      localStorage.getItem('ad_free') === 'true'
    ));

  // Global toggle check
  if (!ADS_CONFIG.enabled || isPaidUser || !isClient || closed) {
    return null;
  }

  // Resolve client & slot from props or central ads-config
  const finalClient = adClient || ADS_CONFIG.adClient;
  const finalSlot =
    adSlot ||
    (position === 'bottom'
      ? ADS_CONFIG.slots.bottomLeaderboard
      : position === 'left'
      ? ADS_CONFIG.slots.leftSkyscraper
      : ADS_CONFIG.slots.rightSkyscraper);

  // ── Bottom Leaderboard Banner (Sticky at bottom with close) ──
  if (position === 'bottom') {
    return (
      <aside
        aria-label="Sponsored Advertisement"
        className={`fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border shadow-2xl transition-all duration-300 ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          {/* Ad Label & Upgrade Incentive */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
              Ad
            </span>
            <Link
              href="/pricing"
              className="text-[11px] text-primary/80 hover:text-primary flex items-center gap-1 font-medium transition-colors"
            >
              <Crown className="w-3 h-3 text-amber-500" />
              <span>Remove Ads with Pro</span>
            </Link>
          </div>

          {/* Ad Content (Google AdSense Slot or Fallback Unit) */}
          <div className="flex-1 flex items-center justify-center min-h-[50px] max-h-[90px] overflow-hidden">
            {finalClient && finalSlot ? (
              <ins
                className="adsbygoogle block w-full text-center"
                style={{ display: 'inline-block', width: '728px', height: '90px' }}
                data-ad-client={finalClient}
                data-ad-slot={finalSlot}
                data-ad-format="horizontal"
                data-full-width-responsive="true"
              />
            ) : (
              <a
                href="https://workspace.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 sm:gap-6 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/5 hover:from-primary/20 hover:to-secondary/20 border border-primary/20 transition-all text-xs sm:text-sm text-foreground w-full max-w-2xl justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Fast Cloud Storage &amp; Workspaces
                    </p>
                    <p className="text-[11px] text-muted-foreground hidden sm:block">
                      Enterprise-grade conversion speed, automated backups, and 99.99% uptime SLA.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-primary text-xs font-medium whitespace-nowrap bg-primary/10 px-2.5 py-1 rounded-full">
                  <span>Learn More</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>
            )}
          </div>

          {/* Dismiss button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setClosed(true)}
            className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0 rounded-full"
            title="Close ad"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </aside>
    );
  }

  // ── Left or Right Skyscraper Banner (Desktop Only) ──
  const isLeft = position === 'left';

  return (
    <aside
      aria-label={`Sponsored ${position} advertisement`}
      className={`hidden 2xl:flex flex-col items-center justify-start sticky top-24 w-[160px] min-h-[600px] p-3 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-sm transition-all ${className}`}
    >
      {/* Top Header with Upgrade Link */}
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-border/60">
        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
          Ad
        </span>
        <Link
          href="/pricing"
          className="text-[9px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5"
          title="Upgrade to remove ads"
        >
          <Crown className="w-2.5 h-2.5" />
          <span>No Ads</span>
        </Link>
        <button
          onClick={() => setClosed(true)}
          className="text-muted-foreground hover:text-foreground text-xs"
          title="Hide ad"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Ad Space */}
      <div className="w-full flex-1 flex flex-col justify-between items-center text-center py-4">
        {finalClient && finalSlot ? (
          <ins
            className="adsbygoogle block w-full h-[600px]"
            data-ad-client={finalClient}
            data-ad-slot={finalSlot}
            data-ad-format="vertical"
          />
        ) : (
          <div className="flex flex-col items-center justify-between h-full w-full space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground shadow-md">
              <DollarSign className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className="text-[10px] px-2 py-0 border-primary/30 text-primary">
                Sponsored
              </Badge>
              <h4 className="text-xs font-bold leading-snug">
                {isLeft ? 'Cloud API for High-Volume Conversion' : 'Fast Unlimited File Archiving'}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {isLeft
                  ? 'Convert 100k+ files monthly via REST API.'
                  : 'Compress & encrypt GBs of data in seconds.'}
              </p>
            </div>

            <div className="w-full pt-4 border-t border-border/60 space-y-2">
              <Button size="sm" variant="secondary" className="w-full text-xs h-7 gap-1" asChild>
                <Link href="/pricing">
                  <span>Upgrade</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Privacy note */}
      <div className="pt-2 text-[9px] text-muted-foreground/70 flex items-center gap-1">
        <ShieldCheck className="w-3 h-3 text-green-500" />
        <span>Verified Ad</span>
      </div>
    </aside>
  );
}
