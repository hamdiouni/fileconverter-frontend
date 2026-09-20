import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FileConverter Pro - Convert Files Between 2,000+ Formats',
  description: 'Enterprise-grade file conversion with developer-friendly APIs. Support for documents, images, audio, video, archives, and more. SOC 2 & ISO 27001 compliant.',
  keywords: 'file conversion, API, documents, images, audio, video, archives, developer tools, enterprise',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}