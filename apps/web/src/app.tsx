// @refresh reload
import { Suspense, ErrorBoundary } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { MetaProvider, Title, Meta, Link } from "@solidjs/meta";
import { ThemeProvider } from "@formanywhere/ui/theme";
import { onMount } from "solid-js";
import { clientOnly } from "@solidjs/start";
import { AppErrorFallback } from "~/components/error-fallback";

const CookieConsent = clientOnly(() => import("@formanywhere/shared/components/cookie-consent"));

import "./styles/global.css";
import "@formanywhere/ui/styles/theme-base.css";
import "@formanywhere/ui/styles/theme-schemes.css";
import "@formanywhere/ui/styles/glass.css";
import "@formanywhere/ui/styles/accessibility.css";
import "@formanywhere/ui/styles/typography.css";
import "@formanywhere/ui/styles/ripple.css";

export default function App() {
  // Load Google Analytics (non-blocking, only in browser, only with consent)
  onMount(() => {
    const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (!gaId || typeof document === 'undefined') return;
    // Respect cookie consent — don't load analytics if declined
    const consent = localStorage.getItem('fa_cookie_consent');
    if (consent === 'declined') return;
    if (!consent) return; // Wait for consent decision
    if (document.querySelector(`script[src*="googletagmanager"]`)) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    script.onload = () => {
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) { (window as any).dataLayer.push(args); }
      gtag('js', new Date());
      gtag('config', gaId, { anonymize_ip: true });
    };
  });

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
          <Link rel="manifest" href="/manifest.webmanifest" />
          <Meta name="theme-color" content="#006A6A" />
          <ThemeProvider>
            <ErrorBoundary fallback={AppErrorFallback}>
              <Suspense>{props.children}</Suspense>
            </ErrorBoundary>
            <CookieConsent />
          </ThemeProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
