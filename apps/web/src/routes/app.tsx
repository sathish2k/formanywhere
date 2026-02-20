/**
 * Form Builder Page — SolidStart route (was app.astro)
 */
import { lazy, Suspense } from "solid-js";
import PageLayout from "~/components/PageLayout";

const FormBuilderWrapper = lazy(() =>
  import("@formanywhere/form-editor").then((m) => ({ default: m.FormBuilderWrapper }))
);

export default function BuilderPage() {
  return (
    <PageLayout title="Form Builder - FormAnywhere">
      <Suspense>
        <FormBuilderWrapper />
      </Suspense>
    </PageLayout>
  );
}
