import PageLayout from "~/components/PageLayout";
import { PrivacyPolicy } from "@formanywhere/marketing/legal";

export default function PrivacyPage() {
    return (
        <PageLayout
            title="Privacy Policy | FormAnywhere"
            description="Learn how FormAnywhere collects, uses, and protects your personal data."
            ogUrl="https://formanywhere.com/privacy"
        >
            <PrivacyPolicy />
        </PageLayout>
    );
}
