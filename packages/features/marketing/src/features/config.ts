/**
 * Features Section — Static config
 */
export const secondaryFeatures = [
    {
        icon: "shield",
        title: "Enterprise Security",
        desc: "SOC2 Compliance, End-to-end encryption, and custom data retention policies.",
    },
    {
        icon: "chart",
        title: "Advanced Analytics",
        desc: "Real-time dashboards, export to BI tools, and automated scheduled reports.",
    },
    {
        icon: "users",
        title: "Team Management",
        desc: "Granular RBAC, SSO integration (Okta, Azure AD), and audit logs.",
    },
    {
        icon: "code",
        title: "Developer API",
        desc: "Full REST API access, webhooks, and client SDKs for custom integrations.",
    },
] as const;

export const iconPaths: Record<string, string> = {
    shield:
        "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    chart:
        "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z",
    users:
        "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    code: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
};
