/**
 * SolidStart Middleware for Authentication
 *
 * Server-side session validation using Better Auth.
 * Runs on every request before the page renders.
 * Sets event.locals.user and event.locals.isAuthenticated
 * which can be read in server functions via getRequestEvent().
 */
import { createMiddleware } from "@solidjs/start/middleware";

const API_URL = process.env.API_URL || "http://localhost:3001";

const VALID_THEME_MODES = new Set(['light', 'dark', 'system']);
const VALID_THEME_COLORS = new Set(['green', 'purple', 'blue', 'pink', 'orange', 'red']);

/** Parse theme preference cookies from the Cookie header. */
function parseThemeCookies(cookieHeader: string | null) {
  const results: Record<string, string> = {};
  if (!cookieHeader) return results;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx > 0) {
      const key = part.slice(0, idx).trim();
      if (key === 'formanywhere-theme' || key === 'formanywhere-theme-color') {
        results[key] = decodeURIComponent(part.slice(idx + 1).trim());
      }
    }
  }
  return results;
}

export default createMiddleware({
  onRequest: [
    async (event) => {
      const { pathname } = new URL(event.request.url);

      // Skip middleware for static assets, API calls — but NOT /_server RPCs
      // (SolidStart server functions use /_server/* during client-side navigation)
      if (
        (pathname.startsWith("/_") && !pathname.startsWith("/_server")) ||
        pathname.startsWith("/api/") ||
        pathname.includes(".")
      ) {
        return;
      }

      // Try to get session from cookies
      let sessionUser: { id: string; name: string; email: string; image?: string } | null = null;

      try {
        const cookieHeader = event.request.headers.get("cookie");
        if (cookieHeader) {
          const response = await fetch(`${API_URL}/api/auth/get-session`, {
            headers: { cookie: cookieHeader },
          });

          if (response.ok) {
            const data = await response.json();
            if (data?.user) {
              sessionUser = data.user;
            }
          }
        }
      } catch (err) {
        console.error("[Auth Middleware] Failed to validate session:", err);
      }

      // Store user in request context via typed locals
      event.locals.user = sessionUser;
      event.locals.isAuthenticated = !!sessionUser;

      // Parse theme cookies so entry-server.tsx can set correct <html> attrs for SSR
      const cookieHeader = event.request.headers.get('cookie');
      const themeCookies = parseThemeCookies(cookieHeader);
      const rawMode = themeCookies['formanywhere-theme'];
      const rawColor = themeCookies['formanywhere-theme-color'];
      event.locals.themeMode = VALID_THEME_MODES.has(rawMode)
        ? (rawMode as 'light' | 'dark' | 'system')
        : 'system';
      event.locals.themeColor = VALID_THEME_COLORS.has(rawColor)
        ? (rawColor as 'green' | 'purple' | 'blue' | 'pink' | 'orange' | 'red')
        : 'green';
    },
  ],
});
