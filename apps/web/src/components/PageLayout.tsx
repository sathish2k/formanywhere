import type { ParentComponent } from "solid-js";
import { Title, Meta, Link } from "@solidjs/meta";

interface PageLayoutProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
}

const SITE_URL = 'https://formanywhere.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/logos/og-default.png`;

/**
 * Page layout wrapper — replaces BaseLayout.astro.
 * Sets page-level <title>, <meta>, and Open Graph / Twitter Card tags.
 */
export const PageLayout: ParentComponent<PageLayoutProps> = (props) => {
  const title = () => props.title ?? "FormAnywhere | Build Powerful Forms That Work Offline";
  const description = () => props.description ?? "Create multi-step forms, surveys, and questionnaires with drag-and-drop simplicity. Works offline, syncs when connected.";
  const ogImage = () => props.ogImage ?? DEFAULT_OG_IMAGE;
  const ogUrl = () => props.ogUrl ?? SITE_URL;
  const ogType = () => props.ogType ?? "website";

  return (
    <>
      <Title>{title()}</Title>
      <Meta name="description" content={description()} />

      {/* Open Graph */}
      <Meta property="og:type" content={ogType()} />
      <Meta property="og:title" content={title()} />
      <Meta property="og:description" content={description()} />
      <Meta property="og:image" content={ogImage()} />
      <Meta property="og:url" content={ogUrl()} />
      <Meta property="og:site_name" content="FormAnywhere" />

      {/* Twitter Card */}
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content={title()} />
      <Meta name="twitter:description" content={description()} />
      <Meta name="twitter:image" content={ogImage()} />

      {/* Canonical URL */}
      <Link rel="canonical" href={ogUrl()} />

      {props.children}
    </>
  );
};

export default PageLayout;
