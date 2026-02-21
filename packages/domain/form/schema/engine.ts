/**
 * Form Schema Engine — @formanywhere/domain
 *
 * Validation, serialisation, and manipulation utilities for the FormSchema.
 *
 * ## Schema Structure (defined in @formanywhere/shared/types)
 *
 * ```
 * FormSchema
 * ├── id          — Unique form identifier (nanoid)
 * ├── name        — Human-readable form title
 * ├── description — Optional form description
 * ├── elements[]  — Flat + nested tree of FormElement nodes
 * │   ├── id            — Unique element identifier
 * │   ├── type          — FormElementType union
 * │   │                   Layout:  container | grid | section | card | grid-column | divider | spacer | heading | logo | text-block
 * │   │                   Input:   text | textarea | email | phone | number | url
 * │   │                   Choice:  select | radio | checkbox | switch
 * │   │                   Date:    date | time
 * │   │                   Advanced: file | rating | signature
 * │   ├── label          — Display label
 * │   ├── required?      — Whether submission requires a value
 * │   ├── placeholder?   — Input placeholder text
 * │   ├── description?   — Helper / descriptive text
 * │   ├── validation?    — ValidationRule[] (minLength, maxLength, pattern, min, max)
 * │   ├── conditionalLogic? — ConditionalRule[] evaluated by form-runtime
 * │   ├── options?       — { label, value }[] for select / radio / checkbox
 * │   ├── elements?      — Nested children (layout containers only)
 * │   └── [key: string]  — Plugin-specific properties (width, customClass, etc.)
 * ├── settings
 * │   ├── submitButtonText
 * │   ├── successMessage
 * │   ├── redirectUrl?
 * │   ├── multiPage?
 * │   └── pages?[]       — { id, title, elements: string[] }
 * ├── createdAt   — Date object
 * └── updatedAt   — Date object
 * ```
 */
import type { FormSchema, FormElement } from '@formanywhere/shared/types';

// ── Internal Helpers ─────────────────────────────────────────────

function collectIds(elements: FormElement[], out: string[] = []): string[] {
    for (const el of elements) {
        out.push(el.id);
        if (el.elements) collectIds(el.elements, out);
    }
    return out;
}

function validateElements(elements: FormElement[], errors: string[]): void {
    for (const el of elements) {
        if (!el.label || el.label.trim() === '') {
            errors.push(`Element ${el.id} must have a label`);
        }
        if (el.elements) validateElements(el.elements, errors);
    }
}

// ── Public API ───────────────────────────────────────────────────

/** Result returned by {@link validateSchema}. */
export interface SchemaValidation {
    valid: boolean;
    errors: string[];
}

/**
 * Validates a {@link FormSchema} for structural correctness.
 * Checks: non-empty name, at least one element, no duplicate IDs, all elements have labels.
 */
export function validateSchema(schema: FormSchema): SchemaValidation {
    const errors: string[] = [];

    if (!schema.name || schema.name.trim() === '') {
        errors.push('Form name is required');
    }

    if (schema.elements.length === 0) {
        errors.push('Form must have at least one element');
    }

    const allIds = collectIds(schema.elements);
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    for (const id of allIds) {
        if (seen.has(id)) duplicates.add(id);
        else seen.add(id);
    }
    if (duplicates.size > 0) {
        errors.push(`Duplicate element IDs: ${[...duplicates].join(', ')}`);
    }

    validateElements(schema.elements, errors);

    return { valid: errors.length === 0, errors };
}

/**
 * Serialises a schema to a pretty-printed JSON string.
 */
export function serializeSchema(schema: FormSchema): string {
    return JSON.stringify(schema, null, 2);
}

/**
 * Serialises a schema to a compact JSON string (no whitespace).
 */
export function serializeSchemaCompact(schema: FormSchema): string {
    return JSON.stringify(schema);
}

/**
 * Parses a JSON string into a {@link FormSchema}.
 * Converts ISO-8601 date strings back to `Date` objects.
 */
export function parseSchema(json: string): FormSchema {
    const parsed = JSON.parse(json);
    return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
    };
}

/**
 * Creates a deep clone of a FormSchema using `structuredClone`.
 */
export function cloneSchema(schema: FormSchema): FormSchema {
    return structuredClone(schema);
}

/**
 * Shallow-merges updates into an existing schema.
 * Automatically bumps `updatedAt` to the current time.
 */
export function mergeSchema(
    schema: FormSchema,
    updates: Partial<Omit<FormSchema, 'id' | 'createdAt'>>,
): FormSchema {
    return {
        ...schema,
        ...updates,
        updatedAt: new Date(),
    };
}

/**
 * Recursively finds an element by ID within the schema tree.
 */
export function findElementById(
    elements: FormElement[],
    id: string,
): FormElement | undefined {
    for (const el of elements) {
        if (el.id === id) return el;
        if (el.elements) {
            const found = findElementById(el.elements, id);
            if (found) return found;
        }
    }
    return undefined;
}

/**
 * Counts total elements in the schema, including nested children.
 */
export function countElements(elements: FormElement[]): number {
    let count = 0;
    for (const el of elements) {
        count += 1;
        if (el.elements) count += countElements(el.elements);
    }
    return count;
}
