/**
 * Element Registry
 *
 * Central registry for all form element plugins.
 * Toolbar and PropertiesPanel read from this registry
 * instead of hardcoding element metadata.
 *
 * To add a new element:
 *   1. Create a folder in elements/<name>/index.ts
 *   2. Export an ElementDefinition
 *   3. Import and register it here
 */
import type { FormElementType } from '@formanywhere/shared/types';
import type { ElementDefinition } from './types';

// ── Import all element definitions ──
import { textElement, emailElement, phoneElement, numberElement, urlElement } from './text-input';
import { textareaElement } from './textarea';
import { selectElement } from './select';
import { checkboxElement } from './checkbox';
import { radioElement } from './radio';
import { switchElement } from './switch';
import { dateElement } from './date';
import { timeElement } from './time';
import { fileElement } from './file';
import { ratingElement } from './rating';
import { signatureElement } from './signature';
import {
    containerElement, gridElement, sectionElement, cardElement,
    gridColumnElement, dividerElement, spacerElement,
    headingElement, logoElement, textBlockElement,
} from './layout';

// ── Registration ──
const ALL_ELEMENTS: ElementDefinition[] = [
    // Layout
    containerElement, gridElement, sectionElement, cardElement,
    gridColumnElement, dividerElement, spacerElement,
    headingElement, logoElement, textBlockElement,
    // Text Inputs
    textElement, textareaElement, emailElement, phoneElement, numberElement, urlElement,
    // Choice
    selectElement, radioElement, checkboxElement, switchElement,
    // Date & Time
    dateElement, timeElement,
    // Advanced
    fileElement, ratingElement, signatureElement,
];

/** Map for O(1) type → definition lookup */
const elementMap = new Map<string, ElementDefinition>(
    ALL_ELEMENTS.map((el) => [el.type, el])
);

// ── Category labels (display order) ──
const CATEGORY_LABELS: Record<string, string> = {
    layout: 'Layout',
    'text-inputs': 'Text Inputs',
    choice: 'Choice',
    'date-time': 'Date & Time',
    advanced: 'Advanced',
};

const CATEGORY_ORDER: string[] = ['layout', 'text-inputs', 'choice', 'date-time', 'advanced'];

// ── Public API ──

/** Get a single element definition by type */
export function getElement(type: FormElementType | string): ElementDefinition | undefined {
    return elementMap.get(type);
}

/** Get all registered elements */
export function getAllElements(): ElementDefinition[] {
    return ALL_ELEMENTS;
}

/** Get elements grouped by category (for Toolbar) */
export function getElementsByCategory(): Array<{ key: string; title: string; items: ElementDefinition[] }> {
    return CATEGORY_ORDER.map((key) => ({
        key,
        title: CATEGORY_LABELS[key] || key,
        items: ALL_ELEMENTS.filter((el) => el.category === key),
    })).filter((cat) => cat.items.length > 0);
}

/** Register a custom element at runtime (for third-party plugins) */
export function registerElement(definition: ElementDefinition): void {
    ALL_ELEMENTS.push(definition);
    elementMap.set(definition.type, definition);
}
