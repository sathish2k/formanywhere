/**
 * Field Validator Tests — @formanywhere/domain
 *
 * Tests validateField() and validateForm() from the validators module
 * against all element types with edge cases.
 */
import { describe, it, expect } from 'vitest';
import { validateField, validateForm } from '../validators';
import {
    ALL_FORM_FIXTURES,
    createEmployeeOnboardingForm,
    createHealthcareIntakeForm,
    collectAllElements,
} from './complex-forms.fixtures';
import type { FormElement } from './test-types';

// ─── validateField — Required Checks ─────────────────────────────────────────

describe('validateField — Required Checks', () => {
    it('returns error for required field with empty value', () => {
        const el: FormElement = { id: 'name', type: 'text', label: 'Name', required: true };
        expect(validateField(el, '')).toBeTruthy();
        expect(validateField(el, undefined)).toBeTruthy();
        expect(validateField(el, null)).toBeTruthy();
    });

    it('returns null for required field with valid value', () => {
        const el: FormElement = { id: 'name', type: 'text', label: 'Name', required: true };
        expect(validateField(el, 'John')).toBeNull();
    });

    it('returns null for optional field with empty value', () => {
        const el: FormElement = { id: 'name', type: 'text', label: 'Name' };
        expect(validateField(el, '')).toBeNull();
        expect(validateField(el, undefined)).toBeNull();
    });
});

// ─── validateField — Email Type ──────────────────────────────────────────────

describe('validateField — Email', () => {
    const emailEl: FormElement = { id: 'email', type: 'email', label: 'Email', required: true };

    it('accepts valid emails', () => {
        expect(validateField(emailEl, 'user@example.com')).toBeNull();
        expect(validateField(emailEl, 'a.b@c.d.com')).toBeNull();
    });

    it('rejects invalid emails', () => {
        expect(validateField(emailEl, 'not-email')).toBeTruthy();
        expect(validateField(emailEl, 'missing@')).toBeTruthy();
        expect(validateField(emailEl, '@missing.com')).toBeTruthy();
    });
});

// ─── validateField — Number Type ─────────────────────────────────────────────

describe('validateField — Number', () => {
    const numEl: FormElement = { id: 'age', type: 'number', label: 'Age', required: true };

    it('accepts valid numbers', () => {
        expect(validateField(numEl, '25')).toBeNull();
        expect(validateField(numEl, '0')).toBeNull();
        expect(validateField(numEl, '99.5')).toBeNull();
    });

    it('rejects non-numeric values', () => {
        expect(validateField(numEl, 'abc')).toBeTruthy();
        expect(validateField(numEl, 'twelve')).toBeTruthy();
    });
});

// ─── validateField — Validation Rules ────────────────────────────────────────

describe('validateField — Custom Validation Rules', () => {
    it('minLength validation', () => {
        const el: FormElement = {
            id: 'desc', type: 'text', label: 'Description',
            validation: [{ type: 'minLength', value: 5, message: 'Too short' }],
        };
        expect(validateField(el, 'Hi')).toBe('Too short');
        expect(validateField(el, 'Hello World')).toBeNull();
    });

    it('maxLength validation', () => {
        const el: FormElement = {
            id: 'code', type: 'text', label: 'Code',
            validation: [{ type: 'maxLength', value: 10, message: 'Too long' }],
        };
        expect(validateField(el, 'ABCDEFGHIJK')).toBe('Too long');
        expect(validateField(el, 'ABC')).toBeNull();
    });

    it('min number validation', () => {
        const el: FormElement = {
            id: 'qty', type: 'number', label: 'Quantity',
            validation: [{ type: 'min', value: 1, message: 'At least 1' }],
        };
        expect(validateField(el, '0')).toBe('At least 1');
        expect(validateField(el, '5')).toBeNull();
    });

    it('max number validation', () => {
        const el: FormElement = {
            id: 'qty', type: 'number', label: 'Quantity',
            validation: [{ type: 'max', value: 100, message: 'Max 100' }],
        };
        expect(validateField(el, '150')).toBe('Max 100');
        expect(validateField(el, '50')).toBeNull();
    });

    it('pattern validation', () => {
        const el: FormElement = {
            id: 'zip', type: 'text', label: 'ZIP',
            validation: [{ type: 'pattern', value: '^\\d{5}$', message: 'Invalid ZIP' }],
        };
        expect(validateField(el, 'ABCDE')).toBe('Invalid ZIP');
        expect(validateField(el, '12345')).toBeNull();
    });

    it('multiple validation rules (first error wins)', () => {
        const el: FormElement = {
            id: 'pwd', type: 'text', label: 'Password',
            validation: [
                { type: 'minLength', value: 8, message: 'Min 8 chars' },
                { type: 'maxLength', value: 50, message: 'Max 50 chars' },
            ],
        };
        expect(validateField(el, 'abc')).toBe('Min 8 chars');
        expect(validateField(el, 'abcdefgh')).toBeNull();
    });
});

