/**
 * Hero Section — SolidJS
 * Title, subtitle, CTAs with Typography and Button components
 * Uses Box/Stack from @formanywhere/ui for layout
 */
import { Button } from "@formanywhere/ui/button";
import { Typography } from "@formanywhere/ui/typography";
import { Chip } from "@formanywhere/ui/chip";
import { Card } from "@formanywhere/ui/card";
import { Box } from "@formanywhere/ui/box";
import { Stack } from "@formanywhere/ui/stack";

export default function HeroSection() {
    return (
        <Box as="section" style={{ position: "relative", padding: "5rem 0", overflow: "hidden" }} aria-labelledby="hero-heading">
            {/* Glass tinted background */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, var(--m3-color-surface, #fef7ff), var(--m3-color-surface-dim, #ded8e1), var(--m3-color-primary-container, #eaddff))" }} />

            <Box maxWidth="7xl" marginX="auto" paddingX="md" style={{ position: "relative" }}>
                <div style={{ display: "grid", "grid-template-columns": "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem", "align-items": "center" }}>
                    {/* Content */}
                    <Stack direction="column" gap="md">
                        <Chip variant="label" label="AI-POWERED AUTOMATION" style={{ "margin-bottom": "0.5rem", width: "fit-content" }} />

                        <Typography
                            variant="display-large"
                            as="h1"
                            color="on-surface"
                            style={{ "line-height": "1.1", "margin-bottom": "0.5rem" }}
                        >
                            Build AI-Powered Forms{" "}
                            <span style={{ "font-weight": "700", background: "linear-gradient(90deg, var(--m3-color-primary), var(--m3-color-secondary, #625b71))", "-webkit-background-clip": "text", "background-clip": "text", color: "transparent" }}>
                                That Work Offline
                            </span>
                        </Typography>

                        <Typography variant="body-large" color="on-surface-variant" style={{ "line-height": "1.7", "margin-bottom": "1rem" }}>
                            The offline-first form builder for Web and Desktop. Generate forms, rules, and workflows instantly with AI. Deploy anywhere, collect data securely without internet.
                        </Typography>

                        <Stack direction="row" gap="md" wrap>
                            <Button
                                href="/signup"
                                variant="filled"
                                size="lg"
                                style={{
                                    background: "linear-gradient(135deg, var(--m3-color-primary), var(--m3-color-secondary))",
                                    "font-weight": "600",
                                }}
                            >
                                Get started for free
                            </Button>
                            <Button href="#demo" variant="outlined" size="lg">
                                <svg style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Watch a demo
                            </Button>
                        </Stack>
                    </Stack>

                    {/* Form Preview Card */}
                    <Card variant="glass-strong" style={{ padding: "32px", "border-radius": "24px" }}>
                        <Box rounded="lg" padding="lg" style={{ background: "var(--glass-tint-subtle, rgba(255,255,255,0.3))", "backdrop-filter": "blur(12px)", "margin-bottom": "1rem" }}>
                            <Stack direction="row" gap="xs" style={{ "margin-bottom": "1.5rem" }}>
                                <div style={{ width: "12px", height: "12px", "border-radius": "9999px", background: "var(--m3-color-error, #b3261e)" }} />
                                <div style={{ width: "12px", height: "12px", "border-radius": "9999px", background: "var(--m3-color-tertiary, #7d5260)" }} />
                                <div style={{ width: "12px", height: "12px", "border-radius": "9999px", background: "var(--m3-color-secondary, #625b71)" }} />
                            </Stack>
                            <Stack direction="column" gap="md">
                                <Box padding="md" rounded="md" style={{ border: "1px dashed var(--m3-color-primary, #6750a4)" }}>
                                    <label style={{ "font-size": "0.875rem", color: "var(--m3-color-on-surface-variant)", "margin-bottom": "0.5rem", display: "block" }}>Full Name *</label>
                                    <div style={{ height: "40px", background: "var(--m3-color-surface-container, #ded8e1)", "border-radius": "4px", border: "1px solid var(--m3-color-outline, #79747e)" }} />
                                </Box>
                                <Box padding="md" rounded="md" style={{ background: "var(--glass-tint-subtle, rgba(255,255,255,0.3))", "backdrop-filter": "blur(12px)", border: "1px solid var(--m3-color-outline, #79747e)" }}>
                                    <label style={{ "font-size": "0.875rem", color: "var(--m3-color-on-surface-variant)", "margin-bottom": "0.5rem", display: "block" }}>Email Address *</label>
                                    <div style={{ height: "40px", background: "var(--m3-color-surface-container, #ded8e1)", "border-radius": "4px", border: "1px solid var(--m3-color-outline, #79747e)" }} />
                                </Box>
                                <Box padding="md" rounded="md" style={{ background: "var(--glass-tint-subtle, rgba(255,255,255,0.3))", "backdrop-filter": "blur(12px)", border: "1px solid var(--m3-color-outline, #79747e)" }}>
                                    <label style={{ "font-size": "0.875rem", color: "var(--m3-color-on-surface-variant)", "margin-bottom": "0.5rem", display: "block" }}>Phone Number</label>
                                    <div style={{ height: "40px", background: "var(--m3-color-surface-container, #ded8e1)", "border-radius": "4px", border: "1px solid var(--m3-color-outline, #79747e)" }} />
                                </Box>
                            </Stack>
                        </Box>
                        <Stack direction="row" gap="xs" justify="center" wrap>
                            <Chip variant="label" label="Drag & Drop" style={{ background: "var(--m3-color-primary-container)", color: "var(--m3-color-on-primary-container)" }} />
                            <Chip variant="label" label="AI Powered" style={{ background: "var(--m3-color-secondary-container)", color: "var(--m3-color-on-secondary-container)" }} />
                            <Chip variant="label" label="Multi-Step" style={{ background: "var(--m3-color-tertiary-container)", color: "var(--m3-color-on-tertiary-container)" }} />
                        </Stack>
                    </Card>
                </div>
            </Box>
        </Box>
    );
}
