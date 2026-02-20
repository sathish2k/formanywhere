/**
 * Home Page - FormAnywhere Landing
 * Layout: (marketing) — Header + Footer provided by layout
 */
import { lazy, Suspense } from "solid-js";
import PageLayout from "~/components/PageLayout";

// Hero loads eagerly (above the fold)
import HeroSection from "@formanywhere/marketing/hero";

// Below-the-fold sections lazy-loaded for faster FCP
const DemoTeaser = lazy(() => import("@formanywhere/marketing/demo-teaser"));
const StatsSection = lazy(() => import("@formanywhere/marketing/stats"));
const FeaturesSection = lazy(() => import("@formanywhere/marketing/features"));
const HowItWorksSection = lazy(() => import("@formanywhere/marketing/how-it-works"));
const UseCasesSection = lazy(() => import("@formanywhere/marketing/use-cases"));
const IntegrationsSection = lazy(() => import("@formanywhere/marketing/integrations"));
const TestimonialsSection = lazy(() => import("@formanywhere/marketing/testimonials"));
const CTASection = lazy(() => import("@formanywhere/marketing/cta"));

export default function Home() {
  return (
    <PageLayout
      title="FormAnywhere | Build Powerful Forms That Work Offline"
      description="Create multi-step forms, surveys, and questionnaires with drag-and-drop simplicity. Works offline, syncs when connected."
    >
      <HeroSection />
      <Suspense>
        <DemoTeaser />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <UseCasesSection />
        <IntegrationsSection />
        <TestimonialsSection />
        <CTASection
          title="Ready to Build Forms That Work Anywhere?"
          description="Start building powerful offline-first forms in minutes. No credit card required."
          primaryCta={{ label: "Get Started Free", href: "/signup", icon: "arrow_forward" }}
          secondaryCta={{ label: "Contact Sales", href: "/contact", icon: "mail" }}
        />
      </Suspense>
    </PageLayout>
  );
}
