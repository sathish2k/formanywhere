/**
 * Demo Teaser Section — SolidJS
 * Video preview section with Card and Chip components
 * Uses Box/Stack from @formanywhere/ui for layout
 */
import { Card } from "@formanywhere/ui/card";
import { Chip } from "@formanywhere/ui/chip";
import { Typography } from "@formanywhere/ui/typography";
import { Box } from "@formanywhere/ui/box";
import { Stack } from "@formanywhere/ui/stack";

export default function DemoTeaser() {
    return (
        <Box as="section" style={{ padding: "4rem 0", background: "var(--m3-color-background, #fef7ff)" }} aria-labelledby="demo-heading">
            <Box maxWidth="7xl" marginX="auto" paddingX="md">
                <Card variant="glass" padding="xl" gap="lg" align="center" justify="between"
                    style={{ display: "flex", "flex-direction": "row", "flex-wrap": "wrap", gap: "2rem" }}>
                    {/* Left Content */}
                    <Stack direction="column" gap="md" style={{ flex: 1, "min-width": "280px" }}>
                        <Stack direction="row" gap="xs" align="center">
                            <svg style={{ width: "16px", height: "16px", color: "var(--m3-color-primary)" }} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path fill-rule="evenodd" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <Chip
                                variant="label"
                                label="WATCH DEMO"
                                style={{ background: "var(--m3-color-secondary-container)", color: "var(--m3-color-on-secondary-container)", border: "none" }}
                            />
                        </Stack>
                        <Typography variant="headline-large" color="on-surface" align="left" as="h2">
                            See FormAnywhere in Action
                        </Typography>
                        <Typography variant="body-large" color="on-surface-variant" align="left" style={{ "max-width": "36rem" }}>
                            Watch how you can build a complete multi-step form with AI assistance in under 60 seconds
                        </Typography>
                        <Stack direction="row" gap="xl" wrap>
                            <Stack direction="row" gap="xs" align="center">
                                <svg style={{ width: "20px", height: "20px", color: "var(--m3-color-secondary)" }} fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span style={{ "font-size": "0.875rem", "font-weight": "500", color: "var(--m3-color-on-surface-variant)" }}>No signup required</span>
                            </Stack>
                            <Stack direction="row" gap="xs" align="center">
                                <svg style={{ width: "20px", height: "20px", color: "var(--m3-color-tertiary)" }} fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span style={{ "font-size": "0.875rem", "font-weight": "500", color: "var(--m3-color-on-surface-variant)" }}>60 seconds</span>
                            </Stack>
                        </Stack>
                    </Stack>

                    {/* Right Demo Preview */}
                    <Card variant="glass-subtle" style={{ position: "relative", width: "400px", "max-width": "100%", height: "240px" }}>
                        <div style={{
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(135deg, color-mix(in srgb, var(--m3-color-primary) 5%, transparent), color-mix(in srgb, var(--m3-color-primary) 10%, transparent))",
                            display: "flex",
                            "align-items": "center",
                            "justify-content": "center",
                            position: "relative",
                        }}>
                            <div style={{
                                position: "absolute",
                                inset: "16px",
                                background: "color-mix(in srgb, var(--m3-color-surface) 80%, transparent)",
                                "border-radius": "12px",
                                padding: "16px",
                                opacity: 0.5,
                            }}>
                                <Stack direction="column" gap="sm">
                                    <div style={{ height: "8px", background: "var(--m3-color-surface-container-high)", "border-radius": "4px", width: "60%" }} />
                                    <div style={{ height: "24px", background: "var(--m3-color-surface-container-low)", "border-radius": "4px", border: "1px solid var(--m3-color-outline-variant)" }} />
                                    <div style={{ height: "8px", background: "var(--m3-color-surface-container-high)", "border-radius": "4px", width: "50%" }} />
                                    <div style={{ height: "24px", background: "var(--m3-color-surface-container-low)", "border-radius": "4px", border: "1px solid var(--m3-color-outline-variant)" }} />
                                    <div style={{ height: "8px", background: "var(--m3-color-surface-container-high)", "border-radius": "4px", width: "67%" }} />
                                    <div style={{ height: "24px", background: "var(--m3-color-surface-container-low)", "border-radius": "4px", border: "1px solid var(--m3-color-outline-variant)" }} />
                                </Stack>
                            </div>
                            <div style={{
                                position: "relative",
                                "z-index": 10,
                                width: "64px",
                                height: "64px",
                                "border-radius": "9999px",
                                display: "flex",
                                "align-items": "center",
                                "justify-content": "center",
                                "box-shadow": "0 20px 25px -5px rgba(0,0,0,0.1)",
                                background: "rgba(255, 255, 255, 0.7)",
                                "backdrop-filter": "blur(40px)",
                                border: "1px solid rgba(255, 255, 255, 0.6)",
                                transition: "transform 0.3s ease",
                            }}>
                                <svg style={{ width: "32px", height: "32px", color: "var(--m3-color-primary)" }} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </div>
                        </div>
                        <div style={{
                            position: "absolute",
                            bottom: "12px",
                            right: "12px",
                            background: "rgba(0,0,0,0.8)",
                            color: "var(--m3-color-inverse-on-surface, #fff)",
                            padding: "4px 12px",
                            "border-radius": "9999px",
                            "font-size": "0.75rem",
                            "font-weight": "700",
                            "backdrop-filter": "blur(8px)",
                        }}>
                            0:60
                        </div>
                    </Card>
                </Card>
            </Box>
        </Box>
    );
}
