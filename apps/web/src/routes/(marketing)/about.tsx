/**
 * About Page — SolidStart route
 * Layout: (marketing) — Header + Footer provided by layout
 */
import { For, lazy, Suspense } from "solid-js";
import PageLayout from "~/components/PageLayout";
import { Chip } from "@formanywhere/ui/chip";
import { Button } from "@formanywhere/ui/button";
import { values, techStack, iconPaths } from "@formanywhere/marketing/about/config";

const CTASection = lazy(() =>
  import("@formanywhere/marketing/cta-section").then((m) => ({ default: m.CTASection }))
);

const missionColorTokens: Record<
  "primary" | "secondary" | "tertiary",
  { bg: string; text: string }
> = {
  primary: {
    bg: "color-mix(in srgb, var(--m3-color-primary) 20%, transparent)",
    text: "var(--m3-color-primary)",
  },
  secondary: {
    bg: "color-mix(in srgb, var(--m3-color-secondary) 20%, transparent)",
    text: "var(--m3-color-secondary)",
  },
  tertiary: {
    bg: "color-mix(in srgb, var(--m3-color-tertiary) 20%, transparent)",
    text: "var(--m3-color-tertiary)",
  },
};

const valueColorTokens = [
  {
    bg: "var(--m3-color-primary-container)",
    text: "var(--m3-color-on-primary-container)",
  },
  {
    bg: "var(--m3-color-secondary-container)",
    text: "var(--m3-color-on-secondary-container)",
  },
  {
    bg: "var(--m3-color-tertiary-container)",
    text: "var(--m3-color-on-tertiary-container)",
  },
  {
    bg: "var(--m3-color-surface-container-high)",
    text: "var(--m3-color-on-surface)",
  },
] as const;

