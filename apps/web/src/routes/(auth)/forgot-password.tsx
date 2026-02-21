/**
 * Forgot Password Page — SolidStart route
 * Layout: (auth) — Split-panel with branding provided by layout
 */
import { lazy, Suspense } from "solid-js";
import PageLayout from "~/components/PageLayout";
import { Typography } from "@formanywhere/ui/typography";

const ForgotPasswordForm = lazy(() =>
  import("@formanywhere/auth/forgot-password").then((m) => ({ default: m.ForgotPasswordForm }))
);

export default function ForgotPasswordPage() {
  return (
    <PageLayout title="Forgot Password | FormAnywhere" description="Reset your FormAnywhere account password">

      {/* Header */}
      <div style={{ "margin-bottom": "2rem" }}>
        <Typography variant="headline-large" color="on-surface" as="h1">
          Forgot your password?
        </Typography>
        <Typography variant="body-large" color="on-surface-variant" style={{ "margin-top": "0.5rem" }}>
          No worries, we'll send you a reset link
        </Typography>
      </div>

      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </PageLayout>
  );
}
