/**
 * Integrations Section — SolidJS
 * Infinite scroll integration cards with CSS animations
 * Uses Box/Stack from @formanywhere/ui for layout
 */
import { For } from "solid-js";
import { Typography } from "@formanywhere/ui/typography";
import { Button } from "@formanywhere/ui/button";
import { Box } from "@formanywhere/ui/box";
import { Stack } from "@formanywhere/ui/stack";
import { integrations } from "./config";

// Duplicate for infinite scroll
const row1 = [...integrations, ...integrations, ...integrations];
const row2 = [...[...integrations].reverse(), ...integrations, ...integrations];

export default function IntegrationsSection() {
    return (
        <Box as="section" style={{ position: "relative", overflow: "hidden", padding: "8rem 0", background: "var(--m3-color-background, #fef7ff)" }}>
            {/* Background Ambience */}
            <div style={{ position: "absolute", inset: 0, "pointer-events": "none" }}>
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "800px", height: "500px", background: "color-mix(in srgb, var(--m3-color-secondary) 5%, transparent)", "border-radius": "9999px", filter: "blur(120px)" }} />
                <div style={{ position: "absolute", bottom: 0, right: 0, width: "600px", height: "600px", background: "color-mix(in srgb, var(--m3-color-primary) 5%, transparent)", "border-radius": "9999px", filter: "blur(100px)" }} />
            </div>

            <Box maxWidth="7xl" marginX="auto" paddingX="md" textAlign="center" style={{ position: "relative", "z-index": 10, "margin-bottom": "5rem" }}>
                <div style={{
                    display: "inline-flex",
                    "align-items": "center",
                    gap: "8px",
                    padding: "4px 16px",
                    "border-radius": "9999px",
                    background: "var(--m3-color-surface-container)",
                    border: "1px solid color-mix(in srgb, var(--m3-color-outline-variant) 50%, transparent)",
                    "backdrop-filter": "blur(12px)",
                    "margin-bottom": "2rem",
                    "box-shadow": "0 1px 3px rgba(0,0,0,0.1)",
                }}>
                    <span style={{ position: "relative", display: "flex", width: "8px", height: "8px" }}>
                        <span style={{ position: "absolute", display: "inline-flex", width: "100%", height: "100%", "border-radius": "9999px", background: "var(--m3-color-secondary)", opacity: 0.75, animation: "integrations-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite" }} />
                        <span style={{ position: "relative", display: "inline-flex", "border-radius": "9999px", width: "8px", height: "8px", background: "var(--m3-color-secondary)" }} />
                    </span>
                    <span style={{ "font-size": "0.75rem", "font-weight": "700", "letter-spacing": "0.1em", color: "var(--m3-color-on-surface-variant)", "text-transform": "uppercase" }}>Sync When Online</span>
                </div>

                <Typography
                    variant="display-medium"
                    color="on-surface"
                    as="h2"
                    style={{
                        "font-weight": "900",
                        background: "linear-gradient(to right, var(--m3-color-on-surface), var(--m3-color-on-surface-variant))",
                        "-webkit-background-clip": "text",
                        "background-clip": "text",
                        color: "transparent",
                        "margin-bottom": "1.5rem",
                        "letter-spacing": "-0.02em",
                    }}
                >
                    Works Offline,
                    <br />
                    <span class="integrations-gradient-text" style={{
                        color: "transparent",
                        "-webkit-background-clip": "text",
                        "background-clip": "text",
                        "background-image": "linear-gradient(to right, var(--m3-color-primary), var(--m3-color-tertiary), var(--m3-color-secondary))",
                    }}>
                        Syncs Everywhere
                    </span>
                </Typography>
                <p style={{ "font-size": "1.25rem", color: "var(--m3-color-on-surface-variant)", "max-width": "42rem", margin: "0 auto", opacity: 0.8 }}>
                    Collect data without internet. When you're back online, automatically sync to your favorite tools.
                </p>
            </Box>

            {/* Infinite Scroll Container */}
            <div style={{ position: "relative", width: "100%", overflow: "hidden", "padding-bottom": "5rem" }}>
                {/* Fade Masks */}
                <div style={{ position: "absolute", inset: "0 auto 0 0", width: "128px", background: "linear-gradient(to right, var(--m3-color-background, #fef7ff), transparent)", "z-index": 20, "pointer-events": "none" }} />
                <div style={{ position: "absolute", inset: "0 0 0 auto", width: "128px", background: "linear-gradient(to left, var(--m3-color-background, #fef7ff), transparent)", "z-index": 20, "pointer-events": "none" }} />

                {/* Row 1: Left Scroll */}
                <div class="integrations-scroll-left" style={{ display: "flex", gap: "1.5rem", width: "max-content", "padding-left": "1.5rem", "margin-bottom": "2rem" }}>
                    <For each={row1}>
                        {(item) => (
                            <div style={{
                                position: "relative",
                                width: "256px",
                                height: "96px",
                                "border-radius": "16px",
                                background: "color-mix(in srgb, var(--m3-color-surface) 40%, transparent)",
                                "backdrop-filter": "blur(20px)",
                                "-webkit-backdrop-filter": "blur(20px)",
                                border: "1px solid rgba(255,255,255,0.4)",
                                "box-shadow": "0 10px 15px -3px rgba(0,0,0,0.1)",
                                display: "flex",
                                "align-items": "center",
                                gap: "1rem",
                                padding: "0 1.5rem",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                cursor: "pointer",
                            }}>
                                <div style={{ width: "48px", height: "48px", "border-radius": "12px", background: "rgba(255,255,255,0.8)", display: "flex", "align-items": "center", "justify-content": "center", padding: "8px", "box-shadow": "0 1px 2px rgba(0,0,0,0.05)", "flex-shrink": 0 }}>
                                    <img src={item.icon} alt={item.name} width="48" height="48" style={{ width: "100%", height: "100%", "object-fit": "contain" }} loading="lazy" decoding="async" />
                                </div>
                                <div>
                                    <div style={{ "font-weight": "700", color: "var(--m3-color-on-surface)", "font-size": "1.125rem" }}>{item.name}</div>
                                    <div style={{ "font-size": "0.75rem", "font-weight": "500", color: "var(--m3-color-on-surface-variant)", opacity: 0.7 }}>Sync target</div>
                                </div>
                            </div>
                        )}
                    </For>
                </div>

                {/* Row 2: Right Scroll (Slower) */}
                <div class="integrations-scroll-right" style={{ display: "flex", gap: "1.5rem", width: "max-content", "padding-left": "1.5rem" }}>
                    <For each={row2}>
                        {(item) => (
                            <div style={{
                                position: "relative",
                                width: "256px",
                                height: "96px",
                                "border-radius": "16px",
                                background: "color-mix(in srgb, var(--m3-color-surface-container) 30%, transparent)",
                                "backdrop-filter": "blur(20px)",
                                "-webkit-backdrop-filter": "blur(20px)",
                                border: "1px solid rgba(255,255,255,0.3)",
                                "box-shadow": "0 10px 15px -3px rgba(0,0,0,0.1)",
                                display: "flex",
                                "align-items": "center",
                                gap: "1rem",
                                padding: "0 1.5rem",
                                transition: "transform 0.3s ease, filter 0.3s ease",
                                cursor: "pointer",
                            }}>
                                <div style={{ width: "48px", height: "48px", "border-radius": "12px", background: "rgba(255,255,255,0.5)", display: "flex", "align-items": "center", "justify-content": "center", padding: "8px", "box-shadow": "0 1px 2px rgba(0,0,0,0.05)", "flex-shrink": 0, filter: "grayscale(100%)", transition: "filter 0.3s ease" }}>
                                    <img src={item.icon} alt={item.name} width="48" height="48" style={{ width: "100%", height: "100%", "object-fit": "contain" }} loading="lazy" decoding="async" />
                                </div>
                                <div>
                                    <div style={{ "font-weight": "700", color: "var(--m3-color-on-surface)", "font-size": "1.125rem" }}>{item.name}</div>
                                    <div style={{ "font-size": "0.75rem", "font-weight": "500", color: "var(--m3-color-on-surface-variant)", opacity: 0.7 }}>Auto-sync</div>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </div>

            <Box textAlign="center" style={{ position: "relative", "z-index": 10 }}>
                <Button
                    variant="filled"
                    size="lg"
                    style={{
                        "border-radius": "9999px",
                        "box-shadow": "0 20px 25px -5px color-mix(in srgb, var(--m3-color-primary) 20%, transparent)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                >
                    See All Integrations
                </Button>
            </Box>

            <style>{`
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - 1.5rem)); }
        }
        @keyframes scroll-right {
          from { transform: translateX(calc(-50% - 1.5rem)); }
          to { transform: translateX(0); }
        }
        @keyframes gradient-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes integrations-ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .integrations-scroll-left {
          animation: scroll-left 40s linear infinite;
        }
        .integrations-scroll-right {
          animation: scroll-right 45s linear infinite;
        }
        .integrations-gradient-text {
          background-size: 200% auto;
          animation: gradient-text 4s linear infinite;
        }
        .integrations-scroll-left:hover,
        .integrations-scroll-right:hover {
          animation-play-state: paused;
        }
      `}</style>
        </Box>
    );
}
