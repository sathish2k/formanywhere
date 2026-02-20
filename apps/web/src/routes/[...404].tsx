/**
 * 404 Catch-all — SolidStart route
 */
import PageLayout from "~/components/PageLayout";
import { Button } from "@formanywhere/ui/button";

export default function NotFoundPage() {
  return (
    <PageLayout title="Page Not Found | FormAnywhere">
      <main class="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
        {/* Background Elements */}
        <div class="absolute inset-0 not-found-grid opacity-[0.03] pointer-events-none" />
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px] opacity-20 not-found-pulse-slow" />
        <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary rounded-full blur-[120px] opacity-20 not-found-pulse-slow" style={{ "animation-delay": "1s" }} />

        <div class="relative z-10 text-center px-4 max-w-2xl mx-auto">
          {/* 404 Glitch Effect */}
          <div class="relative inline-block mb-8">
            <h1 class="text-[12rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary-dark select-none blur-sm opacity-50 absolute inset-0 transform translate-x-1 translate-y-1">
              404
            </h1>
            <h1 class="text-[12rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary-light to-secondary relative z-10 not-found-float">
              404
            </h1>
          </div>

          <h2 class="text-4xl md:text-5xl font-bold mb-6 text-on-surface tracking-tight">
            Lost in the Void?
          </h2>

          <p class="text-xl text-on-surface-variant mb-10 leading-relaxed max-w-lg mx-auto">
            The form you are looking for has dissolved into the digital ether. It might have been moved, deleted, or
            perhaps it never existed in this dimension.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              href="/"
              variant="filled"
              size="lg"
              class="min-w-[180px] shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
            >
              Return Home
            </Button>
            <Button href="/contact" variant="outlined" size="lg" class="min-w-[180px]">
              Contact Support
            </Button>
          </div>
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
      `}</style>
    </PageLayout>
  );
}
