/**
 * Navigation Utility
 *
 * Falls back to window.location.href for contexts outside
 * the SolidJS router (e.g., Tauri desktop, standalone scripts).
 * In SolidJS components, prefer using useNavigate() from @solidjs/router directly.
 */

/**
 * Navigate to a path.
 * Falls back to window.location.href — for use outside SolidJS components.
 * Inside SolidJS components, use useNavigate() from @solidjs/router instead.
 */
export async function navigateTo(
    path: string,
    _options?: { history?: 'auto' | 'push' | 'replace' }
): Promise<void> {
    window.location.href = path;
}

/**
 * Navigate synchronously — fire-and-forget wrapper around navigateTo.
 * Use this only in non-component contexts. Inside components, use useNavigate().
 */
export function go(path: string): void {
    void navigateTo(path);
}
