/**
 * Form Preview Page — SolidStart route
 */
import { lazy, Suspense } from "solid-js";
import PageLayout from "~/components/PageLayout";

const FormPreviewPage = lazy(() =>
  import("@formanywhere/form-runtime").then((m) => ({ default: m.FormPreviewPage }))
);

export default function PreviewRoute() {
  return (
    <PageLayout title="Form Preview - FormAnywhere">
      <Suspense>
        <FormPreviewPage />
      </Suspense>
    </PageLayout>
  );
}
