/**
 * Reset Password Page — SolidStart route
 * Layout: (auth) — Split-panel with branding provided by layout
 * 
 * Accessed via the password reset link sent by email.
 * Expects a `?token=...` query parameter.
 */
import { lazy, Suspense } from "solid-js";
import PageLayout from "~/components/PageLayout";
import { Typography } from "@formanywhere/ui/typography";

const ResetPasswordForm = lazy(() =>
  import("@formanywhere/auth/reset-password").then((m) => ({ default: m.ResetPasswordForm }))
);

export default function ResetPasswordPage() {
  return (
    <PageLayout title="Reset Password | FormAnywhere" description="Set a new password for your FormAnywhere account">

      {/* Header */}
      <div style={{ "margin-bottom": "2rem" }}>
        <Typography variant="headline-large" color="on-surface" as="h1">
          Reset your password
        </Typography>
        <Typography variant="body-large" color="on-surface-variant" style={{ "margin-top": "0.5rem" }}>
          Choose a new secure password for your account
        </Typography>
      </div>

      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </PageLayout>
  );
}
