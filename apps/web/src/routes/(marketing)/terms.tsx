import PageLayout from "~/components/PageLayout";
import { TermsOfService } from "@formanywhere/marketing/legal";

export default function TermsPage() {
    return (
        <PageLayout
            title="Terms of Service | FormAnywhere"
            description="Read the Terms of Service for using FormAnywhere."
            ogUrl="https://formanywhere.com/terms"
        >
            <TermsOfService />
        </PageLayout>
    );
}
