/**
 * Form Builder Datasource
 * API calls and data operations for form builder
 */

import type { FormSetupData } from './form-builder.configuration';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Create a new form with setup data
 */
export async function createFormWithSetup(
  userId: string,
  setupData: FormSetupData
): Promise<{ success: boolean; formId?: string }> {
  try {
    const response = await fetch(`${API_URL}/forms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creatorId: userId,
        title: setupData.name,
        description: setupData.description,
        layout: setupData.layoutType,
        pages: setupData.pages,
      }),
    });

    const data = await response.json();
    return {
      success: data.success,
      formId: data.form?.id,
    };
  } catch (error) {
    console.error('Error creating form:', error);
    return { success: false };
  }
}

/**
 * Save form setup draft (for auto-save)
 */
export async function saveSetupDraft(
  userId: string,
  setupData: Partial<FormSetupData>
): Promise<{ success: boolean }> {
  // TODO: Implement draft saving to localStorage or API
  try {
    localStorage.setItem(`form-setup-draft-${userId}`, JSON.stringify(setupData));
    return { success: true };
  } catch (error) {
    console.error('Error saving draft:', error);
    return { success: false };
  }
}

/**
 * Load form setup draft
 */
export async function loadSetupDraft(userId: string): Promise<Partial<FormSetupData> | null> {
  try {
    const draft = localStorage.getItem(`form-setup-draft-${userId}`);
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    console.error('Error loading draft:', error);
    return null;
  }
}

/**
 * Clear form setup draft
 */
export async function clearSetupDraft(userId: string): Promise<void> {
  try {
    localStorage.removeItem(`form-setup-draft-${userId}`);
  } catch (error) {
    console.error('Error clearing draft:', error);
  }
}
