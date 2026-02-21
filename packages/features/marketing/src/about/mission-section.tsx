/**
 * About Page — Mission Section
 * Loaded lazily via clientOnly on the about page
 */
import { Chip } from "@formanywhere/ui/chip";
import { Typography } from "@formanywhere/ui/typography";
import { Icon } from "@formanywhere/ui/icon";

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

export default function MissionSection() {
  return (
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
            <Typography
              variant="headline-medium"
              as="h2"
              color="on-surface"
              style={{
                margin: "0 0 1.5rem 0",
                "font-size": "clamp(1.875rem, 4vw, 2.25rem)",
                "font-weight": "800",
                "letter-spacing": "normal",
              }}
            >
              Why we built FormAnywhere
            </Typography>
            <Typography
              variant="body-large"
              as="p"
              color="on-surface-variant"
              style={{
                margin: "0 0 1rem 0",
                "font-size": "1.125rem",
                "line-height": "1.75",
                "letter-spacing": "normal",
              }}
            >
              Traditional form builders assume you're always online. But
              reality is different—construction sites have dead zones, event
              venues have overloaded WiFi, and rural areas have spotty
              coverage.
            </Typography>
            <Typography
              variant="body-large"
              as="p"
              color="on-surface-variant"
              style={{
                margin: "0 0 1rem 0",
                "font-size": "1.125rem",
                "line-height": "1.75",
                "letter-spacing": "normal",
              }}
            >
              FormAnywhere was created to solve this fundamental problem. We
              believe data collection shouldn't depend on an internet
              connection. Your work shouldn't stop because of connectivity.
            </Typography>
            <Typography
              variant="body-large"
              as="p"
              color="on-surface-variant"
              style={{
                margin: "0",
                "font-size": "1.125rem",
                "line-height": "1.75",
                "letter-spacing": "normal",
              }}
            >
              That's why we built everything offline-first—not as an
              afterthought, but as the core architecture. Every feature works
              without internet. Sync happens automatically when you reconnect.
            </Typography>
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
                      <Icon
                        name="check"
                        size={24}
                        style={{
                          width: "1.5rem",
                          height: "1.5rem",
                          color: tokens.text,
                        }}
                      />
                    </div>
                    <div>
                      <Typography
                        variant="title-medium"
                        as="h3"
                        color="on-surface"
                        style={{
                          margin: "0 0 0.25rem 0",
                          "font-weight": "700",
                          "letter-spacing": "normal",
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body-small"
                        as="p"
                        color="on-surface-variant"
                        style={{
                          margin: "0",
                          "font-size": "0.875rem",
                          "letter-spacing": "normal",
                        }}
                      >
                        {item.desc}
                      </Typography>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
