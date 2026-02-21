// Application constants

export const APP_NAME = 'FormAnywhere';
export const APP_VERSION = '0.0.1';

// ── Session & Idle Timeout ──────────────────────────────────────────────────

/** Idle timeout in milliseconds — redirect to login after this period of inactivity */
export const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

/** How often (ms) to check if the session is still valid while the app is active */
export const SESSION_CHECK_INTERVAL_MS = 60 * 1000; // 1 minute

/** Events that count as user activity (resets the idle timer) */
export const ACTIVITY_EVENTS = [
    'mousedown', 'mousemove', 'keydown',
    'scroll', 'touchstart', 'click',
] as const;

export const FORM_ELEMENT_TYPES = [
    'text',
    'email',
    'number',
    'textarea',
    'select',
    'checkbox',
    'radio',
    'date',
    'file',
    'signature',
] as const;

export const SYNC_STATUS = {
    PENDING: 'pending',
    SYNCED: 'synced',
    FAILED: 'failed',
} as const;

export const DB_NAME = 'formanywhere-db';
export const DB_VERSION = 1;

export const API_ENDPOINTS = {
    FORMS: '/api/forms',
    SUBMISSIONS: '/api/submissions',
    SYNC: '/api/sync',
    AUTH: '/api/auth',
} as const;
