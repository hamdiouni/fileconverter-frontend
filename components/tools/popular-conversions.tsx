'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, FileText, Image, Music, Video, Archive, Book, Presentation, Table, Compass, Type, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const popularConversions = [
  {
    id: 'pdf-to-docx',
    name: 'PDF to Word',
    description: 'Convert PDF documents to editable Word format',
    category: 'Documents',
    icon: FileText,
    color: 'bg-blue-500/10 text-blue-600',
    inputFormat: 'PDF',
    outputFormat: 'DOCX',
    popularity: 'Very Popular',
    useCase: 'Document editing and collaboration'
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG',
    description: 'Convert JPG images to PNG with transparency support',
    category: 'Images',
    icon: Image,
    color: 'bg-green-500/10 text-green-600',
    inputFormat: 'JPG',
    outputFormat: 'PNG',
    popularity: 'Very Popular',
    useCase: 'Web design and graphics'
  },
  {
    id: 'mp3-to-wav',
    name: 'MP3 to WAV',
    description: 'Convert MP3 audio to high-quality WAV format',
    category: 'Audio',
    icon: Music,
    color: 'bg-purple-500/10 text-purple-600',
    inputFormat: 'MP3',
    outputFormat: 'WAV',
    popularity: 'Popular',
    useCase: 'Audio editing and production'
  },
  {
    id: 'mp4-to-webm',
    name: 'MP4 to WebM',
    description: 'Convert MP4 videos to WebM for web optimization',
    category: 'Video',
    icon: Video,
    color: 'bg-red-500/10 text-red-600',
    inputFormat: 'MP4',
    outputFormat: 'WEBM',
    popularity: 'Popular',
    useCase: 'Web video and streaming'
  },
  {
    id: 'zip-to-rar',
    name: 'ZIP to RAR',
    description: 'Convert ZIP archives to RAR with better compression',
    category: 'Archives',
    icon: Archive,
    color: 'bg-orange-500/10 text-orange-600',
    inputFormat: 'ZIP',
    outputFormat: 'RAR',
    popularity: 'Moderate',
    useCase: 'File compression and sharing'
  },
  {
    id: 'epub-to-pdf',
    name: 'EPUB to PDF',
    description: 'Convert EPUB ebooks to PDF for universal reading',
    category: 'Ebooks',
    icon: Book,
    color: 'bg-indigo-500/10 text-indigo-600',
    inputFormat: 'EPUB',
    outputFormat: 'PDF',
    popularity: 'Popular',
    useCase: 'Ebook distribution and printing'
  },
  {
    id: 'ppt-to-pdf',
    name: 'PowerPoint to PDF',
    description: 'Convert PowerPoint presentations to PDF format',
    category: 'Presentations',
    icon: Presentation,
    color: 'bg-pink-500/10 text-pink-600',
    inputFormat: 'PPT/PPTX',
    outputFormat: 'PDF',
    popularity: 'Very Popular',
    useCase: 'Presentation sharing and archiving'
  },
  {
    id: 'xls-to-csv',
    name: 'Excel to CSV',
    description: 'Convert Excel spreadsheets to CSV format',
    category: 'Spreadsheets',
    icon: Table,
    color: 'bg-teal-500/10 text-teal-600',
    inputFormat: 'XLS/XLSX',
    outputFormat: 'CSV',
    popularity: 'Popular',
    useCase: 'Data import and export'
  },
  {
    id: 'dwg-to-pdf',
    name: 'AutoCAD to PDF',
    description: 'Convert DWG files to PDF for easy viewing',
    category: 'CAD Files',
    icon: Compass,
    color: 'bg-cyan-500/10 text-cyan-600',
    inputFormat: 'DWG',
    outputFormat: 'PDF',
    popularity: 'Moderate',
    useCase: 'Technical documentation and sharing'
  },
  {
    id: 'ttf-to-woff',
    name: 'TTF to WOFF',
    description: 'Convert TTF fonts to WOFF for web optimization',
    category: 'Fonts',
    icon: Type,
    color: 'bg-amber-500/10 text-amber-600',
    inputFormat: 'TTF',
    outputFormat: 'WOFF',
    popularity: 'Moderate',
    useCase: 'Web typography and performance'
  }
];

const categories = [
  { name: 'Documents', icon: FileText, color: 'bg-blue-500/10 text-blue-600' },
  { name: 'Images', icon: Image, color: 'bg-green-500/10 text-green-600' },
  { name: 'Audio', icon: Music, color: 'bg-purple-500/10 text-purple-600' },
  { name: 'Video', icon: Video, color: 'bg-red-500/10 text-red-600' },
  { name: 'Archives', icon: Archive, color: 'bg-orange-500/10 text-orange-600' },
  { name: 'Ebooks', icon: Book, color: 'bg-indigo-500/10 text-indigo-600' },
  { name: 'Presentations', icon: Presentation, color: 'bg-pink-500/10 text-pink-600' },
  { name: 'Spreadsheets', icon: Table, color: 'bg-teal-500/10 text-teal-600' },
  { name: 'CAD Files', icon: Compass, color: 'bg-cyan-500/10 text-cyan-600' },
  { name: 'Fonts', icon: Type, color: 'bg-amber-500/10 text-amber-600' }
];

export function PopularConversions() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Popular Conversions
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover the most frequently used conversion tools. 
            These are the formats our users convert most often.
          </p>
        </div>

        {/* Popular Conversions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 max-w-7xl mx-auto">
          {popularConversions.map((conversion) => {
            const IconComponent = conversion.icon;
            return (
              <Card key={conversion.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${conversion.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Badge 
                      variant={conversion.popularity === 'Very Popular' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {conversion.popularity}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {conversion.name}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {conversion.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Format Conversion */}
                  <div className="flex items-center justify-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {conversion.inputFormat}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">
                      {conversion.outputFormat}
                    </Badge>
                  </div>

                  {/* Category */}
                  <div className="text-center">
                    <Badge variant="secondary" className="text-xs">
                      {conversion.category}
                    </Badge>
                  </div>

                  {/* Use Case */}
                  <div>
                    <h4 className="text-xs font-medium mb-1 text-muted-foreground">Use Case</h4>
                    <p className="text-xs text-muted-foreground">{conversion.useCase}</p>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    asChild 
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    variant="outline"
                  >
                    <Link href={`/convert/${conversion.id}`}>
                      Convert Now
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Category Quick Access */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8">
            Browse by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  asChild
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-primary/5 hover:border-primary transition-all"
                >
                  <Link href={`/tools/${category.name.toLowerCase().replace(' ', '-')}`}>
                    <IconComponent className={`h-6 w-6 ${category.color}`} />
                    <span className="text-xs font-medium">{category.name}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Card className="inline-block p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-0">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-primary mr-3" />
                <h3 className="text-2xl font-bold">
                  Need Something Specific?
                </h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Can't find the conversion you need? Our platform supports 2,000+ formats. 
                Use the search above or browse all categories to find your perfect tool.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/tools">
                    Browse All Tools
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact-sales">
                    Custom Requirements
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
