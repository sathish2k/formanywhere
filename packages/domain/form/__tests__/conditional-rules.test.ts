/**
 * Conditional Rule Tests — @formanywhere/domain
 *
 * Tests evaluateCondition() and evaluateAllConditions() with all operators.
 */
import { describe, it, expect } from 'vitest';
import { evaluateCondition, evaluateAllConditions } from '../rules/conditional';
import {
    ALL_FORM_FIXTURES,
    collectAllElements,
} from './complex-forms.fixtures';
import type { ConditionalRule } from './test-types';

// ─── Individual Operator Tests ───────────────────────────────────────────────

describe('evaluateCondition — Operators', () => {
    it('equals: matches when values are equal', () => {
        const rule: ConditionalRule = { field: 'role', operator: 'equals', value: 'admin', action: 'show' };
        expect(evaluateCondition(rule, { role: 'admin' })).toBe(true);
        expect(evaluateCondition(rule, { role: 'user' })).toBe(false);
    });

    it('notEquals: matches when values differ', () => {
        const rule: ConditionalRule = { field: 'role', operator: 'notEquals', value: 'admin', action: 'show' };
        expect(evaluateCondition(rule, { role: 'user' })).toBe(true);
        expect(evaluateCondition(rule, { role: 'admin' })).toBe(false);
    });

    it('contains: matches substring', () => {
        const rule: ConditionalRule = { field: 'name', operator: 'contains', value: 'John', action: 'show' };
        expect(evaluateCondition(rule, { name: 'John Doe' })).toBe(true);
        expect(evaluateCondition(rule, { name: 'Jane Doe' })).toBe(false);
    });

    it('greaterThan: numeric comparison', () => {
        const rule: ConditionalRule = { field: 'age', operator: 'greaterThan', value: 18, action: 'show' };
        expect(evaluateCondition(rule, { age: 25 })).toBe(true);
        expect(evaluateCondition(rule, { age: 15 })).toBe(false);
        expect(evaluateCondition(rule, { age: 18 })).toBe(false);
    });

    it('lessThan: numeric comparison', () => {
        const rule: ConditionalRule = { field: 'score', operator: 'lessThan', value: 50, action: 'show' };
        expect(evaluateCondition(rule, { score: 30 })).toBe(true);
        expect(evaluateCondition(rule, { score: 60 })).toBe(false);
        expect(evaluateCondition(rule, { score: 50 })).toBe(false);
    });

    it('handles missing field values', () => {
        const rule: ConditionalRule = { field: 'missing', operator: 'equals', value: 'val', action: 'show' };
        expect(evaluateCondition(rule, {})).toBe(false);
    });

    it('handles string numeric comparison (greaterThan)', () => {
        const rule: ConditionalRule = { field: 'rating', operator: 'greaterThan', value: '3', action: 'show' };
        expect(evaluateCondition(rule, { rating: '5' })).toBe(true);
        expect(evaluateCondition(rule, { rating: '2' })).toBe(false);
    });
});

// ─── evaluateAllConditions ───────────────────────────────────────────────────

describe('evaluateAllConditions', () => {
    it('returns true for empty rules array', () => {
        expect(evaluateAllConditions([], {})).toBe(true);
    });

    it('AND logic: all conditions must pass', () => {
        const rules: ConditionalRule[] = [
            { field: 'role', operator: 'equals', value: 'admin', action: 'show' },
            { field: 'age', operator: 'greaterThan', value: 18, action: 'show' },
        ];
        expect(evaluateAllConditions(rules, { role: 'admin', age: 25 })).toBe(true);
        expect(evaluateAllConditions(rules, { role: 'admin', age: 15 })).toBe(false);
        expect(evaluateAllConditions(rules, { role: 'user', age: 25 })).toBe(false);
    });

    it('single rule works as expected', () => {
        const rules: ConditionalRule[] = [
            { field: 'x', operator: 'contains', value: 'hello', action: 'show' },
        ];
        expect(evaluateAllConditions(rules, { x: 'say hello world' })).toBe(true);
        expect(evaluateAllConditions(rules, { x: 'goodbye' })).toBe(false);
    });
});

// ─── Conditional Logic in Form Fixtures ──────────────────────────────────────

describe('Conditional Logic — Form Fixture Coverage', () => {
    for (const { name, create } of ALL_FORM_FIXTURES) {
        it(`${name}: all conditionalLogic rules have valid structure`, () => {
            const form = create();
            const allElements = collectAllElements(form.elements);
            const withLogic = allElements.filter((el) => el.conditionalLogic && (el.conditionalLogic as ConditionalRule[]).length > 0);

            for (const el of withLogic) {
                for (const rule of el.conditionalLogic as ConditionalRule[]) {
                    expect(rule.field).toBeTruthy();
                    expect(['equals', 'notEquals', 'contains', 'greaterThan', 'lessThan']).toContain(rule.operator);
                    expect(rule.value).toBeDefined();
                    expect(['show', 'hide', 'require']).toContain(rule.action);
                }
            }
        });

        it(`${name}: conditional rules reference valid field IDs`, () => {
            const form = create();
            const allElements = collectAllElements(form.elements);
            const allIds = new Set(allElements.map((el) => el.id));
            const withLogic = allElements.filter((el) => el.conditionalLogic && (el.conditionalLogic as ConditionalRule[]).length > 0);

            for (const el of withLogic) {
                for (const rule of el.conditionalLogic as ConditionalRule[]) {
                    expect(allIds.has(rule.field), `Rule in ${el.id} references unknown field "${rule.field}"`).toBe(true);
                }
            }
        });
    }
});

// ─── Action Type Tests ───────────────────────────────────────────────────────

describe('ConditionalRule — Action Types', () => {
    it('show action is used in fixtures', () => {
        let foundShow = false;
        for (const { create } of ALL_FORM_FIXTURES) {
            const form = create();
            const allElements = collectAllElements(form.elements);
            for (const el of allElements) {
                if (el.conditionalLogic) {
                    for (const rule of el.conditionalLogic as ConditionalRule[]) {
                        if (rule.action === 'show') foundShow = true;
                    }
                }
            }
        }
        expect(foundShow).toBe(true);
    });
});
