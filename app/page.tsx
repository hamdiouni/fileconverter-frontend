import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { Categories } from '@/components/landing/categories';
import { Testimonials } from '@/components/landing/testimonials';
import { CTASection } from '@/components/landing/cta-section';

export default function Home() {
  return (
    <div className="relative">
      <Hero />
      <Features />
      <Categories />
      <Testimonials />
      <CTASection />
    </div>
  );
}