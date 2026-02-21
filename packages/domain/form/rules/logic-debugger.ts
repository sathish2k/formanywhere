/**
 * Logic Debugger Engine — @formanywhere/domain
 *
 * Instrumented rule evaluator with step-through support.
 * Evaluates FormRule[] against a set of field values, emitting per-rule
 * execution events (fired/skipped/breakpoint). Supports:
 *   - Breakpoints on individual rules
 *   - Step-through (one rule at a time)
 *   - Variable watch (reactive field state snapshots)
 *   - Execution trace (ordered list of evaluated rules)
 *   - Conflict detection (contradicting show/hide on same target)
 *   - Rule coverage (% of rules that fired)
 *   - Edge-case generation (boundary + adversarial inputs)
 */
import type { FormRule, RuleCondition, RuleAction } from '@formanywhere/shared/types';

// ─── Types ──────────────────────────────────────────────────────────────────────

export type RuleStatus = 'pending' | 'fired' | 'skipped' | 'breakpoint' | 'error';

export interface RuleEvaluation {
    ruleId: string;
    ruleName: string;
    status: RuleStatus;
    /** Did all conditions pass? */
    conditionsMet: boolean;
    /** Per-condition evaluation results */
    conditionResults: ConditionEvalResult[];
    /** Actions that would execute (if conditions met) */
    executedActions: RuleAction[];
    /** Timestamp of evaluation */
    timestamp: number;
    /** Error message if evaluation failed */
    error?: string;
}

export interface ConditionEvalResult {
    condition: RuleCondition;
    /** The actual field value at eval time */
    actualValue: unknown;
    /** Did this individual condition pass? */
    passed: boolean;
}

export interface RuleConflict {
    ruleA: { id: string; name: string };
    ruleB: { id: string; name: string };
    targetId: string;
    description: string;
}

export interface DebuggerSnapshot {
    fieldValues: Record<string, unknown>;
    visibility: Record<string, boolean>;
    requiredState: Record<string, boolean>;
    enabledState: Record<string, boolean>;
    setValues: Record<string, unknown>;
}

export interface DebugSession {
    evaluations: RuleEvaluation[];
    snapshot: DebuggerSnapshot;
    conflicts: RuleConflict[];
    coverage: { fired: number; total: number; percentage: number };
    pausedAtIndex: number | null;
    stepping: boolean;
    trace: string[];
}

export interface EdgeCase {
    label: string;
    description: string;
    values: Record<string, unknown>;
}

// ─── Condition Evaluator ─────────────────────────────────────────────────────────

export function evaluateRuleCondition(
    condition: RuleCondition,
    values: Record<string, unknown>
): ConditionEvalResult {
    const actual = values[condition.fieldId];

    let passed = false;
    try {
        switch (condition.operator) {
            case 'equals':
                passed = String(actual) === String(condition.value);
                break;
            case 'notEquals':
                passed = String(actual) !== String(condition.value);
                break;
            case 'contains':
                passed = String(actual ?? '').toLowerCase().includes(String(condition.value).toLowerCase());
                break;
            case 'notContains':
                passed = !String(actual ?? '').toLowerCase().includes(String(condition.value).toLowerCase());
                break;
            case 'greaterThan':
                passed = Number(actual) > Number(condition.value);
                break;
            case 'lessThan':
                passed = Number(actual) < Number(condition.value);
                break;
            case 'isEmpty':
                passed = actual === undefined || actual === null || actual === '';
                break;
            case 'isNotEmpty':
                passed = actual !== undefined && actual !== null && actual !== '';
                break;
            default:
                passed = true;
        }
    } catch {
        passed = false;
    }

    return { condition, actualValue: actual, passed };
}

// ─── Full Rule Evaluator (Instrumented) ──────────────────────────────────────────

export function evaluateRule(
    rule: FormRule,
    values: Record<string, unknown>,
    breakpoints: Set<string>
): RuleEvaluation {
    if (!rule.enabled) {
        return {
            ruleId: rule.id,
            ruleName: rule.name,
            status: 'skipped',
            conditionsMet: false,
            conditionResults: [],
            executedActions: [],
            timestamp: Date.now(),
        };
    }

    if (breakpoints.has(rule.id)) {
        const conditionResults = rule.conditions.map((c) => evaluateRuleCondition(c, values));
        const conditionsMet =
            rule.conditionOperator === 'AND'
                ? conditionResults.every((r) => r.passed)
                : conditionResults.some((r) => r.passed);

        return {
            ruleId: rule.id,
            ruleName: rule.name,
            status: 'breakpoint',
            conditionsMet,
            conditionResults,
            executedActions: conditionsMet ? rule.actions : [],
            timestamp: Date.now(),
        };
    }

    try {
        const conditionResults = rule.conditions.map((c) => evaluateRuleCondition(c, values));
        const conditionsMet =
            rule.conditionOperator === 'AND'
                ? conditionResults.every((r) => r.passed)
                : conditionResults.some((r) => r.passed);

        return {
            ruleId: rule.id,
            ruleName: rule.name,
            status: conditionsMet ? 'fired' : 'skipped',
            conditionsMet,
            conditionResults,
            executedActions: conditionsMet ? rule.actions : [],
            timestamp: Date.now(),
        };
    } catch (err) {
        return {
            ruleId: rule.id,
            ruleName: rule.name,
            status: 'error',
            conditionsMet: false,
            conditionResults: [],
            executedActions: [],
            timestamp: Date.now(),
            error: err instanceof Error ? err.message : String(err),
        };
    }
}

