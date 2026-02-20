/**
 * Navigation Utility
 *
 * Uses SolidStart router's `useNavigate()` for client-side
 * navigation when available, falls back to `window.location.href`
 * in non-SolidStart environments (e.g. Tauri desktop).
 */

/**
 * Navigate to a path.
 * Falls back to `window.location.href` in all contexts.
 * In SolidJS components, prefer using `useNavigate()` from `@solidjs/router` directly.
 */
export async function navigateTo(
    path: string,
    _options?: { history?: 'auto' | 'push' | 'replace' }
): Promise<void> {
    window.location.href = path;
}

/**
 * Navigate synchronously — fire-and-forget wrapper around `navigateTo`.
 * Use this in event handlers where you don't need to await the result.
 */
export function go(path: string): void {
    void navigateTo(path);
}
