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
            <div class="min-h-screen flex bg-surface">
                {/* Left Side — Branding Panel (hidden on mobile) */}
                <div class="hidden md:flex flex-1 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden flex-col justify-between p-16">
                    {/* Decorative circles */}
                    <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-white/10" />
                    <div class="absolute -bottom-36 -left-36 w-[500px] h-[500px] rounded-full border border-white/10" />

                    {/* Logo */}
                    <a href="/" class="relative z-10 flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <img
                                src="/icons/sparkles.svg"
                                alt=""
                                class="w-5 h-5 invert"
                                aria-hidden="true"
                            />
                        </div>
                        <span class="text-white text-lg font-semibold">FormAnywhere</span>
                    </a>

                    {/* Marketing Content */}
                    <div class="relative z-10 max-w-md">
                        <h2 class="text-4xl font-bold text-white mb-4 leading-tight">
                            Build powerful forms{" "}
                            <span class="text-white/80">that work anywhere</span>
                        </h2>
                        <p class="text-lg text-white/90 mb-10 leading-relaxed">
                            Join thousands of teams using FormAnywhere to create beautiful,
                            intelligent forms with drag-and-drop simplicity.
                        </p>
                        <div class="flex flex-col gap-5">
                            {[
                                "AI-powered form generation",
                                "100% offline-first architecture",
                                "Advanced conditional logic",
                                "Real-time analytics dashboard",
                            ].map((feature) => (
                                <div class="flex items-center gap-4">
                                    <div class="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                        <img
                                            src="/icons/check.svg"
                                            alt=""
                                            class="w-3.5 h-3.5 invert"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <span class="text-white/95 text-base">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div class="relative z-10 flex gap-16">
                        <div>
                            <div class="text-4xl font-bold text-white mb-1">10K+</div>
                            <div class="text-white/80 text-sm">Active Users</div>
                        </div>
                        <div>
                            <div class="text-4xl font-bold text-white mb-1">500K+</div>
                            <div class="text-white/80 text-sm">Forms Created</div>
                        </div>
                        <div>
                            <div class="text-4xl font-bold text-white mb-1">99.9%</div>
                            <div class="text-white/80 text-sm">Uptime</div>
                        </div>
                    </div>
                </div>

                {/* Right Side — Form Content (from child route) */}
                <div class="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background-default">
                    <div class="w-full max-w-[480px]">
                        {/* Mobile Logo (hidden on desktop) */}
                        <a href="/" class="md:hidden flex items-center gap-3 mb-8">
                            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
                                <img
                                    src="/icons/sparkles.svg"
                                    alt=""
                                    class="w-5 h-5 invert"
                                    aria-hidden="true"
                                />
                            </div>
                            <span class="text-on-surface text-lg font-semibold">
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
