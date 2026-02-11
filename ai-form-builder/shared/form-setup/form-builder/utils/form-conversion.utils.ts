/**
 * Form Conversion Utilities
 * Convert between DroppedElement[] and IFormField[] for database storage
 */

import type { IFormField } from '@/server/src/models/form.model';
import type { DroppedElement, PageData } from '../form-builder.configuration';

/**
 * Convert form builder elements to database format
 */
export function convertToFormFields(
  pageElements: Record<string, DroppedElement[]>,
  pages: PageData[]
): { fields: IFormField[]; pageFields: Record<string, string[]> } {
  const fields: IFormField[] = [];
  const pageFields: Record<string, string[]> = {};

  // Process each page's elements
  pages.forEach((page) => {
    const elements = pageElements[page.id] || [];
    const fieldIds: string[] = [];

    elements.forEach((element) => {
      // Skip non-input elements (layout and decorators)
      if (isInputElement(element.type)) {
        const field = elementToField(element);
        fields.push(field);
        fieldIds.push(element.id);
      }

      // Process nested elements in containers
      if (element.children) {
        const nestedFields = processNestedElements(element.children);
        fields.push(...nestedFields.fields);
        fieldIds.push(...nestedFields.fieldIds);
      }
    });

    pageFields[page.id] = fieldIds;
  });

  return { fields, pageFields };
}

/**
 * Convert a single DroppedElement to IFormField
 */
function elementToField(element: DroppedElement): IFormField {
  const field: IFormField = {
    id: element.id,
    type: mapElementType(element.type),
    label: element.label,
    placeholder: element.placeholder,
    required: element.required || false,
  };

  // Add options for select, radio, checkbox
  if (element.options && element.options.length > 0) {
    field.options = element.options.map((opt) => opt.value);
  }

  // Add validation
  if (element.validation) {
    field.validation = {
      min: element.validation.min,
      max: element.validation.max,
      pattern: element.validation.pattern,
    };
  }

  return field;
}

/**
 * Process nested elements recursively
 */
function processNestedElements(elements: DroppedElement[]): {
  fields: IFormField[];
  fieldIds: string[];
} {
  const fields: IFormField[] = [];
  const fieldIds: string[] = [];

  elements.forEach((element) => {
    if (isInputElement(element.type)) {
      fields.push(elementToField(element));
      fieldIds.push(element.id);
    }

    if (element.children) {
      const nested = processNestedElements(element.children);
      fields.push(...nested.fields);
      fieldIds.push(...nested.fieldIds);
    }
  });

  return { fields, fieldIds };
}

/**
 * Check if element type is an input element (vs layout/decorator)
 */
function isInputElement(type: string): boolean {
  const inputTypes = [
    'text-input',
    'email-input',
    'number-input',
    'textarea',
    'select',
    'checkbox',
    'radio',
    'date-picker',
    'file-upload',
  ];
  return inputTypes.includes(type);
}

/**
 * Map form builder element types to database field types
 */
function mapElementType(type: string): string {
  const typeMap: Record<string, string> = {
    'text-input': 'text',
    'email-input': 'email',
    'number-input': 'number',
    textarea: 'textarea',
    select: 'select',
    checkbox: 'checkbox',
    radio: 'radio',
    'date-picker': 'date',
    'file-upload': 'file',
  };

  return typeMap[type] || 'text';
}

/**
 * Convert database format back to form builder elements
 * (For loading existing forms)
 */
export function convertFromFormFields(
  fields: IFormField[],
  pageFields: Record<string, string[]>
): Record<string, DroppedElement[]> {
  const pageElements: Record<string, DroppedElement[]> = {};

  Object.entries(pageFields).forEach(([pageId, fieldIds]) => {
    const elements: DroppedElement[] = fieldIds
      .map((fieldId) => {
        const field = fields.find((f) => f.id === fieldId);
        if (!field) return null;
        return fieldToElement(field);
      })
      .filter((el): el is DroppedElement => el !== null);

    pageElements[pageId] = elements;
  });

  return pageElements;
}

/**
 * Convert IFormField back to DroppedElement
 */
function fieldToElement(field: IFormField): DroppedElement {
  // This is a simplified conversion - in production you'd need to restore
  // all element properties including icon, color, etc from element definitions
  return {
    id: field.id,
    type: reverseMapElementType(field.type) as any,
    label: field.label,
    icon: null as any, // Would need to be restored from element definitions
    color: '#000',
    fieldName: field.id,
    placeholder: field.placeholder,
    required: field.required,
    validation: field.validation
      ? {
          rules: [],
          min: field.validation.min,
          max: field.validation.max,
          pattern: field.validation.pattern,
        }
      : undefined,
    options: field.options?.map((value) => ({ label: value, value })),
  };
}

/**
 * Reverse map database field types to form builder element types
 */
function reverseMapElementType(type: string): string {
  const reverseMap: Record<string, string> = {
    text: 'text-input',
    email: 'email-input',
    number: 'number-input',
    textarea: 'textarea',
    select: 'select',
    checkbox: 'checkbox',
    radio: 'radio',
    date: 'date-picker',
    file: 'file-upload',
  };

  return reverseMap[type] || 'text-input';
}
