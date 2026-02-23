/**
 * Marketing feature package — barrel export
 */
export { default as HeroSection } from "./hero/hero-section";
export { default as DemoTeaser } from "./demo-teaser/demo-teaser";
export { default as StatsSection } from "./stats/stats-section";
export { default as FeaturesSection } from "./features/features-section";
export { default as HowItWorksSection } from "./how-it-works/how-it-works-section";
export { default as UseCasesSection } from "./use-cases/use-cases-section";
export { default as IntegrationsSection } from "./integrations/integrations-section";
export { default as TestimonialsSection } from "./testimonials/testimonials-section";
export { default as CTASection } from "./cta/cta-section";

// Pricing & Marketing components
export { PricingTable } from "./pricing-table";
export type { PricingTableProps } from "./pricing-table";
export { PricingCard } from "./pricing-table";
export type { PricingPlan } from "./pricing-table";
export { FAQSection } from "./faq-section";
export { FAQItem } from "./faq-section";

// Blog components
export { BlogCard } from "./blog";
export type { BlogPost } from "./blog";

// Blog feature components
export { ArticleChat } from "./blog";
export { PodcastPlayer } from "./blog";
export { ReadingModes } from "./blog";
export { SocialSyndication } from "./blog";
export { CitationsPanel } from "./blog";
export { MermaidRenderer } from "./blog";

// Blog API
export { configureBlogApi, fetchBlogs, fetchBlogBySlug } from "./blog";
export type { ApiBlogPost, Citation, SocialMediaPosts } from "./blog";

export { ContactSalesCard } from "./contact-sales-card";
export { CTASection as CTASectionComponent } from "./cta/cta-section";

// Template components
export { TemplateCard } from "./template-card";
export type { Template, TemplateCardProps } from "./template-card";
export { CategoryFilter } from "./category-filter";
export type { Category, CategoryFilterProps } from "./category-filter";
export { TemplateBrowser } from "./template-browser";
export type { TemplateBrowserProps } from "./template-browser";
