/**
 * Pricing Page — SolidStart route
 * Layout: (marketing) — Header + Footer provided by layout
 *
 * Route-level lazy loading:
 * - Hero section SSR'd (above fold)
 * - PricingTable, Enterprise, FAQ, CTA use clientOnly() + LazySection
 */
import { clientOnly } from "@solidjs/start";
import PageLayout from "~/components/PageLayout";
import { LazySection } from "~/components/LazySection";
import { Typography } from "@formanywhere/ui/typography";
import { Chip } from "@formanywhere/ui/chip";

// Below-fold: clientOnly prevents SSR, config data co-located in each wrapper
const PricingTableSection = clientOnly(() => import("@formanywhere/marketing/pricing/table"));
const EnterpriseSection = clientOnly(() => import("@formanywhere/marketing/pricing/enterprise"));
const FAQWrapperSection = clientOnly(() => import("@formanywhere/marketing/pricing/faq"));
const CTASection = clientOnly(() => import("@formanywhere/marketing/cta"));

export default function PricingPage() {
  return (
    <PageLayout title="Pricing | FormAnywhere" description="Simple pricing for FormAnywhere">
      {/* Hero — SSR'd (above fold) */}
      <section
        style={{
          "padding-top": "6rem",
          "padding-bottom": "1.5rem",
          "text-align": "center",
        }}
      >
        <div
          style={{
            "max-width": "56rem",
            margin: "0 auto",
            padding: "0 1rem",
          }}
        >
          <Chip
            variant="label"
            label="Simple Pricing"
            style={{
              display: "inline-flex",
              margin: "0 0 1.5rem 0",
              background: "var(--m3-color-secondary-container)",
              color: "var(--m3-color-on-secondary-container)",
              border: "none",
            }}
          />
          <Typography
            variant="display-medium"
            as="h1"
            color="on-surface"
            align="center"
            style={{
              margin: "0 0 1rem 0",
              "font-size": "clamp(1.875rem, 4vw, 3rem)",
              "line-height": "1.15",
            }}
          >
            Plans that work for you
          </Typography>
          <Typography
            variant="body-large"
            color="on-surface-variant"
            align="center"
            style={{
              margin: "0 auto 2rem auto",
              "max-width": "36rem",
            }}
          >
            Start free, upgrade when you need more. Pay monthly, annually, or once.
          </Typography>
        </div>
      </section>

      {/* Below-fold: lazy-loaded on scroll */}
      <LazySection>
        <PricingTableSection />
      </LazySection>
      <LazySection>
        <EnterpriseSection />
      </LazySection>
      <LazySection>
        <FAQWrapperSection />
      </LazySection>
      <LazySection>
        <CTASection
          title="Ready to build offline-first forms?"
          description="Start collecting data anywhere. No credit card required."
          primaryCta={{
            label: "Start Free Trial",
            href: "/signup",
            icon: "arrow-right",
          }}
          secondaryCta={{
            label: "Contact Us",
            href: "mailto:hello@formanywhere.com",
          }}
        />
      </LazySection>
    </PageLayout>
  );
}