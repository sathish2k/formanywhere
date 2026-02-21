/**
 * Dashboard Datasource
 * API calls for dashboard data — talks to Elysia backend via session cookies.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface FormData {
    id: string;
    title: string;
    description?: string | null;
    schema?: unknown;
    status: string;
    submissions: number;
    createdAt: string;
    updatedAt: string;
}

export interface FetchFormsOptions {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    dateFrom?: string;
    dateTo?: string;
    responseRanges?: string[];
    statuses?: string[];
}

export interface FetchFormsResult {
    forms: FormData[];
    total: number;
    page: number;
    totalPages: number;
}

/**
 * Fetch authenticated user's forms from API.
 * User is identified via session cookie — no userId param needed.
 */
export async function fetchForms(
    options?: FetchFormsOptions
): Promise<FetchFormsResult> {
    try {
        const params = new URLSearchParams();

        if (options?.search) params.append('search', options.search);
        if (options?.sortBy) params.append('sortBy', options.sortBy);
        if (options?.sortOrder) params.append('sortOrder', options.sortOrder);
        if (options?.page) params.append('page', String(options.page));
        if (options?.limit) params.append('limit', String(options.limit));
        if (options?.dateFrom) params.append('dateFrom', options.dateFrom);
        if (options?.dateTo) params.append('dateTo', options.dateTo);
        if (options?.responseRanges?.length)
            params.append('responseRanges', options.responseRanges.join(','));
        if (options?.statuses?.length)
            params.append('statuses', options.statuses.join(','));

        const qs = params.toString();
        const url = `${API_URL}/api/forms${qs ? `?${qs}` : ''}`;

        const response = await fetch(url, { credentials: 'include' });

        if (!response.ok) {
            console.error('Failed to fetch forms:', response.status);
            return { forms: [], total: 0, page: 1, totalPages: 0 };
        }

        const data = await response.json();

        if (data.success) {
            return {
                forms: data.forms,
                total: data.total || 0,
                page: data.page || 1,
                totalPages: data.totalPages || 0,
            };
        }

        console.error('Failed to fetch forms:', data.error);
        return { forms: [], total: 0, page: 1, totalPages: 0 };
    } catch (error) {
        console.error('Error fetching forms:', error);
        return { forms: [], total: 0, page: 1, totalPages: 0 };
    }
}

/**
 * Create a new form
 */
export async function createForm(data: {
    title: string;
    description?: string;
    schema?: unknown;
    status?: string;
}): Promise<{ success: boolean; form?: FormData }> {
    try {
        const response = await fetch(`${API_URL}/api/forms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            return { success: false };
        }

        const result = await response.json();
        return { success: result.success, form: result.form };
    } catch (error) {
        console.error('Error creating form:', error);
        return { success: false };
    }
}

/**
 * Delete a form
 */
export async function deleteForm(formId: string): Promise<{ success: boolean }> {
    try {
        const response = await fetch(`${API_URL}/api/forms/${formId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) return { success: false };

        const result = await response.json();
        return { success: result.success };
    } catch (error) {
        console.error('Error deleting form:', error);
        return { success: false };
    }
}

/**
 * Duplicate a form (server-side via dedicated endpoint)
 */
export async function duplicateForm(
    formId: string
): Promise<{ success: boolean; form?: FormData }> {
    try {
        const response = await fetch(`${API_URL}/api/forms/${formId}/duplicate`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) return { success: false };

        const result = await response.json();
        return { success: result.success, form: result.form };
    } catch (error) {
        console.error('Error duplicating form:', error);
        return { success: false };
    }
}

/**
 * Update a form
 */
export async function updateForm(
    formId: string,
    data: Partial<{ title: string; description: string; schema: unknown; status: string }>
): Promise<{ success: boolean; form?: FormData }> {
    try {
        const response = await fetch(`${API_URL}/api/forms/${formId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) return { success: false };

        const result = await response.json();
        return { success: result.success, form: result.form };
    } catch (error) {
        console.error('Error updating form:', error);
        return { success: false };
    }
}

/**
 * Get a single form by ID
 */
export async function getForm(formId: string): Promise<{ success: boolean; form?: FormData }> {
    try {
        const response = await fetch(`${API_URL}/api/forms/${formId}`, {
            credentials: 'include',
        });

        if (!response.ok) return { success: false };

        const result = await response.json();
        return { success: result.success, form: result.form };
    } catch (error) {
        console.error('Error fetching form:', error);
        return { success: false };
    }
}
