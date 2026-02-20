/**
 * How It Works Section — SolidJS
 * 3-step process with highlighted middle card
 * Uses Box/Stack from @formanywhere/ui for layout
 */
import { For } from "solid-js";
import { Card } from "@formanywhere/ui/card";
import { Typography } from "@formanywhere/ui/typography";
import { Chip } from "@formanywhere/ui/chip";
import { Box } from "@formanywhere/ui/box";
import { Stack } from "@formanywhere/ui/stack";
import { steps } from "./config";

const stepIcons = [
    // palette
    <svg style={{ width: "24px", height: "24px" }} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>,
    // settings
    <svg style={{ width: "24px", height: "24px" }} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    // rocket
    <svg style={{ width: "24px", height: "24px" }} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>,
];

export default function HowItWorksSection() {
    return (
        <Box as="section" style={{ padding: "5rem 0", background: "var(--m3-color-surface-variant, #e7e0ec)" }} aria-labelledby="howitworks-heading">
            <Box maxWidth="7xl" marginX="auto" paddingX="md">
                {/* Header */}
                <Box textAlign="center" style={{ "margin-bottom": "4rem" }}>
                    <Chip
                        variant="label"
                        label="HOW IT WORKS"
                        style={{
                            "margin-bottom": "1rem",
                            background: "var(--m3-color-secondary-container)",
                            color: "var(--m3-color-on-secondary-container)",
                            border: "none",
                        }}
                    />
                    <Typography variant="headline-large" color="on-surface" align="center" as="h2" style={{ "margin-bottom": "1rem" }}>
                        Get Started in 3 Simple Steps
                    </Typography>
                    <Typography variant="body-large" color="on-surface-variant" align="center">
                        From idea to deployed form in minutes
                    </Typography>
                </Box>

                {/* Steps Grid */}
                <div style={{
                    display: "grid",
                    "grid-template-columns": "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "2rem",
                }}>
                    <For each={steps}>
                        {(step, i) => (
                            <Card
                                variant={step.highlighted ? "elevated" : "glass"}
                                style={{
                                    padding: "40px",
                                    transition: "transform 0.3s ease",
                                    ...(step.highlighted
                                        ? {
                                            background: "linear-gradient(135deg, var(--m3-color-secondary) 0%, color-mix(in srgb, var(--m3-color-secondary-dark) 90%, black) 100%)",
                                            "box-shadow": "0 20px 60px color-mix(in srgb, var(--m3-color-secondary) 40%, transparent)",
                                        }
                                        : {}),
                                }}
                            >
                                <div style={{
                                    "font-size": "3.75rem",
                                    "font-weight": "900",
                                    "margin-bottom": "1rem",
                                    color: step.highlighted ? "color-mix(in srgb, var(--m3-color-on-secondary) 40%, transparent)" : "var(--m3-color-outline)",
                                }}>
                                    {step.number}
                                </div>

                                <div style={{
                                    width: "48px",
                                    height: "48px",
                                    "border-radius": "12px",
                                    display: "flex",
                                    "align-items": "center",
                                    "justify-content": "center",
                                    "margin-bottom": "1.5rem",
                                    transition: "background 0.3s ease",
                                    background: step.highlighted
                                        ? "rgba(255,255,255,0.2)"
                                        : i() === 0
                                            ? "color-mix(in srgb, var(--m3-color-primary) 10%, transparent)"
                                            : "color-mix(in srgb, var(--m3-color-tertiary) 10%, transparent)",
                                    color: step.highlighted
                                        ? "var(--m3-color-on-secondary)"
                                        : i() === 0
                                            ? "var(--m3-color-primary)"
                                            : "var(--m3-color-tertiary)",
                                }}>
                                    {stepIcons[i()]}
                                </div>

                                <Typography
                                    variant="title-large"
                                    align="left"
                                    as="h3"
                                    style={{
                                        "margin-bottom": "1rem",
                                        color: step.highlighted ? "var(--m3-color-on-secondary)" : "var(--m3-color-on-surface)",
                                    }}
                                >
                                    {step.title}
                                </Typography>

                                <Typography
                                    variant="body-medium"
                                    align="left"
                                    style={{
                                        "margin-bottom": "1.5rem",
                                        color: step.highlighted ? "var(--m3-color-on-secondary)" : "var(--m3-color-on-surface-variant)",
                                        "line-height": "1.6",
                                    }}
                                >
                                    {step.description}
                                </Typography>

                                <Stack direction="column" gap="sm">
                                    <For each={step.items}>
                                        {(item) => (
                                            <Stack direction="row" gap="xs" align="center">
                                                <svg
                                                    style={{
                                                        width: "20px",
                                                        height: "20px",
                                                        "flex-shrink": 0,
                                                        color: step.highlighted ? "#fff" : "var(--m3-color-tertiary)",
                                                    }}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    stroke-width="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <Typography
                                                    variant="body-medium"
                                                    style={{
                                                        color: step.highlighted ? "var(--m3-color-on-secondary)" : "var(--m3-color-on-surface-variant)",
                                                        "font-weight": "500",
                                                    }}
                                                >
                                                    {item}
                                                </Typography>
                                            </Stack>
                                        )}
                                    </For>
                                </Stack>
                            </Card>
                        )}
                    </For>
                </div>
            </Box>
        </Box>
    );
}
