/**
 * Stats Section — Static config
 */
export const stats = [
    { id: "offline", number: "100%", label: "Offline Capable", desc: "Works without internet", icon: "wifi-off" },
    { id: "sync", number: "Auto", label: "Background Sync", desc: "When you reconnect", icon: "refresh" },
    { id: "platforms", number: "3+", label: "Platforms", desc: "Web, Desktop, PWA", icon: "devices" },
    { id: "privacy", number: "Zero", label: "Data Tracking", desc: "Privacy by design", icon: "shield" },
] as const;

export const iconColors: Record<string, string> = {
    offline: "var(--m3-color-tertiary)",
    sync: "var(--m3-color-secondary)",
    platforms: "var(--m3-color-primary)",
    privacy: "var(--m3-color-tertiary)",
};
