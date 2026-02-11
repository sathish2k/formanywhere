/**
 * Filter Constants
 */
export const RESPONSE_RANGES = ['0-50', '51-100', '101+'] as const;

export const AVAILABLE_STATUSES = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' },
] as const;
