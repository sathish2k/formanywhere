/**
 * Better Auth Client Configuration
 * 
 * This is the client-side auth configuration used by frontend components.
 * It communicates with the Better Auth server endpoints.
 * 
 * Features:
 * - Email/password + social login
 * - Automatic redirect to /signin on 401 (session expired)
 * - fetchWithAuth wrapper for API calls with session expiry detection
 */
import { createAuthClient } from 'better-auth/client';

// ── Session-expired callback registry ───────────────────────────────────────

type SessionExpiredHandler = () => void;
let _onSessionExpired: SessionExpiredHandler | null = null;

/**
 * Register a callback to be invoked when a 401 (session expired) is detected.
 * Typically called once from AuthProvider to wire up sign-out + redirect logic.
 */
export function onSessionExpired(handler: SessionExpiredHandler) {
    _onSessionExpired = handler;
}

/** Trigger the session-expired handler (called internally) */
function handleSessionExpired() {
    if (_onSessionExpired) {
        _onSessionExpired();
    } else {
        // Fallback — hard redirect when no handler is registered
        if (typeof window !== 'undefined') {
            window.location.href = '/signin';
        }
    }
}

/**
 * The auth client instance configured to point at the backend API.
 */
export const authClient = createAuthClient({
    baseURL: typeof window !== 'undefined'
        ? (import.meta.env?.VITE_API_URL || 'http://localhost:3001')
        : 'http://localhost:3001',
});

/**
 * Convenience re-exports for common auth operations.
 */
export const {
    signIn,
    signUp,
    signOut,
    getSession,
    useSession,
} = authClient;

/**
 * Type exports for use in components.
 */
export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;

// ── fetchWithAuth: API wrapper with 401 interception ────────────────────────

/**
 * Fetch wrapper that automatically detects 401 responses and triggers
 * the session-expired flow (sign out + redirect to /signin).
 *
 * Use this instead of raw `fetch()` for any authenticated API call.
 *
 * @example
 * ```ts
 * import { fetchWithAuth } from '@formanywhere/shared/auth-client';
 * const res = await fetchWithAuth('/api/forms');
 * ```
 */
export async function fetchWithAuth(
    input: RequestInfo | URL,
    init?: RequestInit,
): Promise<Response> {
    const res = await fetch(input, {
        credentials: 'include',
        ...init,
    });

    if (res.status === 401) {
        handleSessionExpired();
    }

    return res;
}
