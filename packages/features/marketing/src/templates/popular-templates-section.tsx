/**
 * Popular Templates Section — lazy-loaded below fold.
 * Fetches real templates from the DB and renders the ones marked popular.
 */
import { For, Show, createResource } from "solid-js";
import { Typography } from "@formanywhere/ui/typography";
import { TemplateCard } from "../template-card";
import type { Template } from "../template-card";
import { fetchTemplates } from "@formanywhere/shared/templates-api";
import { go } from "@formanywhere/shared/utils";

export default function PopularTemplatesSection() {
  const [dbTemplates] = createResource(() => fetchTemplates());

  const templates = (): Template[] =>
    (dbTemplates() ?? []).slice(0, 4).map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description ?? "",
      category: t.category,
      popular: true,
      uses: "–",
      fields: [],
    }));

  const handleUse = (id: string) => {
    go(`/app?template=${id}&mode=template`);
  };

  const handlePreview = (id: string) => {
    go(`/preview?template=${id}`);
  };

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

        <Show when={!dbTemplates.loading} fallback={<div style={{ "min-height": "200px" }} />}>
          <div
            style={{
              display: "grid",
              gap: "1.5rem",
              "grid-template-columns": "repeat(auto-fit, minmax(240px, 1fr))",
            }}
          >
            <For each={templates()}>
              {(template) => (
                <TemplateCard
                  template={template}
                  onUse={handleUse}
                  onPreview={handlePreview}
                />
              )}
            </For>
          </div>
        </Show>
      </div>
    </section>
  );
}
