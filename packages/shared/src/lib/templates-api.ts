/**
 * Templates API Client — @formanywhere/shared
 * Public endpoint — no authentication required to browse templates.
 * Authentication IS required to create a form from a template.
 */
import { fetchWithAuth } from './auth-client';

const getApiUrl = () =>
    (typeof window !== 'undefined' ? (import.meta as any).env?.VITE_API_URL : null) ||
    'http://localhost:3001';

export interface TemplateData {
    id: string;
    name: string;
    description: string | null;
    category: string;
    icon: string;
    sortOrder: number;
    createdAt: string;
}

export interface TemplateDetail extends TemplateData {
    schema: unknown;
    updatedAt: string;
}

/**
 * Fetch all public templates, optionally filtered by category.
 */
export async function fetchTemplates(category?: string): Promise<TemplateData[]> {
    try {
        const params = category ? `?category=${encodeURIComponent(category)}` : '';
        const res = await fetch(`${getApiUrl()}/api/templates${params}`);
        if (!res.ok) return [];
        const data = await res.json();
        return data.success ? data.templates : [];
    } catch {
        return [];
    }
}

/**
 * Fetch a single template by ID (includes full schema).
 */
export async function fetchTemplate(id: string): Promise<TemplateDetail | null> {
    try {
        const res = await fetch(`${getApiUrl()}/api/templates/${id}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.success ? data.template : null;
    } catch {
        return null;
    }
}

/**
 * Create a new user form from a template schema.
 * Requires authentication — the form is associated with the current user.
 */
export async function createFormFromTemplate(template: TemplateDetail): Promise<{
    success: boolean;
    formId?: string;
}> {
    try {
        const res = await fetchWithAuth(`${getApiUrl()}/api/forms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: template.name,
                description: template.description ?? '',
                schema: template.schema,
                status: 'draft',
            }),
        });
        if (!res.ok) return { success: false };
        const data = await res.json();
        return { success: !!data.success, formId: data.form?.id };
    } catch {
        return { success: false };
    }
}
