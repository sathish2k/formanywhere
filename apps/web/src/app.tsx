// @refresh reload
import { Suspense } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { MetaProvider, Title, Meta, Link } from "@solidjs/meta";
import { ThemeProvider } from "@formanywhere/ui/theme";

import "./styles/global.css";
import "@formanywhere/ui/styles/theme.css";
import "@formanywhere/ui/styles/glass.css";
import "@formanywhere/ui/styles/accessibility.css";
import "@formanywhere/ui/styles/typography.css";
import "@formanywhere/ui/styles/ripple.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>FormAnywhere | Build Powerful Forms That Work Offline</Title>
          <Meta charset="UTF-8" />
          <Meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <Meta
            name="description"
            content="Create multi-step forms, surveys, and questionnaires with drag-and-drop simplicity. Works offline, syncs when connected."
          />
          <Link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <Link
            rel="preload"
            href="/fonts/inter-latin.woff2"
            as="font"
            type="font/woff2"
            crossorigin=""
          />
          <ThemeProvider>
            <Suspense>{props.children}</Suspense>
          </ThemeProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
