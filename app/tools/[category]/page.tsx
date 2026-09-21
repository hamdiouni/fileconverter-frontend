// Server component — exports generateStaticParams for static export
import { getAllCategoryIds } from '@/lib/conversions';
import { CategoryPageClient } from './category-client';

// Pre-generates all /tools/[category] routes at build time
export function generateStaticParams() {
  return getAllCategoryIds().map((category) => ({ category }));
}

interface Props {
  params: { category: string };
}

export default function CategoryPage({ params }: Props) {
  return <CategoryPageClient category={params.category} />;
}
