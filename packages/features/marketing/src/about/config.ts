/**
 * About Page — Static config
 */
export const values = [
    {
        icon: "offline",
        title: "Offline-First Architecture",
        description:
            "Built from the ground up to work without internet. Your data is yours, stored locally, and syncs when you're ready.",
    },
    {
        icon: "shield",
        title: "Privacy by Design",
        description:
            "No tracking, no analytics on your data. Self-hostable for complete control. Your forms, your rules.",
    },
    {
        icon: "zap",
        title: "Blazing Fast Performance",
        description:
            "Modern tech stack with SolidStart, SolidJS, and Tauri. Sub-100KB bundles, instant interactions, native speed.",
    },
    {
        icon: "heart",
        title: "Built for Real Work",
        description:
            "Designed for field workers, inspectors, and teams who need forms that just work—anywhere, anytime.",
    },
];

export const techStack = [
    { name: "SolidStart", description: "Full-stack framework" },
    { name: "SolidJS", description: "Reactive UI library" },
    { name: "Tauri", description: "Lightweight desktop apps" },
    { name: "Hono", description: "Edge-ready API server" },
];

export const iconPaths: Record<string, string> = {
    offline:
        "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    heart:
        "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
};

export const valueColors = [
    { bg: "color-mix(in srgb, var(--m3-color-primary) 10%, transparent)", text: "var(--m3-color-primary)" },
    { bg: "color-mix(in srgb, var(--m3-color-secondary) 10%, transparent)", text: "var(--m3-color-secondary)" },
    { bg: "color-mix(in srgb, var(--m3-color-tertiary) 10%, transparent)", text: "var(--m3-color-tertiary)" },
    { bg: "color-mix(in srgb, var(--m3-color-primary) 10%, transparent)", text: "var(--m3-color-primary)" },
];
