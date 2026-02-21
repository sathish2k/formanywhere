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
    },
  ],
});
