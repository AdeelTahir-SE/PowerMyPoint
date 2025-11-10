// types.ts - Shared TypeScript types and interfaces

export interface BaseComponentProps {
  className?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Step {
  number: number;
  title: string;
  description: string;
}

export interface Template {
  title: string;
  description: string;
  imageUrl: string;
}

export interface Testimonial {
  name: string;
  role: string;
  imageUrl: string;
  quote: string;
}

export interface PricingPlan {
  name: string;
  price: number;
  period: string;
  features: string[];
  buttonText: string;
  buttonStyle: 'primary' | 'secondary';
  isFeatured?: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface SocialLink {
  platform: string;
  href: string;
  icon: React.ReactNode;
  ariaLabel: string;
}

export interface FooterLink {
  label: string;
  href: string;
}