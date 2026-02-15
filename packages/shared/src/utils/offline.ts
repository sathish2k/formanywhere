/**
 * Offline Support — Stub module
 *
 * Provides offline-first capabilities for form submissions:
 *   - Queue submissions when offline
 *   - Retry when connectivity returns
 *   - Service worker registration helper
 *
 * Currently a stub with localStorage-backed queue.
 * Replace with a full service worker + IndexedDB implementation
 * (e.g., Workbox) for production use.
 */

const OFFLINE_QUEUE_KEY = 'formanywhere_offline_queue';

export interface OfflineSubmission {
    id: string;
    formId: string;
    data: Record<string, unknown>;
    timestamp: number;
    retries: number;
}

/**
 * Check if the browser is currently online.
 */
export function isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

/**
 * Queue a submission for later sync.
 */
export function queueSubmission(
    formId: string,
    data: Record<string, unknown>,
): OfflineSubmission {
    const entry: OfflineSubmission = {
        id: `offline_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        formId,
        data,
        timestamp: Date.now(),
        retries: 0,
    };

    const queue = getQueue();
    queue.push(entry);
    saveQueue(queue);

    if (import.meta.env.DEV) {
        console.debug('[offline] Queued submission', entry.id);
    }

    return entry;
}

/**
 * Get all pending offline submissions.
 */
export function getQueue(): OfflineSubmission[] {
    try {
        const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveQueue(queue: OfflineSubmission[]): void {
    try {
        localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    } catch { /* quota exceeded — silently fail */ }
}

/**
 * Attempt to flush the offline queue by submitting to the API.
 * Removes successfully submitted entries.
 *
 * @param submitFn - Async function that submits a single entry.
 *                   Should throw on failure.
 */
export async function flushOfflineQueue(
    submitFn: (entry: OfflineSubmission) => Promise<void>,
): Promise<{ sent: number; failed: number }> {
    if (!isOnline()) return { sent: 0, failed: 0 };

    const queue = getQueue();
    if (queue.length === 0) return { sent: 0, failed: 0 };

    let sent = 0;
    let failed = 0;
    const remaining: OfflineSubmission[] = [];

    for (const entry of queue) {
        try {
            await submitFn(entry);
            sent++;
        } catch {
            entry.retries++;
            remaining.push(entry);
            failed++;
        }
    }

    saveQueue(remaining);

    if (import.meta.env.DEV) {
        console.debug(`[offline] Flushed: ${sent} sent, ${failed} failed, ${remaining.length} remaining`);
    }

    return { sent, failed };
}

/**
 * Register a connectivity change listener that auto-flushes the queue.
 */
export function registerOnlineListener(
    submitFn: (entry: OfflineSubmission) => Promise<void>,
): () => void {
    const handler = () => {
        if (isOnline()) {
            flushOfflineQueue(submitFn);
        }
    };
    window.addEventListener('online', handler);
    return () => window.removeEventListener('online', handler);
}

/**
 * Register a service worker (stub).
 * Replace with a real SW registration (e.g., Workbox) for production.
 */
export async function registerServiceWorker(
    swUrl = '/sw.js',
): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
        console.warn('[offline] Service workers not supported');
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.register(swUrl);
        if (import.meta.env.DEV) {
            console.debug('[offline] Service worker registered', registration.scope);
        }
        return registration;
    } catch (error) {
        console.warn('[offline] Service worker registration failed:', error);
        return null;
    }
}
