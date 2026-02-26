/**
 * Template Browser Section — lazy-loaded below fold.
 * Fetches templates from the DB and renders with Use/Preview actions.
 */
import { createResource, Show } from "solid-js";
import { TemplateBrowser } from "../template-browser";
import { fetchTemplates } from "@formanywhere/shared/templates-api";
import { go } from "@formanywhere/shared/utils";
import { categories, iconPaths } from "./config";
import type { Template } from "../template-card";

export default function TemplateBrowserSection() {
  const [dbTemplates] = createResource(() => fetchTemplates());

  const templates = () =>
    (dbTemplates() ?? []).map((t): Template => ({
      id: t.id,
      name: t.name,
      description: t.description ?? "",
      category: t.category,
      popular: false,
      uses: "–",
      fields: [],
    }));

  const handleUse = (id: string) => {
    go(`/app?template=${id}&mode=template`);
  };

  const handlePreview = (id: string) => go(`/preview?template=${id}`);

  return (
    <section style={{ padding: "3rem 0" }}>
      <div style={{ "max-width": "72rem", margin: "0 auto", padding: "0 1rem" }}>
        <Show when={!dbTemplates.loading}>
          <TemplateBrowser
            initialTemplates={templates()}
            categories={categories}
            iconPaths={iconPaths}
            onUse={handleUse}
            onPreview={handlePreview}
          />
        </Show>
      </div>
    </section>
  );
}
