/**
 * 404 Catch-all — SolidStart route
 * Faithful conversion of original Astro 404.astro (Tailwind → inline styles)
 * Uses @formanywhere/ui components (Button, Icon)
 */
import PageLayout from "~/components/PageLayout";
import { Button } from "@formanywhere/ui/button";
import { Icon } from "@formanywhere/ui/icon";

export default function NotFoundPage() {
  return (
    <PageLayout title="Page Not Found | FormAnywhere">
      <main style={{ "min-height": "100vh", display: "flex", "align-items": "center", "justify-content": "center", position: "relative", overflow: "hidden", background: "var(--m3-color-background)" }}>
        {/* Background Elements */}
        <div class="not-found-grid" style={{ position: "absolute", inset: 0, opacity: 0.03, "pointer-events": "none" }} />
        <div class="not-found-pulse-slow" style={{ position: "absolute", top: "-10%", left: "-10%", width: "40%", height: "40%", background: "var(--m3-color-primary)", "border-radius": "9999px", filter: "blur(120px)", opacity: 0.2 }} />
        <div class="not-found-pulse-slow" style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "40%", height: "40%", background: "var(--m3-color-secondary)", "border-radius": "9999px", filter: "blur(120px)", opacity: 0.2, "animation-delay": "1s" }} />

        <div style={{ position: "relative", "z-index": 10, "text-align": "center", "padding-left": "1rem", "padding-right": "1rem", "max-width": "42rem", "margin-left": "auto", "margin-right": "auto" }}>
          {/* 404 Glitch Effect */}
          <div style={{ position: "relative", display: "inline-block", "margin-bottom": "2rem" }}>
            <h1 style={{ "font-size": "12rem", "font-weight": 900, "line-height": 1, "letter-spacing": "-0.05em", color: "transparent", "background-clip": "text", "-webkit-background-clip": "text", "background-image": "linear-gradient(to bottom, var(--m3-color-primary), var(--m3-color-primary-dark))", "user-select": "none", filter: "blur(4px)", opacity: 0.5, position: "absolute", inset: 0, transform: "translate(4px, 4px)" }}>
              404
            </h1>
            <h1 class="not-found-float" style={{ "font-size": "12rem", "font-weight": 900, "line-height": 1, "letter-spacing": "-0.05em", color: "transparent", "background-clip": "text", "-webkit-background-clip": "text", "background-image": "linear-gradient(to bottom right, var(--m3-color-primary), var(--m3-color-primary-light), var(--m3-color-secondary))", position: "relative", "z-index": 10 }}>
              404
            </h1>
          </div>

          <h2 style={{ "font-size": "2.25rem", "font-weight": 700, "margin-bottom": "1.5rem", color: "var(--m3-color-on-surface)", "letter-spacing": "-0.025em" }}>
            Lost in the Void?
          </h2>

          <p style={{ "font-size": "1.25rem", color: "var(--m3-color-on-surface-variant)", "margin-bottom": "2.5rem", "line-height": 1.625, "max-width": "32rem", "margin-left": "auto", "margin-right": "auto" }}>
            The form you are looking for has dissolved into the digital ether. It might have been moved, deleted, or
            perhaps it never existed in this dimension.
          </p>

          <div class="not-found-buttons" style={{ display: "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", gap: "1rem" }}>
            <Button
              href="/"
              variant="filled"
              size="lg"
              style={{ "min-width": "180px", "box-shadow": "0 10px 15px -3px rgba(0,0,0,0.1)" }}
            >
              Return Home
            </Button>
            <Button href="/contact" variant="outlined" size="lg" style={{ "min-width": "180px" }}>
              Contact Support
            </Button>
          </div>
        </div>

        {/* Decorative Floating Elements (glass blur) */}
        <div class="not-found-float not-found-decor" style={{ position: "absolute", top: "25%", left: "25%", padding: "1rem", "border-radius": "1rem", background: "rgba(255, 255, 255, 0.05)", "backdrop-filter": "blur(12px)", "-webkit-backdrop-filter": "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.1)", transform: "rotate(-12deg)", "animation-delay": "0.1s" }}>
          <Icon name="file-text" size={48} color="rgba(var(--m3-color-on-surface-rgb, 28, 37, 46), 0.4)" />
        </div>
        <div class="not-found-float not-found-decor" style={{ position: "absolute", bottom: "25%", right: "25%", padding: "1.5rem", "border-radius": "9999px", background: "rgba(255, 255, 255, 0.05)", "backdrop-filter": "blur(12px)", "-webkit-backdrop-filter": "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.1)", transform: "rotate(12deg)", "animation-delay": "0.3s" }}>
          <Icon name="search" size={40} color="rgba(var(--m3-color-on-surface-rgb, 28, 37, 46), 0.4)" />
        </div>
      </main>

      <style>{`
        .not-found-grid {
          background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
          background-size: 40px 40px;
        }
        @keyframes not-found-float-kf {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .not-found-float {
          animation: not-found-float-kf 6s ease-in-out infinite;
        }
        @keyframes not-found-pulse-kf {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.1); }
        }
        .not-found-pulse-slow {
          animation: not-found-pulse-kf 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .not-found-decor {
          display: none;
        }
        @media (min-width: 768px) {
          .not-found-decor { display: block; }
          .not-found-buttons { flex-direction: row !important; }
        }
      `}</style>
    </PageLayout>
  );
}
