'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Search, ArrowRight, ChevronRight, FileText, Grid2X2, ArrowLeft, Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getCategoryData, type FormatEntry } from '@/lib/conversions';
import { CONVERSION_CATEGORIES } from '@/lib/constants';

const CATEGORY_COLORS: Record<string, string> = {
  images:        'bg-blue-500/10 text-blue-600',
  video:         'bg-red-500/10 text-red-600',
  audio:         'bg-green-500/10 text-green-600',
  documents:     'bg-purple-500/10 text-purple-600',
  archives:      'bg-amber-500/10 text-amber-600',
  cad:           'bg-cyan-500/10 text-cyan-600',
  fonts:         'bg-pink-500/10 text-pink-600',
  vector:        'bg-indigo-500/10 text-indigo-600',
  ebooks:        'bg-teal-500/10 text-teal-600',
  presentations: 'bg-orange-500/10 text-orange-600',
  spreadsheets:  'bg-emerald-500/10 text-emerald-600',
};

function FormatCard({ format, colorClass }: { format: FormatEntry; colorClass: string }) {
  const targets   = format.conversions.slice(0, 6).map((c) => c.targetFormat);
  const remaining = format.conversions.length - 6;

  return (
    <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono ${colorClass}`}>
            {format.name}
          </div>
          <Badge variant="outline" className="text-xs">{format.conversions.length} targets</Badge>
        </div>
        <CardDescription className="text-xs leading-relaxed line-clamp-2 mt-1">
          {format.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {targets.map((t) => (
            <Link key={t} href={`/convert?from=${format.name}&to=${t}`}
              className="text-xs bg-muted hover:bg-primary hover:text-primary-foreground px-2 py-0.5 rounded transition-colors font-mono">
              {t}
            </Link>
          ))}
          {remaining > 0 && (
            <span className="text-xs text-muted-foreground px-2 py-0.5">+{remaining} more</span>
          )}
        </div>
        <Separator />
        <Link href={`/convert?from=${format.name}`}
          className="flex items-center gap-1.5 text-xs font-medium text-primary group-hover:gap-2 transition-all">
          Convert {format.name} files <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function CategoryPageClient({ category }: { category: string }) {
  const data = getCategoryData(category);
  if (!data) notFound();

  const meta       = CONVERSION_CATEGORIES.find((c) => c.id === category);
  const colorClass = CATEGORY_COLORS[category] ?? 'bg-primary/10 text-primary';
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return data.formats;
    return data.formats.filter((f) =>
      f.name.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.conversions.some((c) => c.targetFormat.toLowerCase().includes(q)),
    );
  }, [data.formats, query]);

  const totalPairs = data.formats.reduce((sum, f) => sum + f.conversions.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 border-b">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{meta?.name ?? data.title}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{meta?.name ?? data.title}</h1>
                  <p className="text-muted-foreground mt-1 max-w-2xl">
                    {meta?.description ?? `Convert between all ${(meta?.name ?? data.title).toLowerCase()} formats.`}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-6 mt-4 text-sm">
                <div><span className="font-bold text-2xl">{data.formats.length}</span><span className="text-muted-foreground ml-1.5">source formats</span></div>
                <div><span className="font-bold text-2xl">{totalPairs.toLocaleString()}</span><span className="text-muted-foreground ml-1.5">conversion pairs</span></div>
                <div><span className="font-bold text-2xl text-green-600">Free</span><span className="text-muted-foreground ml-1.5">to start</span></div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild className="gap-2">
                <Link href="/tools"><ArrowLeft className="h-4 w-4" /> All tools</Link>
              </Button>
              <Button asChild className="gap-2">
                <Link href={`/convert?category=${category}`}><Zap className="h-4 w-4" /> Start converting</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="relative max-w-lg mb-10">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder={`Search ${data.formats.length} formats…`}
              className="pl-9 h-11" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          {query.trim() && (
            <p className="text-sm text-muted-foreground mb-6">
              {filtered.length === 0 ? 'No formats match.' : `Showing ${filtered.length} of ${data.formats.length} formats`}
            </p>
          )}

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((format) => (
                <FormatCard key={format.name} format={format} colorClass={colorClass} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Grid2X2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No formats found for &ldquo;{query}&rdquo;</p>
              <Button variant="outline" className="mt-4" onClick={() => setQuery('')}>Clear search</Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold mb-6">Other categories</h2>
          <div className="flex flex-wrap gap-3">
            {CONVERSION_CATEGORIES.filter((c) => c.id !== category).map((c) => (
              <Link key={c.id} href={`/tools/${c.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-background hover:bg-accent transition-colors text-sm font-medium">
                {c.name} <Badge variant="outline" className="text-xs">{c.count}</Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
