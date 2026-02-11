/**
 * Templates Datasource
 * API calls for fetching template data from backend
 */

import type { Template } from '@/shared/templates';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Fetch all templates from API
 */
export async function fetchTemplates(options?: { category?: string; search?: string }): Promise<
  Template[]
> {
  try {
    const params = new URLSearchParams();
    if (options?.category && options.category !== 'all') {
      params.append('category', options.category);
    }
    if (options?.search) {
      params.append('search', options.search);
    }

    const response = await fetch(`${API_URL}/templates?${params.toString()}`);
    const data = await response.json();

    if (data.success && data.templates) {
      return data.templates;
    }

    console.error('Failed to fetch templates:', data.message);
    return [];
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
}

/**
 * Fetch template by ID
 */
export async function fetchTemplateById(id: string): Promise<Template | undefined> {
  try {
    const response = await fetch(`${API_URL}/templates/${id}`);
    const data = await response.json();

    if (data.success && data.template) {
      return data.template;
    }

    return undefined;
  } catch (error) {
    console.error('Error fetching template:', error);
    return undefined;
  }
}

/**
 * Use template (clone for user)
 */
export async function useTemplate(
  templateId: string,
  userId: string
): Promise<{ success: boolean; formId?: string }> {
  try {
    const response = await fetch(`${API_URL}/templates/${templateId}/use`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    if (data.success) {
      return { success: true, formId: data.form?.id };
    }

    return { success: false };
  } catch (error) {
    console.error('Error using template:', error);
    return { success: false };
  }
}
