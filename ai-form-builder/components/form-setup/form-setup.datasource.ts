import type { FormSetupData } from './form-setup.configuration';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000';

/**
 * Save form to backend
 * @param formData - Complete form setup data
 * @param userId - User ID to associate with the form
 * @returns Form ID from backend
 */
export async function saveForm(formData: FormSetupData, userId: string): Promise<{ id: string }> {
  const url = `${API_URL}/forms`;
  console.log('Saving form to:', url);
  console.log('Form data:', formData);
  console.log('User ID:', userId);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...formData,
      userId, // Include userId in the request
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Save error response:', errorText);
    const error = JSON.parse(errorText || '{"message":"Failed to save form"}');
    throw new Error(error.message || 'Failed to save form');
  }

  const result = await response.json();
  console.log('Save response:', result);

  // Extract id from response (server returns { id: "...", form: {...} })
  return { id: result.id };
}

/**
 * Fetch form by ID
 * @param formId - Form ID
 * @returns Form setup data
 */
export async function fetchFormById(formId: string): Promise<FormSetupData & { id: string }> {
  const url = `${API_URL}/forms/${formId}`;
  console.log('Fetching form from:', url);

  try {
    const response = await fetch(url);
    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      const error = JSON.parse(errorText || '{"message":"Failed to fetch form"}');
      throw new Error(error.message || 'Failed to fetch form');
    }

    const data = await response.json();
    console.log('Form data received:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

/**
 * Update existing form
 * @param formId - Form ID
 * @param formData - Updated form data
 */
export async function updateForm(formId: string, formData: Partial<FormSetupData>): Promise<void> {
  const response = await fetch(`${API_URL}/forms/${formId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update form' }));
    throw new Error(error.message || 'Failed to update form');
  }
}

/**
 * Delete form
 * @param formId - Form ID to delete
 */
export async function deleteForm(formId: string): Promise<void> {
  const response = await fetch(`${API_URL}/forms/${formId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete form');
  }
}

/**
 * Update form builder state (for auto-save)
 * @param formId - Form ID
 * @param data - Form builder data to save
 */
export async function updateFormBuilder(
  formId: string,
  data: {
    fields?: any[];
    pages: any[];
    pageFields?: Record<string, string[]>;
    pageElements?: Record<string, any[]>;
    rules?: any[];
    workflows?: any[];
  }
): Promise<void> {
  const response = await fetch(`${API_URL}/forms/${formId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: data.fields || [],
      settings: {
        pages: data.pages,
        pageFields: data.pageFields,
        pageElements: data.pageElements,
        rules: data.rules,
        workflows: data.workflows,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const error = JSON.parse(errorText || '{"message":"Failed to update form"}');
    throw new Error(error.message || 'Failed to update form');
  }
}

/**
 * Publish or unpublish a form
 * @param formId - Form ID
 * @param isPublished - Whether to publish or unpublish
 */
export async function publishForm(formId: string, isPublished: boolean): Promise<void> {
  const response = await fetch(`${API_URL}/forms/${formId}/publish`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isPublished }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const error = JSON.parse(errorText || '{"message":"Failed to publish form"}');
    throw new Error(error.message || 'Failed to publish form');
  }
}
