/**
 * Pricing Page — SolidStart route
 * Layout: (marketing) — Header + Footer provided by layout
 */
import { lazy, Suspense } from "solid-js";
import PageLayout from "~/components/PageLayout";
import { Typography } from "@formanywhere/ui/typography";
import { Chip } from "@formanywhere/ui/chip";
import { pricingPlans, enterpriseFeatures, faqs } from "@formanywhere/marketing/pricing/config";

const PricingTable = lazy(() => import("@formanywhere/marketing/pricing-table").then((m) => ({ default: m.PricingTable })));
const FAQSection = lazy(() => import("@formanywhere/marketing/faq-section").then((m) => ({ default: m.FAQSection })));
const ContactSalesCard = lazy(() => import("@formanywhere/marketing/contact-sales-card").then((m) => ({ default: m.ContactSalesCard })));
const CTASection = lazy(() => import("@formanywhere/marketing/cta-section").then((m) => ({ default: m.CTASection })));

export default function PricingPage() {
  return (
    <PageLayout title="Pricing | FormAnywhere" description="Simple pricing for FormAnywhere">
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

      <section
        style={{
          "padding-bottom": "4rem",
          padding: "0 1rem 4rem 1rem",
        }}
      >
        <Suspense>
          <PricingTable plans={pricingPlans} showBillingToggle={true} savingsPercent={17} />
        </Suspense>
      </section>

      <section
        style={{
          padding: "4rem 0",
          background: "var(--m3-color-surface)",
        }}
      >
        <div
          style={{
            "max-width": "56rem",
            margin: "0 auto",
            padding: "0 1rem",
          }}
        >
          <Suspense>
            <ContactSalesCard
              badge="Enterprise"
              title="For organizations with custom requirements"
              features={enterpriseFeatures}
              ctaLabel="Contact Sales"
              ctaHref="mailto:enterprise@formanywhere.com"
              iconName="building"
            />
          </Suspense>
        </div>
      </section>

      <section
        style={{
          padding: "4rem 0",
          background: "var(--m3-color-surface-container-lowest, var(--m3-color-surface))",
        }}
      >
        <div
          style={{
            "max-width": "48rem",
            margin: "0 auto",
            padding: "0 1rem",
          }}
        >
          <Suspense>
            <FAQSection title="Frequently Asked Questions" faqs={faqs} />
          </Suspense>
        </div>
      </section>

      <Suspense>
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
      </Suspense>
    </PageLayout>
  );
}