/**
 * About Page — SolidStart route
 * Layout: (marketing) — Header + Footer provided by layout
 *
 * Route-level lazy loading:
 * - Hero section SSR'd (above fold)
 * - Mission, Values, TechStack, CTA use clientOnly() + LazySection
 */
import { clientOnly } from "@solidjs/start";
import PageLayout from "~/components/PageLayout";
import { LazySection } from "~/components/LazySection";
import { Typography } from "@formanywhere/ui/typography";
import { Chip } from "@formanywhere/ui/chip";
import { Button } from "@formanywhere/ui/button";

// Below-fold: clientOnly prevents SSR
const MissionSection = clientOnly(() => import("@formanywhere/marketing/about/mission"));
const ValuesSection = clientOnly(() => import("@formanywhere/marketing/about/values"));
const TechStackSection = clientOnly(() => import("@formanywhere/marketing/about/tech-stack"));
const CTASection = clientOnly(() => import("@formanywhere/marketing/cta"));

export default function AboutPage() {
  return (
    <PageLayout title="About | FormAnywhere" description="Learn about FormAnywhere — the offline-first form builder">
      {/* Hero — SSR'd (above fold) */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, var(--m3-color-primary), color-mix(in srgb, var(--m3-color-primary) 75%, black))",
          color: "white",
          padding: "6rem 0",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-6rem",
            right: "-6rem",
            width: "24rem",
            height: "24rem",
            "border-radius": "9999px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-9rem",
            left: "-9rem",
            width: "31.25rem",
            height: "31.25rem",
            "border-radius": "9999px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        />

        <div
          style={{
            position: "relative",
            "z-index": 10,
            "max-width": "56rem",
            margin: "0 auto",
            padding: "0 1rem",
            "text-align": "center",
          }}
        >
          <Chip
            variant="label"
            label="About FormAnywhere"
            style={{
              display: "inline-flex",
              margin: "0 0 1.5rem 0",
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "backdrop-filter": "blur(8px)",
              border: "none",
              height: "auto",
              "border-radius": "9999px",
              padding: "0.375rem 1rem",
              "font-size": "0.875rem",
              "font-weight": "600",
              outline: "none",
            }}
          />
          <Typography
            variant="display-medium"
            as="h1"
            color="inherit"
            align="center"
            style={{
              margin: "0 0 1.5rem 0",
              "font-size": "clamp(2.25rem, 5vw, 3rem)",
              "font-weight": "800",
              "line-height": "1.15",
              "letter-spacing": "normal",
            }}
          >
            Forms that work where you do
          </Typography>
          <Typography
            variant="body-large"
            as="p"
            color="inherit"
            align="center"
            style={{
              margin: "0 auto 2rem auto",
              "font-size": "clamp(1.125rem, 2.5vw, 1.25rem)",
              color: "rgba(255, 255, 255, 0.9)",
              "line-height": "1.75",
              "max-width": "42rem",
              "letter-spacing": "normal",
            }}
          >
            FormAnywhere is an offline-first form builder designed for teams who
            work in the field, at events, or anywhere internet access is
            unreliable. Collect data. Capture photos. Get signatures. All without
            connectivity.
          </Typography>
          <Button
            href="/signup"
            variant="tonal"
            size="lg"
            style={{
              background: "white",
              color: "var(--m3-color-primary)",
              "font-weight": "600",
            }}
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Below-fold: lazy-loaded on scroll */}
      <LazySection>
        <MissionSection />
      </LazySection>
      <LazySection>
        <ValuesSection />
      </LazySection>
      <LazySection>
        <TechStackSection />
      </LazySection>
      <LazySection>
        <CTASection
          title="Ready to build forms that work anywhere?"
          description="Start collecting data offline today. No credit card required."
          primaryCta={{
            label: "Get Started Free",
            href: "/signup",
            icon: "arrow-right",
          }}
          secondaryCta={{ label: "View Pricing", href: "/pricing" }}
        />
      </LazySection>
    </PageLayout>
  );
}