/**
 * Home Page - FormAnywhere Landing
 * Layout: (marketing) — Header + Footer provided by layout
 *
 * Optimized for <50 KB initial load:
 * - Hero is SSR'd (above fold)
 * - All below-fold sections use clientOnly() — NOT SSR'd, loaded on-demand
 * - IntersectionObserver triggers loading only when sections near viewport
 */
import { clientOnly } from "@solidjs/start";
import PageLayout from "~/components/PageLayout";
import { LazySection } from "~/components/LazySection";

// Hero loads eagerly (above the fold, SSR'd)
import HeroSection from "@formanywhere/marketing/hero";

// Below-fold: clientOnly prevents SSR (no HTML emitted until client hydrates)
const DemoTeaser = clientOnly(() => import("@formanywhere/marketing/demo-teaser"));
const StatsSection = clientOnly(() => import("@formanywhere/marketing/stats"));
const FeaturesSection = clientOnly(() => import("@formanywhere/marketing/features"));
const HowItWorksSection = clientOnly(() => import("@formanywhere/marketing/how-it-works"));
const UseCasesSection = clientOnly(() => import("@formanywhere/marketing/use-cases"));
const IntegrationsSection = clientOnly(() => import("@formanywhere/marketing/integrations"));
const TestimonialsSection = clientOnly(() => import("@formanywhere/marketing/testimonials"));
const CTASection = clientOnly(() => import("@formanywhere/marketing/cta"));

export default function Home() {
  return (
    <PageLayout
      title="FormAnywhere | Build Powerful Forms That Work Offline"
      description="Create multi-step forms, surveys, and questionnaires with drag-and-drop simplicity. Works offline, syncs when connected."
    >
      <HeroSection />
      <LazySection>
        <DemoTeaser />
      </LazySection>
      <LazySection>
        <StatsSection />
      </LazySection>
      <LazySection>
        <FeaturesSection />
      </LazySection>
      <LazySection>
        <HowItWorksSection />
      </LazySection>
      <LazySection>
        <UseCasesSection />
      </LazySection>
      <LazySection>
        <IntegrationsSection />
      </LazySection>
      <LazySection>
        <TestimonialsSection />
      </LazySection>
      <LazySection>
        <CTASection
          title="Ready to Build Forms That Work Anywhere?"
          description="Start building powerful offline-first forms in minutes. No credit card required."
          primaryCta={{ label: "Get Started Free", href: "/signup", icon: "arrow-right" }}
          secondaryCta={{ label: "Contact Sales", href: "/contact", icon: "mail" }}
        />
      </LazySection>
    </PageLayout>
  );
}
