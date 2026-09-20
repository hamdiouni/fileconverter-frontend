'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const categories = [
  'All Categories',
  'Documents',
  'Images', 
  'Audio',
  'Video',
  'Archives',
  'Ebooks',
  'Presentations',
  'Spreadsheets',
  'CAD Files',
  'Fonts'
];

const popularFormats = [
  'PDF', 'DOCX', 'JPG', 'PNG', 'MP3', 'MP4', 'ZIP', 'EPUB', 'PPTX', 'XLSX'
];

export function SearchAndFilter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFormatToggle = (format: string) => {
    setSelectedFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedFormats([]);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'All Categories' || selectedFormats.length > 0;

  return (
    <section className="py-12 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Search and Filter Row */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search conversion tools, file formats, or use cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Advanced Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full lg:w-auto"
            >
              <Filter className="mr-2 h-4 w-4" />
              {showAdvanced ? 'Hide' : 'Advanced'} Filters
            </Button>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="w-full lg:w-auto"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="bg-muted/50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">Advanced Filters</h3>
              
              {/* Popular Formats */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3">Popular Formats</h4>
                <div className="flex flex-wrap gap-2">
                  {popularFormats.map((format) => (
                    <Badge
                      key={format}
                      variant={selectedFormats.includes(format) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => handleFormatToggle(format)}
                    >
                      {format}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">File Size</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (&lt; 1MB)</SelectItem>
                      <SelectItem value="medium">Medium (1-10MB)</SelectItem>
                      <SelectItem value="large">Large (10-100MB)</SelectItem>
                      <SelectItem value="xlarge">Extra Large (&gt; 100MB)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Processing Speed</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any speed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fast">Fast (&lt; 10s)</SelectItem>
                      <SelectItem value="normal">Normal (10-30s)</SelectItem>
                      <SelectItem value="slow">Slow (&gt; 30s)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Quality</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (faster)</SelectItem>
                      <SelectItem value="medium">Medium (balanced)</SelectItem>
                      <SelectItem value="high">High (slower)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchQuery}"
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSearchQuery('')}
                  />
                </Badge>
              )}
              
              {selectedCategory !== 'All Categories' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {selectedCategory}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedCategory('All Categories')}
                  />
                </Badge>
              )}
              
              {selectedFormats.map((format) => (
                <Badge key={format} variant="secondary" className="flex items-center gap-1">
                  Format: {format}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFormatToggle(format)}
                  />
                </Badge>
              ))}
            </div>
          )}

          {/* Results Summary */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing results for: {selectedCategory !== 'All Categories' ? selectedCategory : 'All categories'}
            {searchQuery && ` • Search: "${searchQuery}"`}
            {selectedFormats.length > 0 && ` • Formats: ${selectedFormats.join(', ')}`}
          </div>
        </div>
      </div>
    </section>
  );
}
