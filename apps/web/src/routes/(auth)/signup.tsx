/**
 * Sign Up Page — SolidStart route
 * Layout: (auth) — Split-panel with branding provided by layout
 */
import { lazy, Suspense } from "solid-js";
import PageLayout from "~/components/PageLayout";
import { Typography } from "@formanywhere/ui/typography";

const SignUpForm = lazy(() =>
  import("@formanywhere/auth/signup").then((m) => ({ default: m.SignUpForm }))
);

export default function SignUpPage() {
  return (
    <PageLayout title="Create Account | FormAnywhere" description="Create your FormAnywhere account and start building forms">

      {/* Header */}
      <div style={{ "margin-bottom": "2rem" }}>
        <Typography variant="headline-large" color="on-surface" as="h1">
          Create your account
        </Typography>
        <Typography variant="body-large" color="on-surface-variant" style={{ "margin-top": "0.5rem" }}>
          Start building beautiful forms in minutes
        </Typography>
      </div>

      <Suspense>
        <SignUpForm />
      </Suspense>
    </PageLayout>
  );
}
