/**
 * Element Property Completeness Tests — @formanywhere/domain
 *
 * Verifies that every element across all 5 complex forms has all required
 * properties per its type: id, label, type, and type-specific attributes.
 */
import { describe, it, expect } from 'vitest';
import { LAYOUT_ELEMENT_TYPES, FIELD_ELEMENT_TYPES } from '../elements/registry';
import {
    ALL_FORM_FIXTURES,
    collectAllElements,
} from './complex-forms.fixtures';
import type { FormElement, ValidationRule, ConditionalRule } from './test-types';

// ─── Required Base Properties ────────────────────────────────────────────────

describe('Element Properties — Base Requirements', () => {
    for (const { name, create } of ALL_FORM_FIXTURES) {
        describe(name, () => {
            it('every element has a non-empty id', () => {
                const form = create();
                const elements = collectAllElements(form.elements);
                for (const el of elements) {
                    expect(el.id, `Missing id`).toBeTruthy();
                    expect(typeof el.id).toBe('string');
                    expect(el.id.trim().length).toBeGreaterThan(0);
                }
            });

            it('every element has a valid type', () => {
                const form = create();
                const elements = collectAllElements(form.elements);
                const allTypes = [...LAYOUT_ELEMENT_TYPES, ...FIELD_ELEMENT_TYPES];
                for (const el of elements) {
                    expect(allTypes, `Unknown type: ${el.type} on element ${el.id}`).toContain(el.type);
                }
            });

            it('every element has a label', () => {
                const form = create();
                const elements = collectAllElements(form.elements);
                for (const el of elements) {
                    expect(el.label, `Element ${el.id} missing label`).toBeTruthy();
                }
            });
        });
    }
});

// ─── Type-Specific Property Checks ───────────────────────────────────────────

describe('Element Properties — Type-Specific', () => {
    for (const { name, create } of ALL_FORM_FIXTURES) {
        describe(name, () => {
            let elements: FormElement[];

            it('setup', () => {
                elements = collectAllElements(create().elements);
                expect(elements.length).toBeGreaterThan(0);
            });

            // Select/Radio/Checkbox must have options
            it('select/radio elements have options array', () => {
                const form = create();
                const els = collectAllElements(form.elements);
                const choiceElements = els.filter((el) => ['select', 'radio'].includes(el.type));
                for (const el of choiceElements) {
                    // Options can be empty for dynamically populated fields
                    expect(Array.isArray(el.options), `${el.id} should have options array`).toBe(true);
                }
            });

            it('options have label and value', () => {
                const form = create();
                const els = collectAllElements(form.elements);
                const withOptions = els.filter((el) => el.options && el.options.length > 0);
                for (const el of withOptions) {
                    for (const opt of el.options!) {
                        expect(opt.label, `Option in ${el.id} missing label`).toBeDefined();
                        expect(opt.value, `Option in ${el.id} missing value`).toBeDefined();
                        expect(typeof opt.label).toBe('string');
                        expect(typeof opt.value).toBe('string');
                    }
                }
            });

            // Layout elements with children
            it('layout elements with children have elements array', () => {
                const form = create();
                const els = collectAllElements(form.elements);
                const layoutTypes = new Set(LAYOUT_ELEMENT_TYPES);
                const layouts = els.filter((el) => layoutTypes.has(el.type as any) && el.elements);
                for (const el of layouts) {
                    expect(Array.isArray(el.elements), `${el.id} should have elements array`).toBe(true);
                }
            });

            // Validation rules structure
            it('elements with validation have valid ValidationRule[]', () => {
                const form = create();
                const els = collectAllElements(form.elements);
                const withValidation = els.filter((el) => el.validation && el.validation.length > 0);
                for (const el of withValidation) {
                    for (const rule of el.validation!) {
                        expect(rule.type, `Validation rule in ${el.id} missing type`).toBeTruthy();
                        expect(rule.message, `Validation rule in ${el.id} missing message`).toBeTruthy();
                        expect(['required', 'minLength', 'maxLength', 'pattern', 'min', 'max', 'email', 'url', 'custom'])
                            .toContain(rule.type);
                    }
                }
            });

            // Conditional logic structure
            it('elements with conditionalLogic have valid ConditionalRule[]', () => {
                const form = create();
                const els = collectAllElements(form.elements);
                const withConditions = els.filter((el) => el.conditionalLogic && (el.conditionalLogic as ConditionalRule[]).length > 0);
                for (const el of withConditions) {
                    for (const rule of el.conditionalLogic as ConditionalRule[]) {
                        expect(rule.field, `Condition in ${el.id} missing field`).toBeTruthy();
                        expect(rule.operator, `Condition in ${el.id} missing operator`).toBeTruthy();
                        expect(rule.action, `Condition in ${el.id} missing action`).toBeTruthy();
                        expect(['equals', 'notEquals', 'contains', 'greaterThan', 'lessThan']).toContain(rule.operator);
                        expect(['show', 'hide', 'require']).toContain(rule.action);
                    }
                }
            });
        });
    }
});

