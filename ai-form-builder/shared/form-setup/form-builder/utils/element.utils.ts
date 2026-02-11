/**
 * Form Element Utilities
 * Helper functions for creating and manipulating form elements
 */

import { FORM_ELEMENTS } from '../elements/elements.types';
import type { DroppedElement, FormElementType } from '../form-builder.configuration';
import { elementDefaults } from '../form-builder.configuration';

/**
 * Create a new dropped element from element type
 */
export function createDroppedElement(elementType: FormElementType): DroppedElement | null {
  const definition = FORM_ELEMENTS.find((el) => el.type === elementType);
  if (!definition) return null;

  const defaults = elementDefaults[elementType] || {};

  return {
    id: `${elementType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: elementType,
    label: definition.label,
    icon: definition.icon,
    color: definition.color,
    ...defaults,
  } as DroppedElement;
}

/**
 * Find an element by ID recursively
 */
export function findElementById(elements: DroppedElement[], id: string): DroppedElement | null {
  for (const element of elements) {
    if (element.id === id) {
      return element;
    }

    // Search in children (for sections and cards)
    if (element.children) {
      const found = findElementById(element.children, id);
      if (found) return found;
    }

    // Search in grid items
    if (element.gridItems) {
      for (const gridItem of element.gridItems) {
        const found = findElementById(gridItem.children, id);
        if (found) return found;
      }
    }
  }

  return null;
}

/**
 * Update an element by ID recursively
 */
export function updateElementById(
  elements: DroppedElement[],
  id: string,
  updates: Partial<DroppedElement>
): DroppedElement[] {
  return elements.map((el) => {
    if (el.id === id) {
      return { ...el, ...updates };
    }

    // Check nested children
    if (el.children) {
      return { ...el, children: updateElementById(el.children, id, updates) };
    }

    // Check grid items
    if (el.gridItems) {
      return {
        ...el,
        gridItems: el.gridItems.map((gridItem) => ({
          ...gridItem,
          children: updateElementById(gridItem.children, id, updates),
        })),
      };
    }

    return el;
  });
}

/**
 * Remove an element by ID recursively
 */
export function removeElementById(elements: DroppedElement[], id: string): DroppedElement[] {
  return elements
    .filter((e) => e.id !== id)
    .map((el) => {
      if (el.children) {
        return { ...el, children: removeElementById(el.children, id) };
      }

      if (el.gridItems) {
        return {
          ...el,
          gridItems: el.gridItems.map((gridItem) => ({
            ...gridItem,
            children: removeElementById(gridItem.children, id),
          })),
        };
      }

      return el;
    });
}

/**
 * Check if element is a container that can have children
 */
export function isContainer(elementType: FormElementType): boolean {
  return ['section', 'card', 'grid-layout'].includes(elementType);
}

/**
 * Check if element is an input field
 */
export function isInputField(elementType: FormElementType): boolean {
  return [
    'text-input',
    'email-input',
    'number-input',
    'textarea',
    'select',
    'checkbox',
    'radio',
    'date-picker',
    'file-upload',
  ].includes(elementType);
}

/**
 * Generate field name from label
 */
export function generateFieldName(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}
