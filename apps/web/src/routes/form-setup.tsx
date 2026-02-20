/**
 * Form Setup Page — SolidStart route
 * Reads URL query params and passes them to FormSetupPage.
 */
import { createSignal, lazy, onMount, Show, Suspense } from "solid-js";
import PageLayout from "~/components/PageLayout";
import type { FormSetupPageProps } from "@formanywhere/shared/form-setup";

const FormSetupPage = lazy(() =>
  import("@formanywhere/shared/form-setup").then((m) => ({ default: m.FormSetupPage }))
);

export default function FormSetupRoute() {
  const [mode, setMode] = createSignal<FormSetupPageProps["mode"]>("blank");
  const [ready, setReady] = createSignal(false);

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get("mode");
    if (m === "ai" || m === "blank" || m === "template" || m === "import") {
      setMode(m);
    }
    setReady(true);
  });

  return (
    <PageLayout title="Form Setup - FormAnywhere">
      <Show when={ready()}>
        <Suspense>
          <FormSetupPage mode={mode()} />
        </Suspense>
      </Show>
    </PageLayout>
  );
}
