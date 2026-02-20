import type { ParentComponent } from "solid-js";
import { Title, Meta } from "@solidjs/meta";

interface PageLayoutProps {
  title?: string;
  description?: string;
}

/**
 * Page layout wrapper — replaces BaseLayout.astro.
 * Sets page-level <title> and <meta> via @solidjs/meta.
 */
export const PageLayout: ParentComponent<PageLayoutProps> = (props) => {
  return (
    <>
      <Title>{props.title ?? "FormAnywhere | Build Powerful Forms That Work Offline"}</Title>
      <Meta
        name="description"
        content={props.description ?? "Create multi-step forms, surveys, and questionnaires with drag-and-drop simplicity. Works offline, syncs when connected."}
      />
      {props.children}
    </>
  );
};

export default PageLayout;
