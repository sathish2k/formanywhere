/**
 * Pricing Page — Static config
 */
import type { PricingPlan } from "../pricing-table";
import type { FAQ } from "../faq-section";

export const pricingPlans: PricingPlan[] = [
    {
        name: "Free",
        description: "Perfect for trying out FormAnywhere",
        monthlyPrice: 0,
        annualPrice: 0,
        popular: false,
        gradient: false,
        cta: "Get Started Free",
        ctaHref: "/signup",
        features: [
            { name: "Up to 3 forms", included: true },
            { name: "100 responses/month", included: true },
            { name: "Basic field types", included: true },
            { name: "Offline form filling", included: true },
            { name: "Email notifications", included: true },
            { name: "Community support", included: true },
            { name: "Photo capture", included: false },
            { name: "Signature collection", included: false },
            { name: "GPS tagging", included: false },
            { name: "Background sync", included: false },
        ],
    },
    {
        name: "Pro",
        description: "For professionals and growing teams",
        monthlyPrice: 19,
        annualPrice: 190,
        popular: true,
        gradient: true,
        cta: "Start Free Trial",
        ctaHref: "/signup",
        features: [
            { name: "Unlimited forms", included: true },
            { name: "10,000 responses/month", included: true },
            { name: "All field types", included: true },
            { name: "Full offline capabilities", included: true },
            { name: "Photo capture & compression", included: true },
            { name: "Signature collection", included: true },
            { name: "GPS location tagging", included: true },
            { name: "Background sync", included: true },
            { name: "Conditional logic", included: true },
            { name: "PDF report generation", included: true },
        ],
    },
    {
        name: "Lifetime",
        description: "One payment, yours forever",
        monthlyPrice: 249,
        annualPrice: 249,
        isLifetime: true,
        popular: false,
        gradient: false,
        cta: "Buy Once, Own Forever",
        ctaHref: "/signup",
        features: [
            { name: "Everything in Pro", included: true },
            { name: "Unlimited responses", included: true },
            { name: "No recurring fees", included: true },
            { name: "Priority support", included: true },
            { name: "Desktop app access", included: true },
            { name: "Future updates included", included: true },
            { name: "API access", included: true },
            { name: "Webhooks", included: true },
            { name: "Custom branding", included: true },
            { name: "Export to CSV/Excel", included: true },
        ],
    },
];

export const enterpriseFeatures = [
    "Self-hosted deployment",
    "SSO / SAML integration",
    "Custom data retention",
    "Dedicated support SLA",
    "HIPAA compliance ready",
    "Custom integrations",
    "Audit logs",
    "Role-based access control",
];

export const faqs: FAQ[] = [
    {
        q: "What does offline-first mean?",
        a: "FormAnywhere works 100% without internet. All form data is saved locally on your device first, then automatically syncs to the cloud when you reconnect. No data loss, ever.",
    },
    {
        q: "Why offer a lifetime plan?",
        a: "We believe in straightforward pricing. Many professionals are tired of recurring subscriptions. Pay once, own it forever—no strings attached.",
    },
    {
        q: "Can I capture photos and signatures offline?",
        a: "Yes! Pro and Lifetime plans include full offline capabilities including photo capture, signature collection, and GPS tagging—all work without internet.",
    },
    {
        q: "Is my data secure?",
        a: "Absolutely. Data is encrypted both on your device and in transit. Enterprise customers can self-host for complete data control.",
    },
    {
        q: "What happens if I exceed my response limit?",
        a: "You'll receive a notification when approaching your limit. You can upgrade anytime, and local data is never lost.",
    },
    {
        q: "Do you offer refunds?",
        a: "Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund.",
    },
];