// ─── validateForm — Full Form Validation ─────────────────────────────────────

describe('validateForm — Complex Forms', () => {
    it('Employee Onboarding fails with empty values', () => {
        const form = createEmployeeOnboardingForm();
        const result = validateForm(form, {});
        expect(result.valid).toBe(false);
        expect(Object.keys(result.errors).length).toBeGreaterThan(0);
    });

    it('Employee Onboarding: all required fields show errors', () => {
        const form = createEmployeeOnboardingForm();
        const result = validateForm(form, {});
        // Should have errors for firstName, lastName, workEmail, phoneNumber, department, roleLevel, startDate, salary, resume, idDocument, employeeSignature
        expect(result.errors['firstName']).toBeTruthy();
        expect(result.errors['lastName']).toBeTruthy();
        expect(result.errors['workEmail']).toBeTruthy();
        expect(result.errors['department']).toBeTruthy();
    });

    it('Healthcare Intake: validates required fields', () => {
        const form = createHealthcareIntakeForm();
        const result = validateForm(form, {});
        expect(result.valid).toBe(false);
        expect(result.errors['patFirstName']).toBeTruthy();
        expect(result.errors['dateOfBirth']).toBeTruthy();
        expect(result.errors['gender']).toBeTruthy();
    });

    it('Healthcare Intake: passes with complete valid data', () => {
        const form = createHealthcareIntakeForm();
        const allElements = collectAllElements(form.elements);
        const values: Record<string, unknown> = {};
        // Fill all required fields
        for (const el of allElements) {
            if (el.required) {
                switch (el.type) {
                    case 'email': values[el.id] = 'test@example.com'; break;
                    case 'phone': values[el.id] = '+1-555-0000'; break;
                    case 'date': values[el.id] = '2025-01-01'; break;
                    case 'time': values[el.id] = '10:00'; break;
                    case 'rating': values[el.id] = '5'; break;
                    case 'file': values[el.id] = 'file-data.pdf'; break;
                    case 'signature': values[el.id] = 'signature-data'; break;
                    case 'switch':
                    case 'checkbox': values[el.id] = 'true'; break;
                    case 'radio':
                    case 'select':
                        values[el.id] = el.options?.[0]?.value ?? 'option1';
                        break;
                    case 'textarea':
                        values[el.id] = 'This is a sufficiently long text response for validation testing purposes.';
                        break;
                    default: values[el.id] = 'valid-value'; break;
                }
            }
        }
        const result = validateForm(form, values);
        expect(result.valid).toBe(true);
    });

    for (const { name, create } of ALL_FORM_FIXTURES) {
        it(`${name}: validateForm returns errors as Record<string, string>`, () => {
            const form = create();
            const result = validateForm(form, {});
            expect(typeof result.valid).toBe('boolean');
            expect(typeof result.errors).toBe('object');
            for (const [key, val] of Object.entries(result.errors)) {
                expect(typeof key).toBe('string');
                expect(typeof val).toBe('string');
            }
        });
    }
});
