/**
 * Navigation Utility
 *
 * Uses Astro ViewTransitions' `navigate()` for smooth SPA-like
 * client-side navigation when available, falls back to
 * `window.location.href` in non-Astro environments (e.g. Tauri desktop).
 */

type AstroNavigate = (href: string, options?: { history?: 'auto' | 'push' | 'replace' }) => void;

/** Cached reference to Astro's navigate function */
let _astroNavigate: AstroNavigate | null = null;
let _resolved = false;

/**
 * Try to resolve Astro's navigate from the ViewTransitions client module.
 * This is a virtual module injected by Astro at build time — it won't exist
 * in non-Astro contexts (Tauri, plain Vite, tests).
 */
async function resolveAstroNavigate(): Promise<AstroNavigate | null> {
    if (_resolved) return _astroNavigate;

    try {
        // Dynamic import — the module ID is constructed to avoid static analysis
        // by TypeScript (which doesn't know about Astro virtual modules).
        const moduleId = 'astro:transitions/client';
        const mod: Record<string, unknown> = await import(/* @vite-ignore */ moduleId);
        _astroNavigate = mod.navigate as AstroNavigate;
    } catch {
        _astroNavigate = null;
    }

    _resolved = true;
    return _astroNavigate;
}

/**
 * Navigate to a path using Astro ViewTransitions when available,
 * otherwise falls back to a full-page navigation.
 */
export async function navigateTo(
    path: string,
    options?: { history?: 'auto' | 'push' | 'replace' }
): Promise<void> {
    const nav = await resolveAstroNavigate();

    if (nav) {
        nav(path, options);
    } else {
        window.location.href = path;
    }
}

/**
 * Navigate synchronously — fire-and-forget wrapper around `navigateTo`.
 * Use this in event handlers where you don't need to await the result.
 */
export function go(path: string): void {
    void navigateTo(path);
}
