'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X, LayoutDashboard, LogOut, Settings, Key, Webhook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from './container';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { CONVERSION_CATEGORIES } from '@/lib/constants';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, init } = useAuthStore();

  // Hydrate auth state from localStorage on mount
  useEffect(() => { init(); }, [init]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Icons.Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">
                FileConverter Pro
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[800px] p-6">
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold mb-2">
                          2,000+ File Conversion Types
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Professional-grade conversion tools across all major file categories
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        {CONVERSION_CATEGORIES.map((category) => {
                          const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
                          return (
                            <Link
                              key={category.id}
                              href={`/tools/${category.id}`}
                              className="group rounded-lg p-4 hover:bg-accent transition-colors"
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  <IconComponent className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h5 className="font-semibold text-sm group-hover:text-primary">
                                      {category.name}
                                    </h5>
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                      {category.count}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {category.description}
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {category.subcategories[0]?.formats.slice(0, 4).map((format) => (
                                      <span
                                        key={format}
                                        className="text-xs bg-muted px-2 py-1 rounded"
                                      >
                                        {format}
                                      </span>
                                    ))}
                                    {category.subcategories[0]?.formats.length > 4 && (
                                      <span className="text-xs text-muted-foreground px-2 py-1">
                                        +{category.subcategories[0].formats.length - 4} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/pricing" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/api" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      API
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                        {user.email[0]?.toUpperCase()}
                      </div>
                      <span className="max-w-[120px] truncate text-xs">{user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="gap-2 cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="gap-2 cursor-pointer">
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/api-keys" className="gap-2 cursor-pointer">
                        <Key className="h-4 w-4" /> API Keys
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/webhooks" className="gap-2 cursor-pointer">
                        <Webhook className="h-4 w-4" /> Webhooks
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                      onClick={() => logout()}
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="space-y-4">
              <Link
                href="/"
                className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <div className="px-4">
                <details className="group">
                  <summary className="flex items-center justify-between py-2 text-sm font-medium cursor-pointer">
                    Tools
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-2 space-y-2 pl-4">
                    {CONVERSION_CATEGORIES.map((category) => (
                      <Link
                        key={category.id}
                        href={`/tools/${category.id}`}
                        className="block py-2 text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name} ({category.count})
                      </Link>
                    ))}
                  </div>
                </details>
              </div>
              <Link
                href="/pricing"
                className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/api"
                className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                API
              </Link>
              <div className="px-4 pt-4 border-t space-y-2">
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button className="w-full" size="sm" asChild>
                  <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
}