/**
 * Templates CTA Section — lazy-loaded below fold.
 * "Can't find what you need?" call-to-action.
 */
import { Typography } from "@formanywhere/ui/typography";
import { Button } from "@formanywhere/ui/button";

export default function TemplatesCTASection() {
  return (
    <section
      style={{
        padding: "6rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0",
          background: "var(--m3-color-surface)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          "max-width": "80rem",
          height: "100%",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "600px",
            background:
              "color-mix(in srgb, var(--m3-color-primary) 20%, transparent)",
            "border-radius": "9999px",
            filter: "blur(120px)",
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "33%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            height: "500px",
            background:
              "color-mix(in srgb, var(--m3-color-tertiary) 20%, transparent)",
            "border-radius": "9999px",
            filter: "blur(100px)",
            opacity: 0.4,
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          "z-index": 10,
          "max-width": "72rem",
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            "border-radius": "2.5rem",
            padding: "3rem",
            "text-align": "center",
            border:
              "1px solid var(--glass-border-medium, rgba(255, 255, 255, 0.4))",
            "box-shadow": "var(--m3-elevation-3)",
            "backdrop-filter": "blur(24px)",
            background:
              "var(--glass-tint-subtle, rgba(255, 255, 255, 0.1))",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, var(--glass-tint-subtle, rgba(255, 255, 255, 0.2)), transparent)",
              "pointer-events": "none",
            }}
          />
          <div
            style={{
              position: "relative",
              "z-index": 10,
              "max-width": "48rem",
              margin: "0 auto",
            }}
          >
            <Typography
              variant="display-small"
              as="h2"
              align="center"
              style={{
                margin: "0 0 1.5rem 0",
                "font-weight": "700",
                color: "var(--m3-color-on-surface)",
              }}
            >
              Can't find what you need?
            </Typography>
            <Typography
              variant="body-large"
              align="center"
              style={{
                margin: "0 auto 2.5rem auto",
                "max-width": "36rem",
                "font-size": "1.125rem",
                color: "var(--m3-color-on-surface-variant)",
              }}
            >
              Create your own custom form from scratch with our powerful form
              builder. No coding required.
            </Typography>
            <Button
              href="/form-builder/new"
              variant="filled"
              style={{
                padding: "16px 40px",
                "border-radius": "100px",
                "font-size": "1.1rem",
                "font-weight": "600",
                background: "var(--m3-color-primary)",
                color: "var(--m3-color-on-primary)",
              }}
            >
              Create Custom Form
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
