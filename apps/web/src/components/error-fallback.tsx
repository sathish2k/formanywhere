/**
 * 500 Error Fallback — used by ErrorBoundary in app.tsx
 * Design inspired by the 404 page ([...404].tsx)
 */

export function AppErrorFallback(err: Error, reset: () => void) {
  return (
    <div style={{ "min-height": "100vh", display: "flex", "align-items": "center", "justify-content": "center", position: "relative", overflow: "hidden", background: "var(--m3-color-background, #fff)" }}>
      {/* Background Elements */}
      <div class="error-grid" style={{ position: "absolute", inset: "0", opacity: "0.03", "pointer-events": "none" }} />
      <div class="error-pulse-slow" style={{ position: "absolute", top: "-10%", left: "-10%", width: "40%", height: "40%", background: "var(--m3-color-error, #BA1A1A)", "border-radius": "9999px", filter: "blur(120px)", opacity: "0.2" }} />
      <div class="error-pulse-slow" style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "40%", height: "40%", background: "var(--m3-color-tertiary, #006A6A)", "border-radius": "9999px", filter: "blur(120px)", opacity: "0.2", "animation-delay": "1s" }} />

      <div style={{ position: "relative", "z-index": "10", "text-align": "center", "padding-left": "1rem", "padding-right": "1rem", "max-width": "42rem", "margin-left": "auto", "margin-right": "auto" }}>
        {/* 500 Glitch Effect */}
        <div style={{ position: "relative", display: "inline-block", "margin-bottom": "2rem" }}>
          <h1 style={{ "font-size": "12rem", "font-weight": "900", "line-height": "1", "letter-spacing": "-0.05em", color: "transparent", "background-clip": "text", "-webkit-background-clip": "text", "background-image": "linear-gradient(to bottom, var(--m3-color-error, #BA1A1A), var(--m3-color-error, #BA1A1A))", "user-select": "none", filter: "blur(4px)", opacity: "0.5", position: "absolute", inset: "0", transform: "translate(4px, 4px)" }}>
            500
          </h1>
          <h1 class="error-float" style={{ "font-size": "12rem", "font-weight": "900", "line-height": "1", "letter-spacing": "-0.05em", color: "transparent", "background-clip": "text", "-webkit-background-clip": "text", "background-image": "linear-gradient(to bottom right, var(--m3-color-error, #BA1A1A), var(--m3-color-tertiary, #006A6A), var(--m3-color-secondary, #5B5F71))", position: "relative", "z-index": "10" }}>
            500
          </h1>
        </div>

        <h2 style={{ "font-size": "2.25rem", "font-weight": "700", "margin-bottom": "1.5rem", color: "var(--m3-color-on-surface, #1C252E)", "letter-spacing": "-0.025em" }}>
          Something Went Wrong
        </h2>

        <p style={{ "font-size": "1.25rem", color: "var(--m3-color-on-surface-variant, #49454F)", "margin-bottom": "2.5rem", "line-height": "1.625", "max-width": "32rem", "margin-left": "auto", "margin-right": "auto" }}>
          {err.message || "An unexpected error occurred. Our servers hit a snag, but don't worry — it's probably temporary."}
        </p>

        <div class="error-buttons" style={{ display: "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", gap: "1rem" }}>
          <button
            onClick={reset}
            style={{
              "min-width": "180px",
              padding: "14px 32px",
              "border-radius": "100px",
              border: "none",
              background: "var(--m3-color-primary, #006A6A)",
              color: "var(--m3-color-on-primary, #fff)",
              "font-weight": "600",
              cursor: "pointer",
              "font-size": "0.9375rem",
              "box-shadow": "0 10px 15px -3px rgba(0,0,0,0.1)",
            }}
          >
            Try Again
          </button>
          <a
            href="/"
            style={{
              "min-width": "180px",
              padding: "14px 32px",
              "border-radius": "100px",
              border: "1px solid var(--m3-color-outline, #79747E)",
              background: "transparent",
              color: "var(--m3-color-on-surface, #1C252E)",
              "font-weight": "600",
              "text-decoration": "none",
              "font-size": "0.9375rem",
              display: "inline-flex",
              "align-items": "center",
              "justify-content": "center",
            }}
          >
            Return Home
          </a>
        </div>
      </div>

      {/* Decorative Floating Elements */}
      <div class="error-float error-decor" style={{ position: "absolute", top: "25%", left: "25%", padding: "1rem", "border-radius": "1rem", background: "rgba(255, 255, 255, 0.05)", "backdrop-filter": "blur(12px)", "-webkit-backdrop-filter": "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.1)", transform: "rotate(-12deg)", "animation-delay": "0.1s" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(28,37,46,0.4)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <div class="error-float error-decor" style={{ position: "absolute", bottom: "25%", right: "25%", padding: "1.5rem", "border-radius": "9999px", background: "rgba(255, 255, 255, 0.05)", "backdrop-filter": "blur(12px)", "-webkit-backdrop-filter": "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.1)", transform: "rotate(12deg)", "animation-delay": "0.3s" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(28,37,46,0.4)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>

      <style>{`
        .error-grid {
          background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
          background-size: 40px 40px;
        }
        @keyframes error-float-kf {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .error-float {
          animation: error-float-kf 6s ease-in-out infinite;
        }
        @keyframes error-pulse-kf {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.1); }
        }
        .error-pulse-slow {
          animation: error-pulse-kf 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .error-decor {
          display: none;
        }
        @media (min-width: 768px) {
          .error-decor { display: block; }
          .error-buttons { flex-direction: row !important; }
        }
      `}</style>
    </div>
  );
}
