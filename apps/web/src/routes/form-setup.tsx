/**
 * Form Setup Page — SolidStart route
 * Reads URL query params via useSearchParams and passes them to FormSetupPage.
 */
import { lazy, Suspense } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import PageLayout from "~/components/PageLayout";
import type { FormSetupPageProps } from "@formanywhere/shared/form-setup";

const FormSetupPage = lazy(() =>
  import("@formanywhere/shared/form-setup").then((m) => ({ default: m.FormSetupPage }))
);

export default function FormSetupRoute() {
  const [searchParams] = useSearchParams();

  const mode = (): FormSetupPageProps["mode"] => {
    const m = searchParams.mode;
    if (m === "ai" || m === "blank" || m === "template" || m === "import") {
      return m;
    }
    return "blank";
  };

  return (
    <PageLayout title="Form Setup - FormAnywhere">
      <Suspense>
        <FormSetupPage mode={mode()} />
      </Suspense>
    </PageLayout>
  );
}
