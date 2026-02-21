/**
 * Dashboard Page — SolidStart route
 * Uses server function to get session from middleware (no redundant client-side auth call).
 * Preloads session data during navigation for zero-waterfall rendering.
 */
import { lazy, Show, Suspense } from "solid-js";
import { createAsync, type RouteDefinition } from "@solidjs/router";
import PageLayout from "~/components/PageLayout";
import { getSession, type SessionUser } from "~/server/session";

const Dashboard = lazy(() =>
  import("@formanywhere/dashboard").then((m) => ({ default: m.Dashboard }))
);
const AuthProvider = lazy(() =>
  import("@formanywhere/auth").then((m) => ({ default: m.AuthProvider }))
);

export const route = {
  preload: () => getSession(),
} satisfies RouteDefinition;

export default function DashboardPage() {
  const session = createAsync(() => getSession());

  return (
    <PageLayout title="Dashboard | FormAnywhere">
      <Suspense fallback={<div style={{ "min-height": "100vh", display: "flex", "align-items": "center", "justify-content": "center" }}><div style={{ width: "2rem", height: "2rem", border: "2px solid var(--m3-color-primary)", "border-top-color": "transparent", "border-radius": "9999px", animation: "spin 1s linear infinite" }} /></div>}>
        <AuthProvider>
          <Show
            when={session() as SessionUser | undefined}
            fallback={
              <Dashboard userId="guest" userName="Guest User" userEmail="guest@formanywhere.com" />
            }
          >
            {(user) => (
              <Dashboard
                userId={user().id}
                userName={user().name || "User"}
                userEmail={user().email || ""}
              />
            )}
          </Show>
        </AuthProvider>
      </Suspense>
    </PageLayout>
  );
}