// ─── Advanced Element Type-Specific Checks ───────────────────────────────────

describe('Element Properties — Advanced Type Checks', () => {
    for (const { name, create } of ALL_FORM_FIXTURES) {
        describe(name, () => {
            it('date elements with disableFutureDates/disablePastDates have boolean values', () => {
                const form = create();
                const els = collectAllElements(form.elements);
                const dateEls = els.filter((el) => el.type === 'date');
                for (const el of dateEls) {
                    if (el.disableFutureDates !== undefined) {
                        expect(typeof el.disableFutureDates).toBe('boolean');
                    }
                    if (el.disablePastDates !== undefined) {
                        expect(typeof el.disablePastDates).toBe('boolean');
                    }
                }
            });

            it('file elements with maxSize have numeric value', () => {
                const form = create();
                const els = collectAllElements(form.elements);
                const fileEls = els.filter((el) => el.type === 'file');
                for (const el of fileEls) {
                    if (el.maxSize !== undefined) {
                        expect(typeof el.maxSize).toBe('number');
                        expect(el.maxSize).toBeGreaterThan(0);
                    }
                }
            });

            it('rating elements with maxStars have valid numeric value', () => {
                const form = create();
                const els = collectAllElements(form.elements);
                const ratingEls = els.filter((el) => el.type === 'rating');
                for (const el of ratingEls) {
                    if (el.maxStars !== undefined) {
                        expect(typeof el.maxStars).toBe('number');
                        expect(el.maxStars).toBeGreaterThan(0);
                        expect(el.maxStars).toBeLessThanOrEqual(10);
                    }
                }
            });

            it('time elements with min/max have valid time strings', () => {
                const form = create();
                const els = collectAllElements(form.elements);
                const timeEls = els.filter((el) => el.type === 'time');
                const timeRegex = /^\d{2}:\d{2}$/;
                for (const el of timeEls) {
                    if (el.min !== undefined) {
                        expect(String(el.min)).toMatch(timeRegex);
                    }
                    if (el.max !== undefined) {
                        expect(String(el.max)).toMatch(timeRegex);
                    }
                }
            });

            it('required elements have required=true', () => {
                const form = create();
                const els = collectAllElements(form.elements);
                const requiredEls = els.filter((el) => el.required === true);
                expect(requiredEls.length).toBeGreaterThan(0);
                for (const el of requiredEls) {
                    expect(el.required).toBe(true);
                }
            });
        });
    }
});

// ─── Coverage Stats ──────────────────────────────────────────────────────────

describe('Element Type Coverage', () => {
    it('all 26 element types are used across all forms', () => {
        const allTypes = new Set<string>();
        for (const { create } of ALL_FORM_FIXTURES) {
            const form = create();
            const elements = collectAllElements(form.elements);
            for (const el of elements) {
                allTypes.add(el.type);
            }
        }

        const expectedTypes = [...LAYOUT_ELEMENT_TYPES, ...FIELD_ELEMENT_TYPES];
        for (const type of expectedTypes) {
            expect(allTypes.has(type), `Missing element type: ${type}`).toBe(true);
        }
    });
});
