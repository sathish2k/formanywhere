/**
 * Dashboard Page — SolidStart route
 * Uses Better Auth session to get user data
 */
import { createResource, lazy, Show, Suspense } from "solid-js";
import PageLayout from "~/components/PageLayout";
import { authClient } from "@formanywhere/shared/auth-client";

const Dashboard = lazy(() =>
  import("@formanywhere/dashboard").then((m) => ({ default: m.Dashboard }))
);
const AuthProvider = lazy(() =>
  import("@formanywhere/auth").then((m) => ({ default: m.AuthProvider }))
);

export default function DashboardPage() {
  const [session] = createResource(async () => {
    try {
      const result = await authClient.getSession();
      return result.data?.user || null;
    } catch {
      return null;
    }
  });

  return (
    <PageLayout title="Dashboard | FormAnywhere">
      <Suspense fallback={<div class="min-h-screen flex items-center justify-center"><div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>}>
        <AuthProvider>
          <Show
            when={session()}
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