// ─── Conflict Detection ──────────────────────────────────────────────────────────

export function detectConflicts(evaluations: RuleEvaluation[]): RuleConflict[] {
    const conflicts: RuleConflict[] = [];
    const firedRules = evaluations.filter((e) => e.status === 'fired' || e.status === 'breakpoint');

    const targetActions = new Map<string, Array<{ ruleId: string; ruleName: string; actionType: string }>>();

    for (const evaluation of firedRules) {
        for (const action of evaluation.executedActions) {
            const existing = targetActions.get(action.targetId) ?? [];
            existing.push({ ruleId: evaluation.ruleId, ruleName: evaluation.ruleName, actionType: action.type });
            targetActions.set(action.targetId, existing);
        }
    }

    const contradictions: [string, string][] = [
        ['show', 'hide'],
        ['enable', 'disable'],
        ['require', 'disable'],
    ];

    for (const [targetId, actions] of targetActions) {
        for (const [typeA, typeB] of contradictions) {
            const rulesA = actions.filter((a) => a.actionType === typeA);
            const rulesB = actions.filter((a) => a.actionType === typeB);

            for (const rA of rulesA) {
                for (const rB of rulesB) {
                    if (rA.ruleId !== rB.ruleId) {
                        conflicts.push({
                            ruleA: { id: rA.ruleId, name: rA.ruleName },
                            ruleB: { id: rB.ruleId, name: rB.ruleName },
                            targetId,
                            description: `"${rA.ruleName}" (${typeA}) vs "${rB.ruleName}" (${typeB}) on target "${targetId}"`,
                        });
                    }
                }
            }
        }
    }

    return conflicts;
}

// ─── Snapshot Builder ────────────────────────────────────────────────────────────

export function buildSnapshot(
    evaluations: RuleEvaluation[],
    initialValues: Record<string, unknown>
): DebuggerSnapshot {
    const visibility: Record<string, boolean> = {};
    const requiredState: Record<string, boolean> = {};
    const enabledState: Record<string, boolean> = {};
    const setValues: Record<string, unknown> = {};

    for (const evaluation of evaluations) {
        if (evaluation.status !== 'fired' && evaluation.status !== 'breakpoint') continue;
        for (const action of evaluation.executedActions) {
            switch (action.type) {
                case 'show':   visibility[action.targetId] = true;  break;
                case 'hide':   visibility[action.targetId] = false; break;
                case 'enable': enabledState[action.targetId] = true; break;
                case 'disable': enabledState[action.targetId] = false; break;
                case 'require': requiredState[action.targetId] = true; break;
                case 'setValue': setValues[action.targetId] = action.value; break;
            }
        }
    }

    return {
        fieldValues: { ...initialValues, ...setValues },
        visibility,
        requiredState,
        enabledState,
        setValues,
    };
}

// ─── Run Full Debug Session ──────────────────────────────────────────────────────

export function runDebugSession(
    rules: FormRule[],
    values: Record<string, unknown>,
    breakpoints: Set<string>,
    stopAtIndex?: number
): DebugSession {
    const evaluations: RuleEvaluation[] = [];
    const trace: string[] = [];
    let pausedAtIndex: number | null = null;

    const limit = stopAtIndex !== undefined ? Math.min(stopAtIndex + 1, rules.length) : rules.length;

    for (let i = 0; i < limit; i++) {
        const rule = rules[i];
        const evaluation = evaluateRule(rule, values, breakpoints);
        evaluations.push(evaluation);

        const statusLabel = evaluation.status === 'fired' ? '✓'
            : evaluation.status === 'skipped' ? '✗'
            : evaluation.status === 'breakpoint' ? '⏸'
            : evaluation.status === 'error' ? '⚠' : '○';
        trace.push(`${rule.name}(${statusLabel})`);

        if (evaluation.status === 'breakpoint') {
            pausedAtIndex = i;
            break;
        }

        if (evaluation.status === 'fired') {
            for (const action of evaluation.executedActions) {
                if (action.type === 'setValue') {
                    values = { ...values, [action.targetId]: action.value };
                }
            }
        }
    }

    const snapshot = buildSnapshot(evaluations, values);
    const conflicts = detectConflicts(evaluations);
    const fired = evaluations.filter((e) => e.status === 'fired').length;
    const total = evaluations.length;

    return {
        evaluations,
        snapshot,
        conflicts,
        coverage: {
            fired,
            total,
            percentage: total > 0 ? Math.round((fired / total) * 100) : 0,
        },
        pausedAtIndex,
        stepping: pausedAtIndex !== null,
        trace,
    };
}

