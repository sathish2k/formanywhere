/**
 * Dashboard Datasource
 * API calls for dashboard data
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface FormData {
  id: string;
  title: string;
  description?: string;
  submissions: number;
  isPublished: boolean;
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
  creators?: string[];
}

export interface FetchFormsResult {
  forms: FormData[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Fetch user's forms from API
 */
export async function fetchForms(
  userId: string,
  options?: FetchFormsOptions
): Promise<FetchFormsResult> {
  try {
    const params = new URLSearchParams({ userId });

    if (options?.search) params.append('search', options.search);
    if (options?.sortBy) params.append('sortBy', options.sortBy);
    if (options?.sortOrder) params.append('sortOrder', options.sortOrder);
    if (options?.page) params.append('page', String(options.page));
    if (options?.limit) params.append('limit', String(options.limit));
    if (options?.dateFrom) params.append('dateFrom', options.dateFrom);
    if (options?.dateTo) params.append('dateTo', options.dateTo);
    if (options?.responseRanges?.length)
      params.append('responseRanges', options.responseRanges.join(','));
    if (options?.creators?.length) params.append('creators', options.creators.join(','));

    const response = await fetch(`${API_URL}/forms?${params.toString()}`);
    const data = await response.json();

    if (data.success) {
      return {
        forms: data.forms.map((form: FormData) => ({
          ...form,
          createdAt: new Date(form.createdAt).toISOString(),
          updatedAt: new Date(form.updatedAt).toISOString(),
        })),
        total: data.total || 0,
        page: data.page || 1,
        totalPages: data.totalPages || 0,
      };
    }

    console.error('Failed to fetch forms:', data.message);
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
  userId: string;
  title: string;
  description?: string;
}): Promise<{ success: boolean; formId?: string }> {
  try {
    const response = await fetch(`${API_URL}/forms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      return { success: true, formId: result.form?.id };
    }

    return { success: false };
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
    const response = await fetch(`${API_URL}/forms/${formId}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    return { success: result.success };
  } catch (error) {
    console.error('Error deleting form:', error);
    return { success: false };
  }
}

/**
 * Duplicate a form
 */
export async function duplicateForm(
  formId: string,
  userId: string
): Promise<{ success: boolean; newFormId?: string }> {
  try {
    // First get the original form
    const getResponse = await fetch(`${API_URL}/forms/${formId}`);
    const getData = await getResponse.json();

    if (!getData.success || !getData.form) {
      return { success: false };
    }

    // Create a copy with new title
    const response = await fetch(`${API_URL}/forms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        title: `${getData.form.title} (Copy)`,
        description: getData.form.description,
        fields: getData.form.fields,
        settings: getData.form.settings,
      }),
    });

    const result = await response.json();

    if (result.success) {
      return { success: true, newFormId: result.form?.id };
    }

    return { success: false };
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
  data: Partial<{ title: string; description: string; isPublished: boolean }>
): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${API_URL}/forms/${formId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return { success: result.success };
  } catch (error) {
    console.error('Error updating form:', error);
    return { success: false };
  }
}