export default function AboutPage() {
  return (
    <PageLayout title="About | FormAnywhere" description="Learn about FormAnywhere — the offline-first form builder">
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
          <span
            style={{
              display: "inline-block",
              padding: "0.375rem 1rem",
              "border-radius": "9999px",
              background: "rgba(255, 255, 255, 0.2)",
              "backdrop-filter": "blur(8px)",
              color: "white",
              "font-size": "0.875rem",
              "font-weight": "600",
              margin: "0 0 1.5rem 0",
            }}
          >
            About FormAnywhere
          </span>
          <h1
            style={{
              margin: "0 0 1.5rem 0",
              "font-size": "clamp(2.25rem, 5vw, 3rem)",
              "font-weight": "800",
              "line-height": "1.15",
            }}
          >
            Forms that work where you do
          </h1>
          <p
            style={{
              margin: "0 auto 2rem auto",
              "font-size": "clamp(1.125rem, 2.5vw, 1.25rem)",
              color: "rgba(255, 255, 255, 0.9)",
              "line-height": "1.75",
              "max-width": "42rem",
            }}
          >
            FormAnywhere is an offline-first form builder designed for teams who
            work in the field, at events, or anywhere internet access is
            unreliable. Collect data. Capture photos. Get signatures. All without
            connectivity.
          </p>
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

      <section
        style={{
          padding: "6rem 0",
          background: "var(--m3-color-surface)",
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
              display: "grid",
              gap: "3rem",
              "grid-template-columns": "repeat(auto-fit, minmax(300px, 1fr))",
              "align-items": "center",
            }}
          >
            <div>
              <Chip
                variant="label"
                label="OUR MISSION"
                style={{
                  display: "inline-flex",
                  margin: "0 0 1rem 0",
                  background: "var(--m3-color-secondary-container)",
                  color: "var(--m3-color-on-secondary-container)",
                  border: "none",
                }}
              />
              <h2
                style={{
                  margin: "0 0 1.5rem 0",
                  "font-size": "clamp(1.875rem, 4vw, 2.25rem)",
                  "font-weight": "800",
                  color: "var(--m3-color-on-surface)",
                }}
              >
                Why we built FormAnywhere
              </h2>
              <p
                style={{
                  margin: "0 0 1rem 0",
                  "font-size": "1.125rem",
                  color: "var(--m3-color-on-surface-variant)",
                  "line-height": "1.75",
                }}
              >
                Traditional form builders assume you're always online. But
                reality is different—construction sites have dead zones, event
                venues have overloaded WiFi, and rural areas have spotty
                coverage.
              </p>
              <p
                style={{
                  margin: "0 0 1rem 0",
                  "font-size": "1.125rem",
                  color: "var(--m3-color-on-surface-variant)",
                  "line-height": "1.75",
                }}
              >
                FormAnywhere was created to solve this fundamental problem. We
                believe data collection shouldn't depend on an internet
                connection. Your work shouldn't stop because of connectivity.
              </p>
              <p
                style={{
                  margin: "0",
                  "font-size": "1.125rem",
                  color: "var(--m3-color-on-surface-variant)",
                  "line-height": "1.75",
                }}
              >
                That's why we built everything offline-first—not as an
                afterthought, but as the core architecture. Every feature works
                without internet. Sync happens automatically when you reconnect.
              </p>
            </div>
            <div
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--m3-color-primary) 10%, transparent), color-mix(in srgb, var(--m3-color-secondary) 10%, transparent))",
                "border-radius": "1.5rem",
                padding: "2rem",
                border: "1px solid var(--m3-color-outline-variant)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  "flex-direction": "column",
                  gap: "1.5rem",
                }}
              >
                {[
                  {
                    color: "primary" as const,
                    title: "100% Offline Capable",
                    desc: "Fill forms, capture photos, collect signatures—all without internet",
                  },
                  {
                    color: "secondary" as const,
                    title: "Automatic Sync",
                    desc: "Data queues locally and uploads when connection is restored",
                  },
                  {
                    color: "tertiary" as const,
                    title: "No Data Loss",
                    desc: "Local-first storage means your data is always safe",
                  },
                ].map((item) => {
                  const tokens = missionColorTokens[item.color];
                  return (
                    <div
                      style={{
                        display: "flex",
                        "align-items": "flex-start",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: "3rem",
                          height: "3rem",
                          "border-radius": "0.75rem",
                          background: tokens.bg,
                          display: "flex",
                          "align-items": "center",
                          "justify-content": "center",
                          "flex-shrink": 0,
                        }}
                      >
                        <svg
                          style={{
                            width: "1.5rem",
                            height: "1.5rem",
                            color: tokens.text,
                          }}
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3
                          style={{
                            margin: "0 0 0.25rem 0",
                            "font-weight": "700",
                            color: "var(--m3-color-on-surface)",
                          }}
                        >
                          {item.title}
                        </h3>
                        <p
                          style={{
                            margin: 0,
                            color: "var(--m3-color-on-surface-variant)",
                            "font-size": "0.875rem",
                          }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "6rem 0",
          background: "var(--m3-color-surface-container-lowest, var(--m3-color-surface))",
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
              "text-align": "center",
              margin: "0 0 4rem 0",
            }}
          >
            <Chip
              variant="label"
              label="CORE PRINCIPLES"
              style={{
                display: "inline-flex",
                margin: "0 0 1rem 0",
                background: "var(--m3-color-secondary-container)",
                color: "var(--m3-color-on-secondary-container)",
                border: "none",
              }}
            />
            <h2
              style={{
                margin: "0 0 1rem 0",
                "font-size": "clamp(1.875rem, 4vw, 2.25rem)",
                "font-weight": "800",
                color: "var(--m3-color-on-surface)",
              }}
            >
              What we stand for
            </h2>
            <p
              style={{
                margin: "0 auto",
                "font-size": "1.125rem",
                color: "var(--m3-color-on-surface-variant)",
                "max-width": "42rem",
              }}
            >
              The principles that guide every feature we build.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "1.5rem",
              "grid-template-columns": "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            <For each={values}>
              {(value, i) => {
                const color = valueColorTokens[i() % valueColorTokens.length];
                return (
                  <div
                    style={{
                      background: "var(--m3-color-surface)",
                      padding: "2rem",
                      "border-radius": "1rem",
                      border: "1px solid var(--m3-color-outline-variant)",
                    }}
                  >
                    <div
                      style={{
                        width: "3.5rem",
                        height: "3.5rem",
                        "border-radius": "0.75rem",
                        background: color.bg,
                        display: "flex",
                        "align-items": "center",
                        "justify-content": "center",
                        margin: "0 0 1.5rem 0",
                      }}
                    >
                      <svg
                        style={{
                          width: "1.75rem",
                          height: "1.75rem",
                          color: color.text,
                        }}
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d={iconPaths[value.icon]}
                        />
                      </svg>
                    </div>
                    <h3
                      style={{
                        margin: "0 0 0.75rem 0",
                        "font-size": "1.25rem",
                        "font-weight": "700",
                        color: "var(--m3-color-on-surface)",
                      }}
                    >
                      {value.title}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        color: "var(--m3-color-on-surface-variant)",
                        "line-height": "1.75",
                      }}
                    >
                      {value.description}
                    </p>
                  </div>
                );
              }}
            </For>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "6rem 0",
          background: "var(--m3-color-surface)",
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
              "text-align": "center",
              margin: "0 0 4rem 0",
            }}
          >
            <Chip
              variant="label"
              label="TECHNOLOGY"
              style={{
                display: "inline-flex",
                margin: "0 0 1rem 0",
                background: "var(--m3-color-secondary-container)",
                color: "var(--m3-color-on-secondary-container)",
                border: "none",
              }}
            />
            <h2
              style={{
                margin: "0 0 1rem 0",
                "font-size": "clamp(1.875rem, 4vw, 2.25rem)",
                "font-weight": "800",
                color: "var(--m3-color-on-surface)",
              }}
            >
              Built with modern tools
            </h2>
            <p
              style={{
                margin: "0 auto",
                "font-size": "1.125rem",
                color: "var(--m3-color-on-surface-variant)",
                "max-width": "42rem",
              }}
            >
              We use the latest technologies to deliver fast, reliable, and
              secure experiences.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "1.5rem",
              "grid-template-columns": "repeat(auto-fit, minmax(160px, 1fr))",
            }}
          >
            <For each={techStack}>
              {(tech) => (
                <div
                  style={{
                    background: "var(--m3-color-surface)",
                    padding: "1.5rem",
                    "border-radius": "1rem",
                    border: "1px solid var(--m3-color-outline-variant)",
                    "text-align": "center",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 0.5rem 0",
                      "font-size": "1.25rem",
                      "font-weight": "700",
                      color: "var(--m3-color-on-surface)",
                    }}
                  >
                    {tech.name}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--m3-color-on-surface-variant)",
                      "font-size": "0.875rem",
                    }}
                  >
                    {tech.description}
                  </p>
                </div>
              )}
            </For>
          </div>
        </div>
      </section>

      <Suspense>
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
      </Suspense>
    </PageLayout>
  );
}