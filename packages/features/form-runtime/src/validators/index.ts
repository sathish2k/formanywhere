import type { FormSchema, FormElement, ValidationRule } from '@formanywhere/shared/types';

export interface ValidationResult {
    valid: boolean;
    errors: Record<string, string>;
}

export function validateField(
    element: FormElement,
    value: unknown
): string | null {
    // Required check
    if (element.required && (value === undefined || value === null || value === '')) {
        return `${element.label} is required`;
    }

    // Type-specific validation
    if (element.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(value))) {
            return 'Please enter a valid email address';
        }
    }

    if (element.type === 'number' && value) {
        if (isNaN(Number(value))) {
            return 'Please enter a valid number';
        }
    }

    // Custom validation rules
    if (element.validation) {
        for (const rule of element.validation) {
            const error = validateRule(rule, value);
            if (error) return error;
        }
    }

    return null;
}

function validateRule(rule: ValidationRule, value: unknown): string | null {
    const strValue = String(value ?? '');
    const numValue = Number(value);

    switch (rule.type) {
        case 'minLength':
            if (strValue.length < Number(rule.value)) {
                return rule.message;
            }
            break;
        case 'maxLength':
            if (strValue.length > Number(rule.value)) {
                return rule.message;
            }
            break;
        case 'min':
            if (numValue < Number(rule.value)) {
                return rule.message;
            }
            break;
        case 'max':
            if (numValue > Number(rule.value)) {
                return rule.message;
            }
            break;
        case 'pattern':
            if (!new RegExp(String(rule.value)).test(strValue)) {
                return rule.message;
            }
            break;
    }

    return null;
}

/**
 * Recursively collects validation errors for all elements,
 * including those nested inside layout containers.
 */
function collectFieldErrors(
    elements: FormElement[],
    values: Record<string, unknown>,
    errors: Record<string, string>,
): void {
    for (const element of elements) {
        // Validate the element itself (skip pure layout containers)
        const error = validateField(element, values[element.id]);
        if (error) {
            errors[element.id] = error;
        }
        // Recurse into nested children (grid, section, card, container, etc.)
        if (element.elements) {
            collectFieldErrors(element.elements, values, errors);
        }
    }
}

export function validateForm(
    schema: FormSchema,
    values: Record<string, unknown>
): ValidationResult {
    const errors: Record<string, string> = {};
    collectFieldErrors(schema.elements, values, errors);
    return { valid: Object.keys(errors).length === 0, errors };
}
