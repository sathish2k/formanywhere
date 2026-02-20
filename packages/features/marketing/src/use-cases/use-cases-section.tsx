/**
 * Use Cases Section — SolidJS
 * Clean Bento Grid with centered layout
 * Uses Box from @formanywhere/ui for layout
 */
import { Typography } from "@formanywhere/ui/typography";
import { Tag } from "@formanywhere/ui/tag";
import { Box } from "@formanywhere/ui/box";
import { UseCasesGrid } from "@formanywhere/shared/use-cases-grid";

export default function UseCasesSection() {
    return (
        <Box
            as="section"
            style={{ position: "relative", padding: "5rem 0", overflow: "hidden", background: "var(--m3-color-background, #fef7ff)" }}
            id="use-cases"
            aria-labelledby="use-cases-heading"
        >
            {/* Subtle Background Gradient */}
            <div style={{ "pointer-events": "none", position: "absolute", inset: 0 }} aria-hidden="true">
                <div style={{ position: "absolute", top: 0, left: "25%", width: "600px", height: "600px", background: "color-mix(in srgb, var(--m3-color-primary) 5%, transparent)", filter: "blur(120px)", "border-radius": "9999px" }} />
                <div style={{ position: "absolute", bottom: 0, right: "25%", width: "500px", height: "500px", background: "color-mix(in srgb, var(--m3-color-secondary) 5%, transparent)", filter: "blur(100px)", "border-radius": "9999px" }} />
            </div>

            <Box maxWidth="7xl" marginX="auto" paddingX="md" style={{ position: "relative", "z-index": 10 }}>
                {/* Header */}
                <Box textAlign="center" style={{ "max-width": "48rem", margin: "0 auto 3.5rem" }}>
                    <Tag label="USE CASES" tone="secondary" style={{ "margin-bottom": "1.25rem", "font-weight": "500", "letter-spacing": "0.05em" }} />

                    <Typography
                        variant="display-small"
                        color="on-surface"
                        as="h2"
                        style={{ "margin-bottom": "1.25rem", "font-weight": "700", "letter-spacing": "-0.01em" }}
                    >
                        Built for{" "}
                        <span style={{
                            color: "transparent",
                            "background-image": "linear-gradient(to right, var(--m3-color-primary), var(--m3-color-secondary))",
                            "-webkit-background-clip": "text",
                            "background-clip": "text",
                        }}>
                            real-world conditions
                        </span>
                    </Typography>

                    <Typography
                        variant="body-large"
                        style={{
                            color: "var(--m3-color-on-surface-variant)",
                            "line-height": "1.6",
                            "max-width": "42rem",
                            margin: "0 auto",
                        }}
                    >
                        From construction sites to healthcare clinics, FormAnywhere works wherever you need to collect data — online
                        or offline.
                    </Typography>
                </Box>

                {/* Bento Grid */}
                <UseCasesGrid />
            </Box>
        </Box>
    );
}
