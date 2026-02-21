/**
 * Element Registry — @formanywhere/domain
 *
 * Central registry for all form element definitions.
 * Framework-agnostic: no UI or SolidJS dependencies.
 *
 * To add a new element:
 *   1. Create a definition file in domain/form/elements/
 *   2. Import and add it to ALL_ELEMENTS below
 */
import type { FormElementType } from '@formanywhere/shared/types';
import type { ElementDefinition } from './types';

import { textElement, emailElement, phoneElement, numberElement, urlElement } from './text-input/text-input.properties';
import { textareaElement } from './textarea/textarea.properties';
import { selectElement } from './select/select.properties';
import { checkboxElement } from './checkbox/checkbox.properties';
import { radioElement } from './radio/radio.properties';
import { switchElement } from './switch/switch.properties';
import { dateElement } from './date/date.properties';
import { timeElement } from './time/time.properties';
import { fileElement } from './file/file.properties';
import { ratingElement } from './rating/rating.properties';
import { signatureElement } from './signature/signature.properties';
import {
    containerElement, gridElement, sectionElement, cardElement,
    gridColumnElement, dividerElement, spacerElement,
    headingElement, logoElement, textBlockElement,
} from './layout/layout.properties';

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

// ── Element classification & type mappings ────────────────────────────────

/** All element types that are layout/structural containers (not interactive form fields). */
export const LAYOUT_ELEMENT_TYPES = [
    'container', 'grid', 'grid-column', 'section', 'card',
    'heading', 'text-block', 'divider', 'spacer', 'logo',
] as const;

/** All element types that are interactive form fields. */
export const FIELD_ELEMENT_TYPES = [
    'text', 'email', 'phone', 'number', 'url',
    'textarea', 'select', 'checkbox', 'radio', 'switch',
    'date', 'time', 'file', 'rating', 'signature',
] as const;

export type LayoutElementType = (typeof LAYOUT_ELEMENT_TYPES)[number];
export type FieldElementType = (typeof FIELD_ELEMENT_TYPES)[number];

/**
 * Returns true if the given element type is a layout (structural) type,
 * not an interactive form field.
 */
export function isLayoutElement(type: string): boolean {
    return (LAYOUT_ELEMENT_TYPES as readonly string[]).includes(type);
}

/**
 * Maps a form element type to its HTML input `type` attribute.
 * Returns undefined for non-input types (layout, textarea, select, etc.).
 */
export const ELEMENT_INPUT_TYPE_MAP: Partial<Record<string, string>> = {
    text: 'text',
    email: 'email',
    phone: 'tel',
    number: 'number',
    url: 'url',
    date: 'date',
    time: 'time',
};