// ─── Edge-Case Generator ─────────────────────────────────────────────────────────

export function generateEdgeCases(rules: FormRule[]): EdgeCase[] {
    const cases: EdgeCase[] = [];

    const fieldIds = new Set<string>();
    const numericFields = new Set<string>();

    for (const rule of rules) {
        if (rule.triggerFieldId) fieldIds.add(rule.triggerFieldId);
        for (const condition of rule.conditions) {
            fieldIds.add(condition.fieldId);
            if (condition.operator === 'greaterThan' || condition.operator === 'lessThan') {
                numericFields.add(condition.fieldId);
            }
        }
    }

    const allEmpty: Record<string, unknown> = {};
    for (const id of fieldIds) allEmpty[id] = '';
    cases.push({ label: 'All Empty', description: 'Every referenced field is empty — tests isEmpty/isNotEmpty guards', values: allEmpty });

    const happyPath: Record<string, unknown> = {};
    for (const rule of rules) {
        for (const condition of rule.conditions) {
            if (condition.operator === 'equals' || condition.operator === 'contains') {
                happyPath[condition.fieldId] = condition.value;
            } else if (condition.operator === 'greaterThan') {
                happyPath[condition.fieldId] = Number(condition.value) + 1;
            } else if (condition.operator === 'lessThan') {
                happyPath[condition.fieldId] = Number(condition.value) - 1;
            } else if (condition.operator === 'isNotEmpty') {
                happyPath[condition.fieldId] = 'test-value';
            }
        }
    }
    cases.push({ label: 'Happy Path', description: 'Values chosen to satisfy as many conditions as possible', values: happyPath });

    const inverted: Record<string, unknown> = {};
    for (const rule of rules) {
        for (const condition of rule.conditions) {
            if (condition.operator === 'equals') {
                inverted[condition.fieldId] = `NOT_${condition.value}`;
            } else if (condition.operator === 'notEquals') {
                inverted[condition.fieldId] = condition.value;
            } else if (condition.operator === 'greaterThan') {
                inverted[condition.fieldId] = Number(condition.value) - 1;
            } else if (condition.operator === 'lessThan') {
                inverted[condition.fieldId] = Number(condition.value) + 1;
            } else if (condition.operator === 'isEmpty') {
                inverted[condition.fieldId] = 'filled';
            } else if (condition.operator === 'isNotEmpty') {
                inverted[condition.fieldId] = '';
            } else if (condition.operator === 'contains') {
                inverted[condition.fieldId] = 'completely_different';
            }
        }
    }
    cases.push({ label: 'Inverted', description: 'Values chosen to fail as many conditions as possible', values: inverted });

    if (numericFields.size > 0) {
        const boundary: Record<string, unknown> = { ...happyPath };
        for (const rule of rules) {
            for (const condition of rule.conditions) {
                if (condition.operator === 'greaterThan' || condition.operator === 'lessThan') {
                    boundary[condition.fieldId] = Number(condition.value);
                }
            }
        }
        cases.push({ label: 'Boundary Values', description: 'Numeric fields set to exact boundary values', values: boundary });
    }

    if (rules.length >= 2) {
        const contradictory: Record<string, unknown> = {};
        for (const rule of rules) {
            for (const condition of rule.conditions) {
                if (condition.operator === 'equals') {
                    contradictory[condition.fieldId] = condition.value;
                } else if (condition.operator === 'greaterThan') {
                    const existing = contradictory[condition.fieldId];
                    const target = Number(condition.value) + 1;
                    contradictory[condition.fieldId] = existing !== undefined ? Math.max(Number(existing), target) : target;
                } else if (condition.operator === 'lessThan') {
                    const existing = contradictory[condition.fieldId];
                    const target = Number(condition.value) - 1;
                    contradictory[condition.fieldId] = existing !== undefined ? Math.min(Number(existing), target) : target;
                } else if (condition.operator === 'isNotEmpty') {
                    contradictory[condition.fieldId] = contradictory[condition.fieldId] || 'test';
                }
            }
        }
        cases.push({ label: 'Contradictory', description: 'Attempts to fire all rules simultaneously — exposes conflicts', values: contradictory });
    }

    return cases;
}
