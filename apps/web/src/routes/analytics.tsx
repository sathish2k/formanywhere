import { lazy, Suspense } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import PageLayout from "~/components/PageLayout";

const AnalyticsView = lazy(() =>
    import("@formanywhere/dashboard").then((m) => ({ default: m.AnalyticsView }))
);
const AuthProvider = lazy(() =>
    import("@formanywhere/auth").then((m) => ({ default: m.AuthProvider }))
);

export default function AnalyticsPage() {
    const [searchParams] = useSearchParams();
    const formId = () => searchParams.form as string | undefined;

    return (
        <PageLayout title="Analytics | FormAnywhere">
            <Suspense fallback={<div style={{ "min-height": "100vh", display: "flex", "align-items": "center", "justify-content": "center" }}><div style={{ width: "2rem", height: "2rem", border: "2px solid var(--m3-color-primary)", "border-top-color": "transparent", "border-radius": "9999px", animation: "spin 1s linear infinite" }} /></div>}>
                <AuthProvider>
                    <AnalyticsView formId={formId()} />
                </AuthProvider>
            </Suspense>
        </PageLayout>
    );
}
