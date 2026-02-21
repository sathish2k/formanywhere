/**
 * Templates Page — SolidStart route
 * Layout: (marketing) — Header + Footer provided by layout
 *
 * Route-level lazy loading:
 * - Hero section SSR'd (above fold)
 * - Popular Templates, Template Browser, CTA use clientOnly() + LazySection
 */
import { clientOnly } from "@solidjs/start";
import PageLayout from "~/components/PageLayout";
import { LazySection } from "~/components/LazySection";
import { Typography } from "@formanywhere/ui/typography";
import { Chip } from "@formanywhere/ui/chip";
import { SearchBar } from "@formanywhere/ui/search";

// Below-fold: clientOnly prevents SSR, config data co-located in each component
const PopularTemplatesSection = clientOnly(() => import("@formanywhere/marketing/templates/popular"));
const TemplateBrowserSection = clientOnly(() => import("@formanywhere/marketing/templates/browser"));
const TemplatesCTASection = clientOnly(() => import("@formanywhere/marketing/templates/cta"));

export default function TemplatesPage() {
  return (
    <PageLayout title="Templates | FormAnywhere" description="Browse form templates">
      {/* Hero — SSR'd (above fold) */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, var(--m3-color-primary), color-mix(in srgb, var(--m3-color-primary) 75%, black))",
          color: "white",
          padding: "5rem 0",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-3rem",
            right: "-3rem",
            width: "18rem",
            height: "18rem",
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
            variant="glass"
            label="Form Templates"
            style={{
              display: "inline-flex",
              margin: "0 0 1.5rem 0",
              color: "white",
              border: "none",
            }}
          />
          <Typography
            variant="display-medium"
            as="h1"
            align="center"
            style={{
              margin: "0 0 1rem 0",
              "font-size": "clamp(1.875rem, 4vw, 3rem)",
              color: "white",
            }}
          >
            Start with a template
          </Typography>
          <Typography
            variant="body-large"
            align="center"
            style={{
              margin: "0 auto 2rem auto",
              "max-width": "36rem",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Choose from our library of professionally designed form templates. Customize and deploy in minutes.
          </Typography>

          <div
            style={{
              position: "relative",
              "max-width": "36rem",
              margin: "0 auto",
            }}
          >
            <SearchBar
              id="search-input"
              placeholder="Search templates..."
              variant="glass"
              style={{
                width: "100%",
                "border-radius": "16px",
                color: "white",
              }}
            />
          </div>
        </div>
      </section>

      {/* Below-fold: lazy-loaded on scroll */}
      <LazySection>
        <PopularTemplatesSection />
      </LazySection>
      <LazySection>
        <TemplateBrowserSection />
      </LazySection>
      <LazySection>
        <TemplatesCTASection />
      </LazySection>
    </PageLayout>
  );
}