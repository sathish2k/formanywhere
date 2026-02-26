/**
 * Schema Validation Tests — @formanywhere/domain
 *
 * Tests that all 5 complex forms pass structural validation, and that
 * intentional mutations cause correct failures.
 */
import { describe, it, expect } from 'vitest';
import { validateSchema } from '../schema/engine';
import {
    ALL_FORM_FIXTURES,
    createEmployeeOnboardingForm,
    collectAllElements,
} from './complex-forms.fixtures';
import type { FormSchema, FormElement } from './test-types';

// ─── All Forms Pass Validation ───────────────────────────────────────────────

describe('Schema Validation — All Complex Forms', () => {
    for (const { name, create } of ALL_FORM_FIXTURES) {
        it(`${name}: passes validateSchema()`, () => {
            const form = create();
            const result = validateSchema(form);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it(`${name}: has a non-empty name`, () => {
            const form = create();
            expect(form.name.trim().length).toBeGreaterThan(0);
        });

        it(`${name}: has at least one element`, () => {
            const form = create();
            expect(form.elements.length).toBeGreaterThan(0);
        });

        it(`${name}: has no duplicate element IDs`, () => {
            const form = create();
            const allElements = collectAllElements(form.elements);
            const ids = allElements.map((el) => el.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(ids.length);
        });

        it(`${name}: all elements have labels`, () => {
            const form = create();
            const allElements = collectAllElements(form.elements);
            for (const el of allElements) {
                expect(el.label, `Element ${el.id} missing label`).toBeTruthy();
            }
        });

        it(`${name}: has valid settings`, () => {
            const form = create();
            expect(form.settings.submitButtonText).toBeTruthy();
            expect(form.settings.successMessage).toBeTruthy();
        });

        it(`${name}: has valid dates`, () => {
            const form = create();
            expect(form.createdAt).toBeInstanceOf(Date);
            expect(form.updatedAt).toBeInstanceOf(Date);
        });
    }
});

// ─── Intentional Mutation Tests ──────────────────────────────────────────────

describe('Schema Validation — Failure Cases', () => {
    it('fails with empty form name', () => {
        const form = createEmployeeOnboardingForm();
        form.name = '';
        const result = validateSchema(form);
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.includes('name'))).toBe(true);
    });

    it('fails with no elements', () => {
        const form = createEmployeeOnboardingForm();
        form.elements = [];
        const result = validateSchema(form);
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.includes('element'))).toBe(true);
    });

    it('fails with duplicate element IDs', () => {
        const form = createEmployeeOnboardingForm();
        // Inject a duplicate ID
        const flatElements = collectAllElements(form.elements);
        if (flatElements.length >= 2) {
            flatElements[1].id = flatElements[0].id;
        }
        const result = validateSchema(form);
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.includes('Duplicate'))).toBe(true);
    });

    it('fails when an element has empty label', () => {
        const form = createEmployeeOnboardingForm();
        const allElements = collectAllElements(form.elements);
        const firstField = allElements.find((el) => el.type === 'text');
        if (firstField) firstField.label = '';
        const result = validateSchema(form);
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.includes('label'))).toBe(true);
    });
});
