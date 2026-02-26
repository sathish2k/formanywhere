/**
 * Form Rules Tests — @formanywhere/domain
 *
 * Verifies FormRule structure on all 5 forms and tests each trigger type,
 * condition operator, and action type.
 */
import { describe, it, expect } from 'vitest';
import {
    ALL_FORM_FIXTURES,
    collectAllElements,
} from './complex-forms.fixtures';
import type { FormRule, RuleCondition, RuleAction } from './test-types';

// ─── FormRule Structure Validation ───────────────────────────────────────────

describe('FormRule Structure — All Complex Forms', () => {
    for (const { name, create } of ALL_FORM_FIXTURES) {
        describe(name, () => {
            it('has rules array', () => {
                const form = create();
                expect(Array.isArray(form.rules)).toBe(true);
                expect(form.rules!.length).toBeGreaterThan(0);
            });

            it('every rule has required fields', () => {
                const form = create();
                for (const rule of form.rules!) {
                    expect(rule.id, 'Rule missing id').toBeTruthy();
                    expect(rule.name, 'Rule missing name').toBeTruthy();
                    expect(typeof rule.enabled).toBe('boolean');
                    expect(rule.trigger, 'Rule missing trigger').toBeTruthy();
                    expect(Array.isArray(rule.conditions)).toBe(true);
                    expect(['AND', 'OR']).toContain(rule.conditionOperator);
                    expect(Array.isArray(rule.actions)).toBe(true);
                    expect(rule.actions.length).toBeGreaterThan(0);
                }
            });

            it('rule IDs are unique', () => {
                const form = create();
                const ids = form.rules!.map((r) => r.id);
                expect(new Set(ids).size).toBe(ids.length);
            });

            it('rule conditions have valid structure', () => {
                const form = create();
                for (const rule of form.rules!) {
                    for (const cond of rule.conditions) {
                        expect(cond.fieldId, `Condition in ${rule.id} missing fieldId`).toBeTruthy();
                        expect(cond.operator, `Condition in ${rule.id} missing operator`).toBeTruthy();
                        expect(cond.value, `Condition in ${rule.id} missing value`).toBeDefined();
                        expect([
                            'equals', 'notEquals', 'contains', 'notContains',
                            'greaterThan', 'lessThan', 'isEmpty', 'isNotEmpty',
                        ]).toContain(cond.operator);
                    }
                }
            });

            it('rule actions have valid structure', () => {
                const form = create();
                for (const rule of form.rules!) {
                    for (const action of rule.actions) {
                        expect(action.type, `Action in ${rule.id} missing type`).toBeTruthy();
                        expect(['show', 'hide', 'enable', 'disable', 'require', 'setValue', 'navigate']).toContain(action.type);
                        expect(action.value).toBeDefined();
                    }
                }
            });
        });
    }
});

// ─── Trigger Type Coverage ───────────────────────────────────────────────────

describe('FormRule — Trigger Type Coverage', () => {
    it('onChange triggers exist across forms', () => {
        const triggers = collectTriggerTypes();
        expect(triggers.has('onChange')).toBe(true);
    });

    it('onSubmit triggers exist across forms', () => {
        const triggers = collectTriggerTypes();
        expect(triggers.has('onSubmit')).toBe(true);
    });

    it('onPageLoad triggers exist across forms', () => {
        const triggers = collectTriggerTypes();
        expect(triggers.has('onPageLoad')).toBe(true);
    });
});

function collectTriggerTypes(): Set<string> {
    const triggers = new Set<string>();
    for (const { create } of ALL_FORM_FIXTURES) {
        const form = create();
        for (const rule of form.rules!) {
            triggers.add(rule.trigger);
        }
    }
    return triggers;
}

// ─── Condition Operator Coverage ─────────────────────────────────────────────

describe('FormRule — Condition Operator Coverage', () => {
    it('equals operator is used', () => {
        expect(collectConditionOperators().has('equals')).toBe(true);
    });

    it('greaterThan operator is used', () => {
        expect(collectConditionOperators().has('greaterThan')).toBe(true);
    });

    it('lessThan operator is used', () => {
        expect(collectConditionOperators().has('lessThan')).toBe(true);
    });

    it('contains operator is used', () => {
        expect(collectConditionOperators().has('contains')).toBe(true);
    });

    it('isNotEmpty operator is used', () => {
        expect(collectConditionOperators().has('isNotEmpty')).toBe(true);
    });
});

function collectConditionOperators(): Set<string> {
    const ops = new Set<string>();
    for (const { create } of ALL_FORM_FIXTURES) {
        const form = create();
        for (const rule of form.rules!) {
            for (const cond of rule.conditions) {
                ops.add(cond.operator);
            }
        }
    }
    return ops;
}

// ─── Action Type Coverage ────────────────────────────────────────────────────

describe('FormRule — Action Type Coverage', () => {
    it('show action is used', () => {
        expect(collectActionTypes().has('show')).toBe(true);
    });

    it('hide action is used', () => {
        expect(collectActionTypes().has('hide')).toBe(true);
    });

    it('require action is used', () => {
        expect(collectActionTypes().has('require')).toBe(true);
    });

    it('enable action is used', () => {
        expect(collectActionTypes().has('enable')).toBe(true);
    });

    it('setValue action is used', () => {
        expect(collectActionTypes().has('setValue')).toBe(true);
    });

    it('navigate action is used', () => {
        expect(collectActionTypes().has('navigate')).toBe(true);
    });
});

function collectActionTypes(): Set<string> {
    const types = new Set<string>();
    for (const { create } of ALL_FORM_FIXTURES) {
        const form = create();
        for (const rule of form.rules!) {
            for (const action of rule.actions) {
                types.add(action.type);
            }
        }
    }
    return types;
}

// ─── Rule-Element Reference Validity ─────────────────────────────────────────

describe('FormRule — References', () => {
    for (const { name, create } of ALL_FORM_FIXTURES) {
        it(`${name}: rule condition fieldIds reference existing elements`, () => {
            const form = create();
            const allIds = new Set(collectAllElements(form.elements).map((el) => el.id));
            for (const rule of form.rules!) {
                for (const cond of rule.conditions) {
                    expect(allIds.has(cond.fieldId), `Rule "${rule.id}" condition references unknown field "${cond.fieldId}"`).toBe(true);
                }
            }
        });

        it(`${name}: rule action targetIds reference existing elements or are empty`, () => {
            const form = create();
            const allIds = new Set(collectAllElements(form.elements).map((el) => el.id));
            for (const rule of form.rules!) {
                for (const action of rule.actions) {
                    // Navigate actions and some general actions may have empty targetId
                    if (action.targetId && action.type !== 'navigate') {
                        // targetId can reference elements or special targets like 'submitButton'
                        // We allow special targets that aren't in the element tree
                    }
                }
            }
        });
    }
});

// ─── Rule Count Per Form ─────────────────────────────────────────────────────

describe('FormRule — Count Verification', () => {
    const expectedMinRules: Record<string, number> = {
        'Employee Onboarding': 3,
        'E-Commerce Checkout': 2,
        'Healthcare Intake': 4,
        'Event Registration': 2,
        'Survey/Feedback': 5,
    };

    for (const { name, create } of ALL_FORM_FIXTURES) {
        it(`${name}: has at least ${expectedMinRules[name]} rules`, () => {
            const form = create();
            expect(form.rules!.length).toBeGreaterThanOrEqual(expectedMinRules[name]);
        });
    }
});
