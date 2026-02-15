/**
 * Form Schema Engine — @formanywhere/form-editor
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
 *
 * @module engine/schema
 */
import type { FormSchema, FormElement, ValidationRule } from '@formanywhere/shared/types';

// ── Internal Helpers ─────────────────────────────────────────────

/**
 * Recursively collects every element ID from a tree of FormElements.
 * Used by `validateSchema` to detect duplicates across **all** nesting levels.
 */
function collectIds(elements: FormElement[], out: string[] = []): string[] {
    for (const el of elements) {
        out.push(el.id);
        if (el.elements) collectIds(el.elements, out);
    }
    return out;
}

/**
 * Recursively validates individual elements in the tree.
 * Pushes human-readable messages into `errors`.
 */
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
 *
 * Checks performed:
 * 1. `name` must be a non-empty string.
 * 2. `elements` must contain at least one entry.
 * 3. Every element ID must be unique (recursively, including nested containers).
 * 4. Every element must have a non-empty `label`.
 *
 * @param schema - The form schema to validate.
 * @returns An object with `valid: boolean` and an `errors` string array.
 *
 * @example
 * ```ts
 * const result = validateSchema(mySchema);
 * if (!result.valid) console.warn(result.errors);
 * ```
 */
export function validateSchema(schema: FormSchema): SchemaValidation {
    const errors: string[] = [];

    if (!schema.name || schema.name.trim() === '') {
        errors.push('Form name is required');
    }

    if (schema.elements.length === 0) {
        errors.push('Form must have at least one element');
    }

    // O(n) duplicate-ID check across the full element tree
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

    // Recurse into nested elements
    validateElements(schema.elements, errors);

    return { valid: errors.length === 0, errors };
}

/**
 * Serialises a schema to a pretty-printed JSON string.
 * Suitable for display in the Schema Dialog and file export.
 *
 * @param schema - The form schema to serialise.
 * @returns Formatted JSON string (2-space indent).
 */
export function serializeSchema(schema: FormSchema): string {
    return JSON.stringify(schema, null, 2);
}

/**
 * Serialises a schema to a compact JSON string (no whitespace).
 * Use this for API transport / storage where size matters.
 *
 * @param schema - The form schema to serialise.
 * @returns Minified JSON string.
 */
export function serializeSchemaCompact(schema: FormSchema): string {
    return JSON.stringify(schema);
}

/**
 * Parses a JSON string into a {@link FormSchema}.
 * Converts ISO-8601 date strings (`createdAt`, `updatedAt`) back to `Date` objects.
 *
 * @param json - Raw JSON string (from file import, API response, etc.).
 * @returns A fully hydrated FormSchema.
 * @throws {SyntaxError} If the input is not valid JSON.
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
 * Creates a deep clone of a FormSchema.
 * Uses the native `structuredClone` API — preserves Date objects
 * and is faster than JSON round-tripping.
 *
 * @param schema - The schema to clone.
 * @returns A new FormSchema instance with no shared references.
 */
export function cloneSchema(schema: FormSchema): FormSchema {
    return structuredClone(schema);
}

/**
 * Shallow-merges updates into an existing schema.
 * Automatically bumps `updatedAt` to the current time.
 *
 * @param schema - The base schema.
 * @param updates - Partial schema fields to merge.
 * @returns A new FormSchema with the merged values.
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
 *
 * @param elements - The element array to search.
 * @param id       - The target element ID.
 * @returns The matching FormElement, or `undefined` if not found.
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
 *
 * @param elements - Root element array.
 * @returns Total element count.
 */
export function countElements(elements: FormElement[]): number {
    let count = 0;
    for (const el of elements) {
        count += 1;
        if (el.elements) count += countElements(el.elements);
    }
    return count;
}
