/**
 * Auth Layout — wraps sign-in and sign-up pages
 * Provides a split-panel design: branding on left, form on right.
 *
 * Routes:  /signin  /signup
 */
import type { RouteSectionProps } from "@solidjs/router";

export default function AuthLayout(props: RouteSectionProps) {
    return (
        <>
            <style>{`
                .auth-branding { display: none; }
                .auth-mobile-logo { display: flex; }
                @media (min-width: 768px) {
                    .auth-branding { display: flex; }
                    .auth-mobile-logo { display: none; }
                }
            `}</style>
            <div style={{ "min-height": "100vh", display: "flex", background: "var(--m3-color-surface)" }}>
                {/* Left Side — Branding Panel */}
                <div class="auth-branding" style={{ flex: 1, "background-image": "linear-gradient(to bottom right, var(--m3-color-primary), var(--m3-color-primary-dark))", position: "relative", overflow: "hidden", "flex-direction": "column", "justify-content": "space-between", padding: "4rem" }}>
                    {/* Decorative circles */}
                    <div style={{ position: "absolute", top: "-6rem", right: "-6rem", width: "24rem", height: "24rem", "border-radius": "9999px", border: "1px solid rgba(255, 255, 255, 0.1)" }} />
                    <div style={{ position: "absolute", bottom: "-9rem", left: "-9rem", width: "500px", height: "500px", "border-radius": "9999px", border: "1px solid rgba(255, 255, 255, 0.1)" }} />

                    {/* Logo */}
                    <a href="/" style={{ position: "relative", "z-index": 10, display: "flex", "align-items": "center", gap: "0.75rem" }}>
                        <div style={{ width: "2.5rem", height: "2.5rem", "border-radius": "0.75rem", background: "rgba(255,255,255,0.2)", display: "flex", "align-items": "center", "justify-content": "center" }}>
                            <img src="/icons/sparkles.svg" alt="" style={{ width: "1.25rem", height: "1.25rem", filter: "invert(1)" }} aria-hidden="true" />
                        </div>
                        <span style={{ color: "white", "font-size": "1.125rem", "font-weight": 600 }}>FormAnywhere</span>
                    </a>

                    {/* Marketing Content */}
                    <div style={{ position: "relative", "z-index": 10, "max-width": "28rem" }}>
                        <h2 style={{ "font-size": "2.25rem", "font-weight": 700, color: "white", "margin-bottom": "1rem", "line-height": 1.2 }}>
                            Build powerful forms{" "}
                            <span style={{ color: "rgba(255,255,255,0.8)" }}>that work anywhere</span>
                        </h2>
                        <p style={{ "font-size": "1.125rem", color: "rgba(255,255,255,0.9)", "margin-bottom": "2.5rem", "line-height": 1.625 }}>
                            Join thousands of teams using FormAnywhere to create beautiful,
                            intelligent forms with drag-and-drop simplicity.
                        </p>
                        <div style={{ display: "flex", "flex-direction": "column", gap: "1.25rem" }}>
                            {[
                                "AI-powered form generation",
                                "100% offline-first architecture",
                                "Advanced conditional logic",
                                "Real-time analytics dashboard",
                            ].map((feature) => (
                                <div style={{ display: "flex", "align-items": "center", gap: "1rem" }}>
                                    <div style={{ width: "1.5rem", height: "1.5rem", "border-radius": "9999px", background: "rgba(255,255,255,0.2)", display: "flex", "align-items": "center", "justify-content": "center", "flex-shrink": 0 }}>
                                        <img src="/icons/check.svg" alt="" style={{ width: "0.875rem", height: "0.875rem", filter: "invert(1)" }} aria-hidden="true" />
                                    </div>
                                    <span style={{ color: "rgba(255,255,255,0.95)", "font-size": "1rem" }}>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{ position: "relative", "z-index": 10, display: "flex", gap: "4rem" }}>
                        <div>
                            <div style={{ "font-size": "2.25rem", "font-weight": 700, color: "white", "margin-bottom": "0.25rem" }}>10K+</div>
                            <div style={{ color: "rgba(255,255,255,0.8)", "font-size": "0.875rem" }}>Active Users</div>
                        </div>
                        <div>
                            <div style={{ "font-size": "2.25rem", "font-weight": 700, color: "white", "margin-bottom": "0.25rem" }}>500K+</div>
                            <div style={{ color: "rgba(255,255,255,0.8)", "font-size": "0.875rem" }}>Forms Created</div>
                        </div>
                        <div>
                            <div style={{ "font-size": "2.25rem", "font-weight": 700, color: "white", "margin-bottom": "0.25rem" }}>99.9%</div>
                            <div style={{ color: "rgba(255,255,255,0.8)", "font-size": "0.875rem" }}>Uptime</div>
                        </div>
                    </div>
                </div>

                {/* Right Side — Form Content (from child route) */}
                <div style={{ flex: 1, display: "flex", "align-items": "center", "justify-content": "center", padding: "1.5rem", background: "var(--m3-color-background)" }}>
                    <div style={{ width: "100%", "max-width": "480px" }}>
                        {/* Mobile Logo */}
                        <a href="/" class="auth-mobile-logo" style={{ "align-items": "center", gap: "0.75rem", "margin-bottom": "2rem" }}>
                            <div style={{ width: "2.5rem", height: "2.5rem", "border-radius": "0.75rem", "background-image": "linear-gradient(to bottom right, var(--m3-color-primary), var(--m3-color-primary-dark))", display: "flex", "align-items": "center", "justify-content": "center", "box-shadow": "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
                                <img src="/icons/sparkles.svg" alt="" style={{ width: "1.25rem", height: "1.25rem", filter: "invert(1)" }} aria-hidden="true" />
                            </div>
                            <span style={{ color: "var(--m3-color-on-surface)", "font-size": "1.125rem", "font-weight": 600 }}>
                                FormAnywhere
                            </span>
                        </a>

                        {/* Child route renders here (just the form content) */}
                        {props.children}
                    </div>
                </div>
            </div>
        </>
    );
}
