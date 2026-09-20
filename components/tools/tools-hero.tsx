'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Zap, FileText, Image, Music, Video, Archive, Book, Presentation, Table, Compass, Type } from 'lucide-react';
import { useState } from 'react';

const stats = [
  { label: 'Conversion Types', value: '2,000+', icon: Zap },
  { label: 'File Categories', value: '12', icon: FileText },
  { label: 'Supported Formats', value: '500+', icon: Image },
  { label: 'Processing Speed', value: '<30s', icon: Music }
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

export function ToolsHero() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Conversion Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Access our comprehensive suite of file conversion tools. 
            Convert between 2,000+ formats across all major file categories.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for conversion tools, file formats, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg border-2 focus:border-primary"
              />
              <Button 
                type="submit" 
                size="lg" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-12 px-6"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Quick Category Access */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-primary/5 hover:border-primary transition-all"
                >
                  <IconComponent className={`h-6 w-6 ${category.color}`} />
                  <span className="text-xs font-medium">{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
