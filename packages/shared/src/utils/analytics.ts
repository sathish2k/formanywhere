/**
 * Form Analytics — Stub module
 *
 * Tracks form views, submissions, and completion rates.
 * Currently a no-op stub; replace with a real analytics
 * service (PostHog, Mixpanel, custom backend) when ready.
 */

export interface FormAnalyticsEvent {
    formId: string;
    event: 'view' | 'start' | 'field_focus' | 'field_complete' | 'submit' | 'abandon';
    timestamp: number;
    metadata?: Record<string, unknown>;
}

/** In-memory event buffer (flushed when analytics backend is connected). */
const eventBuffer: FormAnalyticsEvent[] = [];

/**
 * Track a form analytics event.
 * Currently buffers in memory; wire to a real endpoint to persist.
 */
export function trackFormEvent(
    formId: string,
    event: FormAnalyticsEvent['event'],
    metadata?: Record<string, unknown>,
): void {
    const entry: FormAnalyticsEvent = {
        formId,
        event,
        timestamp: Date.now(),
        metadata,
    };
    eventBuffer.push(entry);

    if (import.meta.env.DEV) {
        console.debug('[analytics]', entry);
    }
}

/**
 * Get buffered analytics events (for debugging / dev tools).
 */
export function getBufferedEvents(): FormAnalyticsEvent[] {
    return [...eventBuffer];
}

/**
 * Flush the event buffer.
 * In production this would POST to an analytics endpoint.
 */
export async function flushAnalytics(
    _endpoint?: string,
): Promise<void> {
    if (eventBuffer.length === 0) return;

    // TODO: Replace with actual API call
    // await fetch(endpoint, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ events: eventBuffer }),
    // });

    if (import.meta.env.DEV) {
        console.debug(`[analytics] Flushed ${eventBuffer.length} events`);
    }
    eventBuffer.length = 0;
}

/**
 * Compute basic analytics summary from events.
 */
export function computeAnalyticsSummary(events: FormAnalyticsEvent[]) {
    const views = events.filter((e) => e.event === 'view').length;
    const starts = events.filter((e) => e.event === 'start').length;
    const submits = events.filter((e) => e.event === 'submit').length;
    const abandons = events.filter((e) => e.event === 'abandon').length;

    return {
        totalViews: views,
        totalStarts: starts,
        totalSubmissions: submits,
        totalAbandons: abandons,
        completionRate: starts > 0 ? (submits / starts) * 100 : 0,
        dropOffRate: starts > 0 ? (abandons / starts) * 100 : 0,
    };
}
