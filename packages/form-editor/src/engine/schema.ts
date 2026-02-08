// Form schema validation and manipulation utilities
import type { FormSchema, FormElement, ValidationRule } from '@formanywhere/shared';

export function validateSchema(schema: FormSchema): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!schema.name || schema.name.trim() === '') {
        errors.push('Form name is required');
    }

    if (schema.elements.length === 0) {
        errors.push('Form must have at least one element');
    }

    // Check for duplicate IDs
    const ids = schema.elements.map((el) => el.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length > 0) {
        errors.push(`Duplicate element IDs: ${duplicates.join(', ')}`);
    }

    // Validate each element
    schema.elements.forEach((element) => {
        if (!element.label || element.label.trim() === '') {
            errors.push(`Element ${element.id} must have a label`);
        }
    });

    return { valid: errors.length === 0, errors };
}

export function serializeSchema(schema: FormSchema): string {
    return JSON.stringify(schema, null, 2);
}

export function parseSchema(json: string): FormSchema {
    const parsed = JSON.parse(json);
    // Convert date strings back to Date objects
    return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
    };
}

export function cloneSchema(schema: FormSchema): FormSchema {
    return parseSchema(serializeSchema(schema));
}
