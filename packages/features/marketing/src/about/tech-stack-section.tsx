/**
 * About Page — Tech Stack Section
 * Loaded lazily via clientOnly on the about page
 */
import { For } from "solid-js";
import { Chip } from "@formanywhere/ui/chip";
import { Typography } from "@formanywhere/ui/typography";
import { Card } from "@formanywhere/ui/card";
import { techStack } from "./config";

export default function TechStackSection() {
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
          <Typography
            variant="headline-medium"
            as="h2"
            color="on-surface"
            align="center"
            style={{
              margin: "0 0 1rem 0",
              "font-size": "clamp(1.875rem, 4vw, 2.25rem)",
              "font-weight": "800",
              "letter-spacing": "normal",
            }}
          >
            Built with modern tools
          </Typography>
          <Typography
            variant="body-large"
            as="p"
            color="on-surface-variant"
            align="center"
            style={{
              margin: "0 auto",
              "font-size": "1.125rem",
              "max-width": "42rem",
              "letter-spacing": "normal",
            }}
          >
            We use the latest technologies to deliver fast, reliable, and
            secure experiences.
          </Typography>
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
              <Card
                variant="glass"
                style={{
                  padding: "1.5rem",
                  "border-radius": "1rem",
                  "text-align": "center",
                }}
              >
                <Typography
                  variant="title-medium"
                  as="h3"
                  color="on-surface"
                  align="center"
                  style={{
                    margin: "0 0 0.5rem 0",
                    "font-weight": "700",
                    "letter-spacing": "normal",
                  }}
                >
                  {tech.name}
                </Typography>
                <Typography
                  variant="body-small"
                  as="p"
                  color="on-surface-variant"
                  align="center"
                  style={{
                    margin: "0",
                    "font-size": "0.875rem",
                    "letter-spacing": "normal",
                  }}
                >
                  {tech.description}
                </Typography>
              </Card>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}
