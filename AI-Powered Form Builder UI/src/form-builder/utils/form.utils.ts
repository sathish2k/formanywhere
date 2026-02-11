/**
 * Form Builder Utilities
 * Helper functions for form building operations
 */

import { DroppedElement, FormElement, ValidationResult } from '../types/form.types';
import { FORM_ELEMENTS } from '../config/elements.config';

/**
 * Create a new dropped element from a form element template
 */
export const createDroppedElement = (elementType: string): DroppedElement | null => {
  const element = FORM_ELEMENTS.find((el) => el.type === elementType);
  if (!element) return null;

  const baseElement: DroppedElement = {
    id: `${element.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: element.type,
    label: element.label,
    placeholder: `Enter ${element.label.toLowerCase()}`,
    icon: element.icon,
    color: element.color,
    required: false,
    options: ['dropdown', 'radio', 'checkbox'].includes(element.type)
      ? ['Option 1', 'Option 2', 'Option 3']
      : undefined,
    validation: {
      message: '',
    },
  };

  // Add specific defaults for layout elements
  switch (elementType) {
    case 'container':
      return {
        ...baseElement,
        maxWidth: 'md',
        children: [],
        isLayoutElement: true,
      };
    case 'grid-container':
      return {
        ...baseElement,
        container: true,
        spacing: 2,
        children: [],
        isLayoutElement: true,
      };
    case 'heading':
      return {
        ...baseElement,
        headingText: 'Your Heading Text',
        headingLevel: 'h2',
        headingWeight: 600,
        headingColor: '#202124',
        isLayoutElement: true,
      };
    case 'logo':
      return {
        ...baseElement,
        logoUrl: 'https://via.placeholder.com/150x50?text=Logo',
        logoAlt: 'Logo',
        isLayoutElement: true,
      };
    case 'divider':
      return {
        ...baseElement,
        dividerThickness: 1,
        dividerColor: '#E8EAED',
        isLayoutElement: true,
      };
    case 'spacer':
      return {
        ...baseElement,
        spacerHeight: 24,
        isLayoutElement: true,
      };
    case 'section':
      return {
        ...baseElement,
        sectionBgColor: '#F8F9FA',
        children: [],
        gridContainer: false, // User can enable this in properties
        gridColumns: 12,
        gridSpacing: 2,
        gridDirection: 'row',
        gridJustifyContent: 'flex-start',
        gridAlignItems: 'stretch',
        gridWrap: 'wrap',
        isLayoutElement: true,
      };
    case 'card':
      return {
        ...baseElement,
        children: [],
        isLayoutElement: true,
      };
    case 'text-block':
      return {
        ...baseElement,
        textBlockContent: 'Add your text content here. You can use this to provide instructions, descriptions, or any other information.',
        textBlockColor: '#5F6368',
        textBlockAlign: 'left',
        isLayoutElement: true,
      };
    default:
      return baseElement;
  }
};

/**
 * Duplicate an element with a new ID
 */
export const duplicateElement = (element: DroppedElement): DroppedElement => {
  return {
    ...element,
    id: `${element.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    label: `${element.label} (Copy)`,
  };
};

/**
 * Generate a form schema from elements
 */
export const generateFormSchema = (elements: DroppedElement[]): any => {
  const schema: any = {
    type: 'object',
    properties: {},
    required: [],
  };

  elements.forEach((element) => {
    if (element.isLayoutElement) return;

    const fieldSchema: any = {
      title: element.label,
      description: element.helperText,
    };

    // Set type based on element type
    switch (element.type) {
      case 'short-text':
      case 'long-text':
      case 'email':
      case 'phone':
      case 'url':
        fieldSchema.type = 'string';
        if (element.validation?.minLength) {
          fieldSchema.minLength = element.validation.minLength;
        }
        if (element.validation?.maxLength) {
          fieldSchema.maxLength = element.validation.maxLength;
        }
        if (element.validation?.pattern) {
          fieldSchema.pattern = element.validation.pattern;
        }
        break;

      case 'number':
        fieldSchema.type = 'number';
        if (element.validation?.min !== undefined) {
          fieldSchema.minimum = element.validation.min;
        }
        if (element.validation?.max !== undefined) {
          fieldSchema.maximum = element.validation.max;
        }
        break;

      case 'dropdown':
      case 'radio':
        fieldSchema.type = 'string';
        if (element.options) {
          fieldSchema.enum = element.options;
        }
        break;

      case 'checkbox':
        fieldSchema.type = 'array';
        fieldSchema.items = {
          type: 'string',
          enum: element.options,
        };
        break;

      case 'switch':
        fieldSchema.type = 'boolean';
        break;

      case 'date':
        fieldSchema.type = 'string';
        fieldSchema.format = 'date';
        break;

      case 'time':
        fieldSchema.type = 'string';
        fieldSchema.format = 'time';
        break;

      case 'rating':
        fieldSchema.type = 'number';
        fieldSchema.minimum = 1;
        fieldSchema.maximum = 5;
        break;

      default:
        fieldSchema.type = 'string';
    }

    schema.properties[element.id] = fieldSchema;

    if (element.required) {
      schema.required.push(element.id);
    }
  });

  return schema;
};

/**
 * Export form data to JSON
 */
export const exportFormToJSON = (
  formName: string,
  pages: any[],
  elements: Record<string, DroppedElement[]>,
  layout: any
): string => {
  const formData = {
    name: formName,
    version: '1.0',
    createdAt: new Date().toISOString(),
    pages,
    elements,
    layout,
  };

  return JSON.stringify(formData, null, 2);
};

/**
 * Import form data from JSON
 */
export const importFormFromJSON = (jsonString: string): any => {
  try {
    const formData = JSON.parse(jsonString);
    return formData;
  } catch (error) {
    console.error('Failed to parse form JSON:', error);
    return null;
  }
};

/**
 * Group elements by category
 */
export const groupElementsByCategory = (
  elements: FormElement[]
): Record<string, FormElement[]> => {
  return elements.reduce((acc, element) => {
    if (!acc[element.category]) {
      acc[element.category] = [];
    }
    acc[element.category].push(element);
    return acc;
  }, {} as Record<string, FormElement[]>);
};

/**
 * Filter elements by search query
 */
export const filterElements = (
  elements: FormElement[],
  query: string
): FormElement[] => {
  const lowerQuery = query.toLowerCase();
  return elements.filter(
    (el) =>
      el.label.toLowerCase().includes(lowerQuery) ||
      el.category.toLowerCase().includes(lowerQuery) ||
      el.type.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Calculate form completion percentage
 */
export const calculateFormCompletion = (
  elements: DroppedElement[],
  formData: Record<string, any>
): number => {
  const totalFields = elements.filter((el) => !el.isLayoutElement).length;
  if (totalFields === 0) return 0;

  const completedFields = elements.filter((el) => {
    if (el.isLayoutElement) return false;
    const value = formData[el.id];
    return value !== undefined && value !== null && value !== '';
  }).length;

  return Math.round((completedFields / totalFields) * 100);
};

/**
 * Get element by ID
 */
export const getElementById = (
  elements: DroppedElement[],
  id: string
): DroppedElement | undefined => {
  return elements.find((el) => el.id === id);
};

/**
 * Reorder elements (for drag and drop)
 */
export const reorderElements = (
  elements: DroppedElement[],
  startIndex: number,
  endIndex: number
): DroppedElement[] => {
  const result = Array.from(elements);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Validate element configuration
 */
export const validateElementConfig = (element: DroppedElement): string[] => {
  const errors: string[] = [];

  if (!element.label || element.label.trim() === '') {
    errors.push('Label is required');
  }

  if (
    ['dropdown', 'radio', 'checkbox'].includes(element.type) &&
    (!element.options || element.options.length === 0)
  ) {
    errors.push('At least one option is required');
  }

  if (element.validation?.minLength && element.validation?.maxLength) {
    if (element.validation.minLength > element.validation.maxLength) {
      errors.push('Min length cannot be greater than max length');
    }
  }

  if (element.validation?.min !== undefined && element.validation?.max !== undefined) {
    if (element.validation.min > element.validation.max) {
      errors.push('Min value cannot be greater than max value');
    }
  }

  return errors;
};

/**
 * Generate unique element ID
 */
export const generateElementId = (type: string): string => {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Clone element with modifications
 */
export const cloneElement = (
  element: DroppedElement,
  modifications?: Partial<DroppedElement>
): DroppedElement => {
  return {
    ...element,
    id: generateElementId(element.type),
    ...modifications,
  };
};