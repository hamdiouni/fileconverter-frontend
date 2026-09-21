'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Image, Music, Video, Archive, Book, Presentation, Table, Compass, Type, Zap } from 'lucide-react';
import Link from 'next/link';

const conversionCategories = [
  {
    id: 'documents',
    name: 'Documents',
    description: 'Convert between Word, PDF, TXT, HTML, and more document formats',
    icon: FileText,
    color: 'bg-blue-500/10 text-blue-600',
    count: 199,
    popularFormats: ['PDF', 'DOCX', 'TXT', 'HTML', 'RTF', 'ODT'],
    features: ['OCR Support', 'Batch Processing', 'Quality Preservation']
  },
  {
    id: 'images',
    name: 'Images',
    description: 'Transform images between JPG, PNG, SVG, WEBP, and other formats',
    icon: Image,
    color: 'bg-green-500/10 text-green-600',
    count: 199,
    popularFormats: ['JPG', 'PNG', 'SVG', 'WEBP', 'TIFF', 'GIF'],
    features: ['Resize Options', 'Quality Control', 'Metadata Preservation']
  },
  {
    id: 'audio',
    name: 'Audio',
    description: 'Convert audio files between MP3, WAV, FLAC, OGG, and more',
    icon: Music,
    color: 'bg-purple-500/10 text-purple-600',
    count: 199,
    popularFormats: ['MP3', 'WAV', 'FLAC', 'AAC', 'OGG', 'M4A'],
    features: ['Bitrate Control', 'Format Optimization', 'Batch Conversion']
  },
  {
    id: 'video',
    name: 'Video',
    description: 'Transform videos between MP4, AVI, MOV, WEBM, and other formats',
    icon: Video,
    color: 'bg-red-500/10 text-red-600',
    count: 199,
    popularFormats: ['MP4', 'AVI', 'MOV', 'WEBM', 'MKV', 'WMV'],
    features: ['Resolution Options', 'Codec Selection', 'Streaming Optimization']
  },
  {
    id: 'archives',
    name: 'Archives',
    description: 'Convert between ZIP, RAR, 7Z, TAR, and other archive formats',
    icon: Archive,
    color: 'bg-orange-500/10 text-orange-600',
    count: 199,
    popularFormats: ['ZIP', 'RAR', '7Z', 'TAR', 'ISO', 'DMG'],
    features: ['Compression Levels', 'Password Protection', 'Multi-part Archives']
  },
  {
    id: 'ebooks',
    name: 'Ebooks',
    description: 'Convert ebooks between EPUB, MOBI, PDF, AZW, and more',
    icon: Book,
    color: 'bg-indigo-500/10 text-indigo-600',
    count: 199,
    popularFormats: ['EPUB', 'MOBI', 'PDF', 'AZW', 'AZW3', 'LIT'],
    features: ['DRM Support', 'Format Optimization', 'Metadata Handling']
  },
  {
    id: 'presentations',
    name: 'Presentations',
    description: 'Convert presentations between PPT, KEY, ODP, and other formats',
    icon: Presentation,
    color: 'bg-pink-500/10 text-pink-600',
    count: 199,
    popularFormats: ['PPT', 'PPTX', 'KEY', 'ODP', 'PDF', 'HTML'],
    features: ['Slide Preservation', 'Animation Support', 'Export Options']
  },
  {
    id: 'spreadsheets',
    name: 'Spreadsheets',
    description: 'Convert spreadsheets between XLS, CSV, NUMBERS, and more',
    icon: Table,
    color: 'bg-teal-500/10 text-teal-600',
    count: 199,
    popularFormats: ['XLS', 'XLSX', 'CSV', 'NUMBERS', 'ODS', 'PDF'],
    features: ['Data Integrity', 'Formula Preservation', 'Formatting Options']
  },
  {
    id: 'cad',
    name: 'CAD Files',
    description: 'Convert CAD files between DWG, DXF, and export to various formats',
    icon: Compass,
    color: 'bg-cyan-500/10 text-cyan-600',
    count: 199,
    popularFormats: ['DWG', 'DXF', 'PDF', 'SVG', 'PNG', 'STL'],
    features: ['Layer Support', 'Scale Preservation', '3D Rendering']
  },
  {
    id: 'fonts',
    name: 'Fonts',
    description: 'Convert fonts between TTF, WOFF, OTF, and other font formats',
    icon: Type,
    color: 'bg-amber-500/10 text-amber-600',
    count: 199,
    popularFormats: ['TTF', 'OTF', 'WOFF', 'WOFF2', 'EOT', 'SVG'],
    features: ['Subset Creation', 'Web Optimization', 'Cross-platform Support']
  }
];

export function CategoryGrid() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            All Conversion Categories
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore our comprehensive collection of file conversion tools. 
            Each category offers specialized features and format support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {conversionCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count} formats
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {category.name}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {category.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Popular Formats */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">Popular Formats</h4>
                    <div className="flex flex-wrap gap-1">
                      {category.popularFormats.map((format) => (
                        <Badge key={format} variant="outline" className="text-xs">
                          {format}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">Key Features</h4>
                    <ul className="space-y-1">
                      {category.features.map((feature, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-center">
                          <Zap className="h-3 w-3 text-primary mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    asChild 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    variant="outline"
                  >
                    <Link href={`/tools/${category.id}`}>
                      Explore {category.name}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Card className="inline-block p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold mb-4">
                Can&apos;t find what you&apos;re looking for?
              </h3>
              <p className="text-muted-foreground mb-6">
                Our platform supports 2,000+ conversion types. Contact us if you need a specific format or have custom requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/contact-sales">
                    Contact Sales
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/api">
                    View API Docs
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
