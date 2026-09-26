'use client';

import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { ConnectionTester } from '@/components/utils/connection-tester';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system">
      {children}
      <ConnectionTester />
      <Toaster richColors closeButton position="top-right" />
    </ThemeProvider>
  );
}