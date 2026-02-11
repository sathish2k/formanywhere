/**
 * Shared Navigation Configuration
 * Common navigation links and footer sections used across all pages
 */

export interface NavLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface FooterLink {
  label: string;
  href?: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

/**
 * Default Navigation Links
 * Used across all pages
 */
export const defaultNavLinks: NavLink[] = [
  { label: 'Features', href: '/#features' },
  { label: 'Templates', href: '/templates' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Blog' },
];

/**
 * Default Footer Sections
 * Used across all pages
 */
export const defaultFooterSections: FooterSection[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Templates', href: '/templates' },
    ],
  },
  {
    title: 'Company',
    links: [{ label: 'About Us', href: '/about' }, { label: 'Careers' }, { label: 'Contact' }],
  },
  {
    title: 'Resources',
    links: [{ label: 'Documentation' }, { label: 'Help Center' }, { label: 'Blog' }],
  },
];

/**
 * Home Page Footer (extended)
 */
export const homeFooterSections: FooterSection[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Templates', href: '/templates' },
      { label: 'Integrations' },
      { label: 'API Docs' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers' },
      { label: 'Press Kit' },
      { label: 'Contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation' },
      { label: 'Help Center' },
      { label: 'Blog' },
      { label: 'Community' },
    ],
  },
];

/**
 * Default Footer Props
 */
export const defaultFooterProps = {
  tagline:
    'Enterprise-grade form builder with AI assistance. Build powerful forms and workflows in minutes.',
  copyright: '© 2025 FormBuilder AI. All rights reserved.',
};
