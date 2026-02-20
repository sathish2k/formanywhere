/**
 * Sign In Page — SolidStart route
 * Layout: (auth) — Split-panel with branding provided by layout
 */
import { lazy, Suspense } from "solid-js";
import PageLayout from "~/components/PageLayout";
import { Typography } from "@formanywhere/ui/typography";

const SignInForm = lazy(() =>
  import("@formanywhere/auth/signin").then((m) => ({ default: m.SignInForm }))
);

export default function SignInPage() {
  return (
    <PageLayout title="Sign In | FormAnywhere" description="Sign in to your FormAnywhere account">

      {/* Header */}
      <div class="mb-8">
        <Typography variant="headline-large" color="on-surface" as="h1">
          Welcome back
        </Typography>
        <Typography variant="body-large" color="on-surface-variant" class="mt-2">
          Sign in to your account to continue
        </Typography>
      </div>

      <Suspense>
        <SignInForm />
      </Suspense>
    </PageLayout>
  );
}
