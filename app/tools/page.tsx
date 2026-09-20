import { Metadata } from 'next';
import { ToolsHero } from '@/components/tools/tools-hero';
import { CategoryGrid } from '@/components/tools/category-grid';
import { SearchAndFilter } from '@/components/tools/search-and-filter';
import { PopularConversions } from '@/components/tools/popular-conversions';

export const metadata: Metadata = {
  title: 'Conversion Tools - FileConverter Pro',
  description: 'Access 2,000+ file conversion tools across all major categories. Convert documents, images, audio, video, archives, and more.',
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <ToolsHero />

      {/* Search and Filter */}
      <SearchAndFilter />

      {/* Category Grid */}
      <CategoryGrid />

      {/* Popular Conversions */}
      <PopularConversions />
    </div>
  );
}
