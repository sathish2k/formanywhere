/**
 * Testimonials Section — SolidJS
 * Authentic quotes focused on offline-first scenarios
 * Uses Box/Stack from @formanywhere/ui for layout
 */
import { For } from "solid-js";
import { Card } from "@formanywhere/ui/card";
import { Typography } from "@formanywhere/ui/typography";
import { Chip } from "@formanywhere/ui/chip";
import { Box } from "@formanywhere/ui/box";
import { Stack } from "@formanywhere/ui/stack";
import { testimonials } from "./config";

/** Rotate badge colors across primary, secondary, and tertiary */
const BADGE_COLORS = [
    { bg: 'color-mix(in srgb, var(--m3-color-primary) 10%, transparent)', text: 'var(--m3-color-primary-dark)' },
    { bg: 'color-mix(in srgb, var(--m3-color-tertiary) 10%, transparent)', text: 'var(--m3-color-tertiary-dark)' },
    { bg: 'color-mix(in srgb, var(--m3-color-secondary) 10%, transparent)', text: 'var(--m3-color-secondary)' },
];

export default function TestimonialsSection() {
    return (
        <Box as="section" style={{ padding: "5rem 0", background: "var(--m3-color-surface)" }} aria-labelledby="testimonials-heading">
            <Box maxWidth="7xl" marginX="auto" paddingX="md">
                {/* Header */}
                <Box textAlign="center" style={{ "margin-bottom": "4rem" }}>
                    <Chip
                        variant="label"
                        label="USE CASES"
                        style={{
                            "margin-bottom": "1rem",
                            background: "var(--m3-color-secondary-container)",
                            color: "var(--m3-color-on-secondary-container)",
                            border: "none",
                        }}
                    />
                    <Typography variant="headline-large" color="on-surface" align="center" as="h2" style={{ "margin-bottom": "1rem" }}>
                        Built for Real-World Conditions
                    </Typography>
                    <Typography variant="body-large" color="on-surface-variant" align="center">
                        Where reliable internet isn't guaranteed
                    </Typography>
                </Box>

                {/* Testimonials Grid */}
                <div style={{
                    display: "grid",
                    "grid-template-columns": "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "2rem",
                }}>
                    <For each={testimonials}>
                        {(testimonial, i) => (
                            <Card
                                variant="glass"
                                style={{ padding: "32px", transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
                            >
                                {/* Use Case Badge */}
                                <div style={{ "margin-bottom": "1.5rem" }}>
                                    <span style={{
                                        display: "inline-block",
                                        padding: "4px 12px",
                                        "border-radius": "9999px",
                                        background: BADGE_COLORS[i() % BADGE_COLORS.length].bg,
                                        color: BADGE_COLORS[i() % BADGE_COLORS.length].text,
                                        "font-size": "0.75rem",
                                        "font-weight": "700",
                                    }}>
                                        {testimonial.useCase}
                                    </span>
                                </div>

                                {/* Quote */}
                                <Typography variant="body-large" color="on-surface" style={{ "line-height": "1.6", "margin-bottom": "2rem" }}>
                                    "{testimonial.quote}"
                                </Typography>

                                {/* Author */}
                                <Stack direction="row" gap="sm" align="center">
                                    <div style={{
                                        width: "40px",
                                        height: "40px",
                                        "border-radius": "9999px",
                                        background: "var(--m3-color-surface-container-high)",
                                        display: "flex",
                                        "align-items": "center",
                                        "justify-content": "center",
                                        "flex-shrink": 0,
                                    }}>
                                        <svg style={{ width: "20px", height: "20px", color: "var(--m3-color-on-surface-variant)" }} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <Typography variant="title-small" color="on-surface" as="span">
                                            {testimonial.author}
                                        </Typography>
                                        <Typography variant="body-small" color="on-surface-variant">
                                            FormAnywhere User
                                        </Typography>
                                    </div>
                                </Stack>
                            </Card>
                        )}
                    </For>
                </div>
            </Box>
        </Box>
    );
}
