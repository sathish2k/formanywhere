/**
 * Conditional Rule Evaluator — @formanywhere/domain
 *
 * Evaluates ConditionalRule[] (simple visibility/required conditions)
 * against a set of field values. Used by form-runtime to show/hide elements.
 */
import type { ConditionalRule } from '@formanywhere/shared/types';

export function evaluateCondition(
    rule: ConditionalRule,
    values: Record<string, unknown>
): boolean {
    const fieldValue = values[rule.field];

    switch (rule.operator) {
        case 'equals':
            return fieldValue === rule.value;
        case 'notEquals':
            return fieldValue !== rule.value;
        case 'contains':
            return String(fieldValue ?? '').includes(String(rule.value));
        case 'greaterThan':
            return Number(fieldValue) > Number(rule.value);
        case 'lessThan':
            return Number(fieldValue) < Number(rule.value);
        default:
            return true;
    }
}

export function evaluateAllConditions(
    rules: ConditionalRule[],
    values: Record<string, unknown>
): boolean {
    if (rules.length === 0) return true;
    return rules.every((rule) => evaluateCondition(rule, values));
}
