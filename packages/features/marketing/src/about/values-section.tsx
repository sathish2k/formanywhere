/**
 * About Page — Values Section
 * Loaded lazily via clientOnly on the about page
 */
import { For } from "solid-js";
import { Chip } from "@formanywhere/ui/chip";
import { Typography } from "@formanywhere/ui/typography";
import { Card } from "@formanywhere/ui/card";
import { values, iconPaths } from "./config";

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

export default function ValuesSection() {
  return (
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
            What we stand for
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
            The principles that guide every feature we build.
          </Typography>
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
                <Card
                  variant="glass"
                  style={{
                    padding: "2rem",
                    "border-radius": "1rem",
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
                  <Typography
                    variant="title-medium"
                    as="h3"
                    color="on-surface"
                    style={{
                      margin: "0 0 0.75rem 0",
                      "font-weight": "700",
                      "letter-spacing": "normal",
                    }}
                  >
                    {value.title}
                  </Typography>
                  <Typography
                    variant="body-medium"
                    as="p"
                    color="on-surface-variant"
                    style={{
                      margin: "0",
                      "line-height": "1.75",
                      "letter-spacing": "normal",
                    }}
                  >
                    {value.description}
                  </Typography>
                </Card>
              );
            }}
          </For>
        </div>
      </div>
    </section>
  );
}
