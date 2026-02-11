/**
 * Form Builder Utilities - Public API
 */

import { DroppedElement, FormElement } from '../types';
import { FORM_ELEMENTS } from '../config';
import { generateId } from '../../../shared/utils';

/**
 * Create a dropped element from a form element type
 */
export const createDroppedElement = (elementType: string): DroppedElement | null => {
  const element = FORM_ELEMENTS.find((el) => el.type === elementType);
  if (!element) return null;

  const baseElement: DroppedElement = {
    id: generateId(),
    type: element.type,
    label: element.label,
    icon: element.icon,
    color: element.color,
    placeholder: `Enter ${element.label.toLowerCase()}`,
    required: false,
    visible: true,
    disabled: false,
    width: 'full',
    alignment: 'left',
    inputVariant: 'outlined',
    size: 'medium',
  };

  // Add element-specific properties
  switch (elementType) {
    case 'dropdown':
    case 'radio':
    case 'checkbox':
      return {
        ...baseElement,
        options: ['Option 1', 'Option 2', 'Option 3'],
        layout: 'vertical',
      };

    case 'section':
    case 'card':
      return {
        ...baseElement,
        isLayoutElement: true,
        children: [],
        sectionTitle: 'Section Title',
        showBorder: true,
        collapsible: false,
        defaultExpanded: true,
      };

    case 'columns-2':
      return {
        ...baseElement,
        isLayoutElement: true,
        column1Children: [],
        column2Children: [],
        columnSpacing: 16,
      };

    case 'columns-3':
      return {
        ...baseElement,
        isLayoutElement: true,
        column1Children: [],
        column2Children: [],
        column3Children: [],
        columnSpacing: 16,
      };

    case 'heading':
      return {
        ...baseElement,
        headingText: 'Heading Text',
        headingLevel: 'h2',
        headingWeight: 700,
      };

    case 'logo':
      return {
        ...baseElement,
        logoUrl: 'https://via.placeholder.com/150',
        logoAlt: 'Logo',
      };

    case 'divider':
      return {
        ...baseElement,
        dividerThickness: 1,
        dividerColor: '#DFE3E8',
      };

    case 'spacer':
      return {
        ...baseElement,
        spacerHeight: 24,
      };

    case 'text-block':
      return {
        ...baseElement,
        textBlockContent: 'Enter your text content here...',
        textBlockAlign: 'left',
      };

    case 'number':
      return {
        ...baseElement,
        minValue: 0,
        maxValue: 100,
        stepValue: 1,
        showArrows: true,
      };

    case 'long-text':
      return {
        ...baseElement,
        rows: 4,
        autoResize: false,
        characterCounter: false,
      };

    case 'file-upload':
      return {
        ...baseElement,
        allowedFileTypes: ['.pdf', '.doc', '.docx'],
        maxFileSize: 10,
        multipleFiles: false,
        dragDropEnabled: true,
        previewEnabled: true,
      };

    case 'rating':
      return {
        ...baseElement,
        ratingMax: 5,
        ratingIcon: 'star',
        showValue: true,
      };

    case 'date':
      return {
        ...baseElement,
        dateFormat: 'MM/DD/YYYY',
        disablePastDates: false,
        disableFutureDates: false,
      };

    default:
      return baseElement;
  }
};

/**
 * Validate an element's data
 */
export const validateElement = (element: DroppedElement, value: any): { valid: boolean; message?: string } => {
  // Required validation
  if (element.required && (value === null || value === undefined || value === '')) {
    return { valid: false, message: `${element.label} is required` };
  }

  // Type-specific validation
  if (element.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { valid: false, message: 'Please enter a valid email address' };
    }
  }

  if (element.type === 'url' && value) {
    try {
      new URL(value);
    } catch {
      return { valid: false, message: 'Please enter a valid URL' };
    }
  }

  if (element.type === 'number' && value !== null && value !== undefined) {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return { valid: false, message: 'Please enter a valid number' };
    }
    if (element.minValue !== undefined && numValue < element.minValue) {
      return { valid: false, message: `Value must be at least ${element.minValue}` };
    }
    if (element.maxValue !== undefined && numValue > element.maxValue) {
      return { valid: false, message: `Value must be at most ${element.maxValue}` };
    }
  }

  // Length validation
  if (element.minLength && value && value.length < element.minLength) {
    return { valid: false, message: `Must be at least ${element.minLength} characters` };
  }
  if (element.maxLength && value && value.length > element.maxLength) {
    return { valid: false, message: `Must be at most ${element.maxLength} characters` };
  }

  return { valid: true };
};

/**
 * Generate form schema for export
 */
export const generateFormSchema = (elements: DroppedElement[]) => {
  return {
    version: '1.0',
    elements: elements.map((el) => ({
      id: el.id,
      type: el.type,
      label: el.label,
      required: el.required,
      properties: {
        ...el,
      },
    })),
    createdAt: new Date().toISOString(),
  };
};

/**
 * Find element by ID in nested structure
 */
export const findElementById = (
  elements: DroppedElement[],
  id: string
): DroppedElement | null => {
  for (const element of elements) {
    if (element.id === id) {
      return element;
    }

    // Search in children
    if (element.children) {
      const found = findElementById(element.children, id);
      if (found) return found;
    }

    // Search in columns
    if (element.column1Children) {
      const found = findElementById(element.column1Children, id);
      if (found) return found;
    }
    if (element.column2Children) {
      const found = findElementById(element.column2Children, id);
      if (found) return found;
    }
    if (element.column3Children) {
      const found = findElementById(element.column3Children, id);
      if (found) return found;
    }
  }

  return null;
};

/**
 * Count total elements including nested
 */
export const countElements = (elements: DroppedElement[]): number => {
  let count = 0;
  
  for (const element of elements) {
    count++;
    
    if (element.children) {
      count += countElements(element.children);
    }
    if (element.column1Children) {
      count += countElements(element.column1Children);
    }
    if (element.column2Children) {
      count += countElements(element.column2Children);
    }
    if (element.column3Children) {
      count += countElements(element.column3Children);
    }
  }
  
  return count;
};
