// Application constants

export const APP_NAME = 'FormAnywhere';
export const APP_VERSION = '0.0.1';

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
