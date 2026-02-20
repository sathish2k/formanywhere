/**
 * Stats Section — SolidJS
 * Product capabilities with offline-first metrics
 * Uses Box/Stack from @formanywhere/ui for layout
 */
import { For } from "solid-js";
import { Typography } from "@formanywhere/ui/typography";
import { Box } from "@formanywhere/ui/box";
import { Stack } from "@formanywhere/ui/stack";
import { stats, iconColors } from "./config";

const iconColorMap: Record<string, string> = {
    "text-primary": "var(--m3-color-primary)",
    "text-secondary": "var(--m3-color-secondary)",
    "text-tertiary": "var(--m3-color-tertiary)",
    "text-success": "var(--m3-color-secondary)",
};

function StatIcon(props: { icon: string }) {
    return (
        <>
            {props.icon === "wifi-off" && <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0112 10c-1.68 0-3.28.37-4.72 1.06M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.58 9M1.42 9a15.91 15.91 0 014.7-3.03M8.53 16.11a6 6 0 016.95 0M12 20h.01" /></svg>}
            {props.icon === "refresh" && <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>}
            {props.icon === "devices" && <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>}
            {props.icon === "shield" && <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
        </>
    );
}

export default function StatsSection() {
    return (
        <Box as="section" style={{ position: "relative", padding: "8rem 0", overflow: "hidden" }} id="stats-section">
            <div style={{ position: "absolute", inset: 0, "pointer-events": "none" }}>
                <div style={{ position: "absolute", top: "50%", left: "25%", width: "500px", height: "500px", background: "color-mix(in srgb, var(--m3-color-secondary) 10%, transparent)", "border-radius": "9999px", filter: "blur(120px)" }} />
                <div style={{ position: "absolute", bottom: 0, right: "25%", width: "600px", height: "600px", background: "color-mix(in srgb, var(--m3-color-primary) 5%, transparent)", "border-radius": "9999px", filter: "blur(100px)" }} />
            </div>

            <Box maxWidth="7xl" marginX="auto" paddingX="md" style={{ position: "relative", "z-index": 10 }}>
                <div style={{
                    display: "grid",
                    "grid-template-columns": "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "2rem",
                }}>
                    <For each={[...stats]}>
                        {(stat, i) => {
                            const colorClass = iconColors[stat.id] || "text-primary";
                            const color = iconColorMap[colorClass] || "var(--m3-color-primary)";
                            return (
                                <div style={{
                                    position: "relative",
                                    transition: "transform 0.7s ease",
                                    transform: i() % 2 === 0 ? "translateY(2rem)" : "translateY(-1rem)",
                                }}>
                                    <div style={{
                                        position: "relative",
                                        overflow: "hidden",
                                        "border-radius": "32px",
                                        padding: "2rem",
                                        background: "var(--m3-color-surface-container)",
                                        border: "1px solid var(--m3-color-outline-variant)",
                                        "box-shadow": "0 8px 32px rgba(0, 0, 0, 0.08)",
                                    }}>
                                        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "160px", height: "160px", background: `linear-gradient(135deg, color-mix(in srgb, ${color} 15%, transparent), transparent)`, "border-radius": "9999px", filter: "blur(40px)" }} />
                                        <div style={{ position: "absolute", bottom: "16px", right: "16px", color, opacity: 0.08, transform: "scale(2)", "pointer-events": "none" }}>
                                            <StatIcon icon={stat.icon} />
                                        </div>
                                        <Stack direction="column" gap="sm" align="center" style={{ position: "relative", "z-index": 10, "text-align": "center" }}>
                                            <Typography
                                                variant="display-large"
                                                as="span"
                                                style={{
                                                    "font-weight": "900",
                                                    background: "linear-gradient(135deg, var(--m3-color-on-surface), var(--m3-color-on-surface-variant))",
                                                    "-webkit-background-clip": "text",
                                                    "background-clip": "text",
                                                    color: "transparent",
                                                    "letter-spacing": "-0.02em",
                                                }}
                                            >
                                                {stat.number}
                                            </Typography>
                                            <Typography variant="title-medium" color="on-surface" as="span" style={{ "font-weight": "700" }}>
                                                {stat.label}
                                            </Typography>
                                            <span style={{
                                                display: "inline-block",
                                                padding: "4px 12px",
                                                "border-radius": "9999px",
                                                background: "var(--m3-color-surface-container-high)",
                                                "font-size": "0.75rem",
                                                "font-weight": "600",
                                                color: "var(--m3-color-on-surface)",
                                                border: "1px solid var(--m3-color-outline-variant)",
                                            }}>
                                                {stat.desc}
                                            </span>
                                        </Stack>
                                    </div>
                                </div>
                            );
                        }}
                    </For>
                </div>
            </Box>
        </Box>
    );
}
