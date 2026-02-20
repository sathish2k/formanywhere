/**
 * Features Section — SolidJS
 * M3 Liquid Glass + Performance-first layout
 * Uses Box/Stack from @formanywhere/ui for layout
 */
import { For } from "solid-js";
import { Typography } from "@formanywhere/ui/typography";
import { Card } from "@formanywhere/ui/card";
import { Tag } from "@formanywhere/ui/tag";
import { Box } from "@formanywhere/ui/box";
import { Stack } from "@formanywhere/ui/stack";
import { FeatureTabs } from "@formanywhere/shared/feature-tabs";
import { secondaryFeatures, iconPaths } from "./config";

export default function FeaturesSection() {
    return (
        <Box
            as="section"
            style={{
                position: "relative",
                overflow: "hidden",
                padding: "5rem 0",
                background: "var(--m3-color-background, #fef7ff)",
            }}
            id="features"
            aria-labelledby="features-heading"
            aria-describedby="features-summary"
        >
            {/* Background Decor */}
            <div style={{ "pointer-events": "none", position: "absolute", inset: 0 }} aria-hidden="true">
                <div style={{ position: "absolute", top: "-160px", right: "-120px", width: "520px", height: "520px", background: "color-mix(in srgb, var(--m3-color-secondary) 10%, transparent)", "border-radius": "9999px", filter: "blur(140px)" }} />
                <div style={{ position: "absolute", bottom: "-160px", left: "-140px", width: "620px", height: "620px", background: "color-mix(in srgb, var(--m3-color-tertiary) 10%, transparent)", "border-radius": "9999px", filter: "blur(160px)" }} />
            </div>

            <Box maxWidth="7xl" marginX="auto" paddingX="md" style={{ position: "relative", "z-index": 10 }}>
                {/* Header */}
                <Box textAlign="center" style={{ "margin-bottom": "4rem" }}>
                    <Tag label="POWERFUL CAPABILITIES" tone="secondary">
                        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "16px", height: "16px" }} aria-hidden="true">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    </Tag>
                    <Typography
                        variant="display-medium"
                        color="on-surface"
                        align="center"
                        as="h2"
                        style={{ "margin-top": "1.5rem", "margin-bottom": "1.25rem", "max-width": "48rem", margin: "1.5rem auto 1.25rem" }}
                    >
                        Everything You Need to Build{" "}
                        <span style={{ background: "linear-gradient(90deg, var(--m3-color-secondary, #625b71), var(--m3-color-tertiary, #7d5260))", "-webkit-background-clip": "text", "background-clip": "text", "-webkit-text-fill-color": "transparent", color: "transparent" }}>
                            Complex Forms
                        </span>
                    </Typography>

                    <Typography
                        variant="body-large"
                        color="on-surface-variant"
                        align="center"
                        style={{ "max-width": "42rem", margin: "0 auto", opacity: 0.8 }}
                    >
                        From simple surveys to complex enterprise workflows, FormAnywhere scales with your needs.
                    </Typography>
                </Box>

                {/* Main Interactive Tabs */}
                <Box style={{ "margin-bottom": "5rem" }}>
                    <FeatureTabs />
                </Box>

                {/* Secondary Features Grid */}
                <ul
                    role="list"
                    style={{
                        display: "grid",
                        "grid-template-columns": "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "1.5rem",
                        "list-style": "none",
                        padding: 0,
                        margin: 0,
                    }}
                >
                    <For each={[...secondaryFeatures]}>
                        {(feat) => (
                            <li>
                                <Card
                                    variant="glass-subtle"
                                    direction="column"
                                    padding="xl"
                                    gap="md"
                                    align="start"
                                    style={{ height: "100%", transition: "transform 0.3s ease" }}
                                >
                                    <Stack direction="row" gap="md" align="center">
                                        <div style={{
                                            width: "48px", height: "48px", "border-radius": "16px",
                                            background: "var(--m3-color-secondary-container)",
                                            color: "var(--m3-color-on-secondary-container)",
                                            display: "flex", "align-items": "center", "justify-content": "center",
                                        }}>
                                            <svg
                                                style={{ width: "24px", height: "24px" }}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                aria-hidden="true"
                                            >
                                                <path stroke-linecap="round" stroke-linejoin="round" d={iconPaths[feat.icon]} />
                                            </svg>
                                        </div>
                                        <Typography variant="title-large" color="on-surface" as="h3">
                                            {feat.title}
                                        </Typography>
                                    </Stack>

                                    <Typography variant="body-medium" color="on-surface-variant" style={{ "line-height": "1.7", opacity: 0.9 }}>
                                        {feat.desc}
                                    </Typography>
                                </Card>
                            </li>
                        )}
                    </For>
                </ul>
            </Box>
        </Box>
    );
}
