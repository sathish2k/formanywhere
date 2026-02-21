/**
 * Template Browser Section — lazy-loaded below fold.
 * Co-locates templates/categories/iconPaths data with TemplateBrowser component.
 */
import { TemplateBrowser } from "../template-browser";
import { templates, categories, iconPaths } from "./config";

export default function TemplateBrowserSection() {
  return (
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
        <TemplateBrowser initialTemplates={templates} categories={categories} iconPaths={iconPaths} />
      </div>
    </section>
  );
}
