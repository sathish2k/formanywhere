// @refresh reload
import { Suspense, ErrorBoundary } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { MetaProvider, Title, Meta, Link } from "@solidjs/meta";
import { ThemeProvider } from "@formanywhere/ui/theme";

import "./styles/global.css";
import "@formanywhere/ui/styles/theme-base.css";
import "@formanywhere/ui/styles/glass.css";
import "@formanywhere/ui/styles/accessibility.css";
import "@formanywhere/ui/styles/typography.css";
import "@formanywhere/ui/styles/ripple.css";

function AppErrorFallback(err: Error, reset: () => void) {
  return (
    <div style={{ "min-height": "100vh", display: "flex", "align-items": "center", "justify-content": "center", background: "var(--m3-color-background, #fff)" }}>
      <div style={{ "text-align": "center", "max-width": "480px", padding: "2rem" }}>
        <h1 style={{ "font-size": "1.5rem", "font-weight": "700", color: "var(--m3-color-error, #BA1A1A)", "margin-bottom": "1rem" }}>Something went wrong</h1>
        <p style={{ color: "var(--m3-color-on-surface-variant, #49454F)", "margin-bottom": "1.5rem", "line-height": "1.5" }}>
          {err.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          style={{
            padding: "12px 24px",
            "border-radius": "12px",
            border: "none",
            background: "var(--m3-color-primary, #006A6A)",
            color: "var(--m3-color-on-primary, #fff)",
            "font-weight": "600",
            cursor: "pointer",
            "font-size": "0.875rem",
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

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
          <ThemeProvider>
            <ErrorBoundary fallback={AppErrorFallback}>
              <Suspense>{props.children}</Suspense>
            </ErrorBoundary>
          </ThemeProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
