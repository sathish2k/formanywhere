/**
 * Popular Templates Section — lazy-loaded below fold.
 * Co-locates templates data + TemplateCard for code-splitting.
 */
import { For } from "solid-js";
import { Typography } from "@formanywhere/ui/typography";
import { TemplateCard } from "../template-card";
import { templates } from "./config";

const popularTemplates = templates.filter((t) => t.popular);

export default function PopularTemplatesSection() {
  return (
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
          <For each={popularTemplates}>
            {(template) => <TemplateCard template={template} />}
          </For>
        </div>
      </div>
    </section>
  );
}
