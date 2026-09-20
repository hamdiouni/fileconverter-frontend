export interface ConversionCategory {
  id: string;
  name: string;
  count: number;
  icon: string;
  description: string;
  subcategories: {
    name: string;
    formats: string[];
  }[];
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
  company: string;
}

export type Theme = 'light' | 'dark' | 'system';