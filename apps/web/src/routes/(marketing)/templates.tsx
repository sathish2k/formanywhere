/**
 * Templates Page — SolidStart route
 * Layout: (marketing) — Header + Footer provided by layout
 */
import { For, lazy, Suspense } from "solid-js";
import PageLayout from "~/components/PageLayout";
import { Typography } from "@formanywhere/ui/typography";
import { Button } from "@formanywhere/ui/button";
import { Chip } from "@formanywhere/ui/chip";
import { SearchBar } from "@formanywhere/ui/search";
import { categories, templates, iconPaths } from "@formanywhere/marketing/templates/config";

const TemplateBrowser = lazy(() =>
  import("@formanywhere/marketing/template-browser").then((m) => ({ default: m.TemplateBrowser }))
);
const TemplateCard = lazy(() =>
  import("@formanywhere/marketing/template-card").then((m) => ({ default: m.TemplateCard }))
);

const popularTemplates = templates.filter((t) => t.popular);

export default function TemplatesPage() {
  return (
    <PageLayout title="Templates | FormAnywhere" description="Browse form templates">
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
            variant="label"
            label="Form Templates"
            style={{
              display: "inline-flex",
              margin: "0 0 1.5rem 0",
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
              "backdrop-filter": "blur(8px)",
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
              style={{
                width: "100%",
                "border-radius": "16px",
                background: "rgba(255, 255, 255, 0.1)",
                "backdrop-filter": "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "white",
              }}
            />
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "4rem 0",
          background: "var(--m3-color-surface)",
          "border-bottom": "1px solid var(--m3-color-outline-variant)",
        }}
      >
        <div
          style={{
            "max-width": "72rem",
            margin: "0 auto",
            padding: "0 1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              "align-items": "center",
              gap: "0.5rem",
              margin: "0 0 2rem 0",
            }}
          >
            <svg
              style={{
                width: "1.5rem",
                height: "1.5rem",
                color: "var(--m3-color-primary)",
                fill: "var(--m3-color-primary)",
              }}
              viewBox="0 0 24 24"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <Typography variant="title-large" as="h2" color="on-surface">
              Popular Templates
            </Typography>
          </div>

          <div
            style={{
              display: "grid",
              gap: "1.5rem",
              "grid-template-columns": "repeat(auto-fit, minmax(240px, 1fr))",
            }}
          >
            <Suspense>
              <For each={popularTemplates}>
                {(template) => <TemplateCard template={template} />}
              </For>
            </Suspense>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "3rem 0",
        }}
      >
        <div
          style={{
            "max-width": "72rem",
            margin: "0 auto",
            padding: "0 1rem",
          }}
        >
          <Suspense>
            <TemplateBrowser initialTemplates={templates} categories={categories} iconPaths={iconPaths} />
          </Suspense>
        </div>
      </section>

      <section
        style={{
          padding: "6rem 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "0",
            background: "var(--m3-color-surface)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            "max-width": "80rem",
            height: "100%",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "600px",
              height: "600px",
              background:
                "color-mix(in srgb, var(--m3-color-primary) 20%, transparent)",
              "border-radius": "9999px",
              filter: "blur(120px)",
              opacity: 0.5,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "33%",
              transform: "translate(-50%, -50%)",
              width: "500px",
              height: "500px",
              background:
                "color-mix(in srgb, var(--m3-color-tertiary) 20%, transparent)",
              "border-radius": "9999px",
              filter: "blur(100px)",
              opacity: 0.4,
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            "z-index": 10,
            "max-width": "72rem",
            margin: "0 auto",
            padding: "0 1rem",
          }}
        >
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              "border-radius": "2.5rem",
              padding: "3rem",
              "text-align": "center",
              border: "1px solid var(--glass-border-medium, rgba(255, 255, 255, 0.4))",
              "box-shadow": "var(--m3-elevation-3)",
              "backdrop-filter": "blur(24px)",
              background: "var(--glass-tint-subtle, rgba(255, 255, 255, 0.1))",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, var(--glass-tint-subtle, rgba(255, 255, 255, 0.2)), transparent)",
                "pointer-events": "none",
              }}
            />
            <div
              style={{
                position: "relative",
                "z-index": 10,
                "max-width": "48rem",
                margin: "0 auto",
              }}
            >
              <Typography
                variant="display-small"
                as="h2"
                align="center"
                style={{
                  margin: "0 0 1.5rem 0",
                  "font-weight": "700",
                  color: "var(--m3-color-on-surface)",
                }}
              >
                Can't find what you need?
              </Typography>
              <Typography
                variant="body-large"
                align="center"
                style={{
                  margin: "0 auto 2.5rem auto",
                  "max-width": "36rem",
                  "font-size": "1.125rem",
                  color: "var(--m3-color-on-surface-variant)",
                }}
              >
                Create your own custom form from scratch with our powerful form builder. No coding required.
              </Typography>
              <Button
                href="/form-builder/new"
                variant="filled"
                style={{
                  padding: "16px 40px",
                  "border-radius": "100px",
                  "font-size": "1.1rem",
                  "font-weight": "600",
                  background: "var(--m3-color-primary)",
                  color: "var(--m3-color-on-primary)",
                }}
              >
                Create Custom Form
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}