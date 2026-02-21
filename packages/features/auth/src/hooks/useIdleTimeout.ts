/**
 * useIdleTimeout — SolidJS hook that tracks user activity and triggers
 * a callback (typically sign-out + redirect) after a configurable period
 * of inactivity.
 *
 * Also periodically checks if the server session is still valid, so
 * expired sessions are caught even if the user is active.
 *
 * Usage:
 *   useIdleTimeout({
 *       onIdle: () => signOut(),
 *       onSessionExpired: () => signOut(),
 *       isAuthenticated: () => auth.isAuthenticated(),
 *   });
 */
import { onMount, onCleanup } from 'solid-js';
import type { Accessor } from 'solid-js';
import {
    IDLE_TIMEOUT_MS,
    SESSION_CHECK_INTERVAL_MS,
    ACTIVITY_EVENTS,
} from '@formanywhere/shared/constants';
import { authClient } from '@formanywhere/shared/auth-client';

export interface UseIdleTimeoutOptions {
    /** Called when the user has been idle for IDLE_TIMEOUT_MS */
    onIdle: () => void;
    /** Called when a periodic session check discovers the session has expired */
    onSessionExpired: () => void;
    /** Reactive accessor: only run timers when the user is authenticated */
    isAuthenticated: Accessor<boolean>;
    /** Override idle timeout (ms) — defaults to IDLE_TIMEOUT_MS from config */
    timeout?: number;
}

export function useIdleTimeout(options: UseIdleTimeoutOptions) {
    if (typeof window === 'undefined') return; // SSR guard

    const timeoutMs = options.timeout ?? IDLE_TIMEOUT_MS;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let sessionCheckInterval: ReturnType<typeof setInterval> | null = null;

    /** Reset the idle timer on any user activity */
    const resetIdleTimer = () => {
        if (!options.isAuthenticated()) return;

        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            if (options.isAuthenticated()) {
                options.onIdle();
            }
        }, timeoutMs);
    };

    /** Periodically verify the session is still valid on the server */
    const startSessionCheck = () => {
        sessionCheckInterval = setInterval(async () => {
            if (!options.isAuthenticated()) return;

            try {
                const result = await authClient.getSession();
                if (!result.data) {
                    // Session expired on the server
                    options.onSessionExpired();
                }
            } catch {
                // Network error — don't force sign-out, user may be temporarily offline
            }
        }, SESSION_CHECK_INTERVAL_MS);
    };

    /** Attach activity listeners */
    const attachListeners = () => {
        for (const event of ACTIVITY_EVENTS) {
            window.addEventListener(event, resetIdleTimer, { passive: true });
        }
        // Also reset on tab visibility change (user returns to tab)
        document.addEventListener('visibilitychange', handleVisibilityChange);
    };

    /** Detach activity listeners */
    const detachListeners = () => {
        for (const event of ACTIVITY_EVENTS) {
            window.removeEventListener(event, resetIdleTimer);
        }
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

    /** When user returns to the tab, immediately check session validity */
    const handleVisibilityChange = async () => {
        if (document.visibilityState === 'visible' && options.isAuthenticated()) {
            resetIdleTimer();
            try {
                const result = await authClient.getSession();
                if (!result.data) {
                    options.onSessionExpired();
                }
            } catch {
                // Network error — ignore
            }
        }
    };

    onMount(() => {
        attachListeners();
        resetIdleTimer();
        startSessionCheck();
    });

    onCleanup(() => {
        detachListeners();
        if (idleTimer) clearTimeout(idleTimer);
        if (sessionCheckInterval) clearInterval(sessionCheckInterval);
    });
}
