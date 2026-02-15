/**
 * LogicDebuggerDialog — Visual step-through debugger for form conditional logic
 *
 * Features:
 *   - Breakpoints on individual rules (click dot to toggle)
 *   - Step-through execution (one rule at a time)
 *   - Variable inspector / Watch panel
 *   - Execution trace
 *   - Conflict detection
 *   - Rule coverage percentage
 *   - Edge-case generator (auto-generated test scenarios)
 *   - Test data inputs per referenced field
 */
import { createSignal, createMemo, For, Show, batch } from 'solid-js';
import type { Component } from 'solid-js';
import { Dialog } from '@formanywhere/ui/dialog';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import type { FormRule, FormElement } from '@formanywhere/shared/types';
import {
    runDebugSession,
    generateEdgeCases,
    type DebugSession,
    type RuleEvaluation,
    type RuleConflict,
    type EdgeCase,
} from '../../engine/logic-debugger';
import './dialogs.scss';

// ─── Props ──────────────────────────────────────────────────────────────────────

export interface LogicDebuggerDialogProps {
    open: boolean;
    onClose: () => void;
    rules: FormRule[];
    /** All form elements (to resolve field names for the watch panel) */
    elements: FormElement[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

/** Collect all field IDs referenced in rules — used to build test data inputs */
function collectReferencedFields(rules: FormRule[]): string[] {
    const ids = new Set<string>();
    for (const rule of rules) {
        if (rule.triggerFieldId) ids.add(rule.triggerFieldId);
        for (const c of rule.conditions) ids.add(c.fieldId);
        for (const a of rule.actions) ids.add(a.targetId);
    }
    return [...ids].filter(Boolean).sort();
}

/** Find a human-readable label for a field ID */
function fieldLabel(elements: FormElement[], fieldId: string): string {
    for (const el of elements) {
        if (el.id === fieldId) return el.label || fieldId;
        if (el.elements) {
            const nested = fieldLabel(el.elements, fieldId);
            if (nested !== fieldId) return nested;
        }
    }
    return fieldId;
}

const OPERATOR_SYMBOLS: Record<string, string> = {
    equals: '=', notEquals: '≠', contains: '⊃', notContains: '⊅',
    greaterThan: '>', lessThan: '<', isEmpty: '∅', isNotEmpty: '≠∅',
};

const ACTION_LABELS: Record<string, string> = {
    show: 'Show', hide: 'Hide', enable: 'Enable', disable: 'Disable',
    require: 'Require', setValue: 'Set Value', navigate: 'Navigate',
};

// ─── Component ──────────────────────────────────────────────────────────────────

export const LogicDebuggerDialog: Component<LogicDebuggerDialogProps> = (props) => {
    // State
    const [breakpoints, setBreakpoints] = createSignal<Set<string>>(new Set());
    const [testValues, setTestValues] = createSignal<Record<string, string>>({});
    const [session, setSession] = createSignal<DebugSession | null>(null);
    const [stepIndex, setStepIndex] = createSignal<number | null>(null);
    const [selectedRuleId, setSelectedRuleId] = createSignal<string | null>(null);
    const [activeTab, setActiveTab] = createSignal<'watch' | 'trace' | 'conflicts' | 'coverage'>('watch');

    // Derived
    const referencedFields = createMemo(() => collectReferencedFields(props.rules));
    const edgeCases = createMemo(() => generateEdgeCases(props.rules));
    const enabledRules = createMemo(() => props.rules.filter((r) => r.enabled));

    // ── Breakpoint management ────────────────────────────────────────────────
    const toggleBreakpoint = (ruleId: string) => {
        setBreakpoints((prev) => {
            const next = new Set(prev);
            if (next.has(ruleId)) next.delete(ruleId);
            else next.add(ruleId);
            return next;
        });
    };

    // ── Test data management ─────────────────────────────────────────────────
    const updateTestValue = (fieldId: string, value: string) => {
        setTestValues((prev) => ({ ...prev, [fieldId]: value }));
    };

    const applyEdgeCase = (edgeCase: EdgeCase) => {
        const values: Record<string, string> = {};
        for (const [k, v] of Object.entries(edgeCase.values)) {
            values[k] = v === undefined || v === null ? '' : String(v);
        }
        setTestValues(values);
    };

    // ── Execution ────────────────────────────────────────────────────────────
    const run = () => {
        const values: Record<string, unknown> = { ...testValues() };
        const result = runDebugSession(props.rules, values, breakpoints());
        batch(() => {
            setSession(result);
            setStepIndex(result.pausedAtIndex);
            // Auto-select first evaluation
            if (result.evaluations.length > 0) {
                setSelectedRuleId(result.evaluations[0].ruleId);
            }
        });
    };

    const stepOver = () => {
        const idx = stepIndex();
        if (idx === null) return;
        const nextIdx = idx + 1;
        if (nextIdx >= props.rules.length) {
            // Finish
            const values: Record<string, unknown> = { ...testValues() };
            const result = runDebugSession(props.rules, values, new Set()); // run without breakpoints to completion
            batch(() => {
                setSession(result);
                setStepIndex(null);
            });
            return;
        }
        const values: Record<string, unknown> = { ...testValues() };
        const result = runDebugSession(props.rules, values, breakpoints(), nextIdx);
        batch(() => {
            setSession(result);
            setStepIndex(result.pausedAtIndex ?? nextIdx);
            setSelectedRuleId(props.rules[nextIdx]?.id ?? null);
        });
    };

    const continueExecution = () => {
        const idx = stepIndex();
        if (idx === null) return;
        // Remove current breakpoint temporarily and continue
        const bp = new Set(breakpoints());
        const currentRuleId = props.rules[idx]?.id;
        if (currentRuleId) bp.delete(currentRuleId);
        const values: Record<string, unknown> = { ...testValues() };
        const result = runDebugSession(props.rules, values, bp);
        batch(() => {
            setSession(result);
            setStepIndex(result.pausedAtIndex);
        });
    };

    const reset = () => {
        batch(() => {
            setSession(null);
            setStepIndex(null);
            setSelectedRuleId(null);
        });
    };

    // ── Selected rule detail ─────────────────────────────────────────────────
    const selectedEval = createMemo(() => {
        const s = session();
        const id = selectedRuleId();
        if (!s || !id) return null;
        return s.evaluations.find((e) => e.ruleId === id) ?? null;
    });

    // ── Status icon ──────────────────────────────────────────────────────────
    const statusIcon = (status: RuleEvaluation['status']) => {
        switch (status) {
            case 'fired': return '✓';
            case 'skipped': return '✗';
            case 'breakpoint': return '⏸';
            case 'error': return '⚠';
            default: return '○';
        }
    };

    const statusClass = (status: RuleEvaluation['status']) => {
        switch (status) {
            case 'fired': return 'debugger__status--fired';
            case 'skipped': return 'debugger__status--skipped';
            case 'breakpoint': return 'debugger__status--breakpoint';
            case 'error': return 'debugger__status--error';
            default: return 'debugger__status--pending';
        }
    };

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            title="Logic Debugger"
            icon={<Icon name="code" size={20} />}
            class="debugger-dialog"
            actions={
                <div class="debugger__dialog-actions">
                    <Button variant="text" size="sm" onClick={props.onClose}>Close</Button>
                </div>
            }
        >
            <div class="debugger__layout">
                {/* ── Left: Rules list ──────────────────────────────────────── */}
                <div class="debugger__rules-panel">
                    <div class="debugger__panel-header">
                        <span class="debugger__panel-title">Rules</span>
                        <span class="debugger__rule-count">{props.rules.length}</span>
                    </div>

                    {/* Toolbar */}
                    <div class="debugger__toolbar">
                        <button
                            class="debugger__toolbar-btn debugger__toolbar-btn--primary"
                            onClick={run}
                            title="Run all rules"
                        >
                            <Icon name="play" size={14} />
                            <span>Run</span>
                        </button>
                        <button
                            class="debugger__toolbar-btn"
                            onClick={stepOver}
                            disabled={stepIndex() === null && session() !== null}
                            title="Step over (next rule)"
                        >
                            <Icon name="skip-forward" size={14} />
                            <span>Step</span>
                        </button>
                        <button
                            class="debugger__toolbar-btn"
                            onClick={continueExecution}
                            disabled={stepIndex() === null}
                            title="Continue to next breakpoint"
                        >
                            <Icon name="fast-forward" size={14} />
                            <span>Continue</span>
                        </button>
                        <button
                            class="debugger__toolbar-btn"
                            onClick={reset}
                            title="Reset debug session"
                        >
                            <Icon name="refresh-cw" size={14} />
                            <span>Reset</span>
                        </button>
                    </div>

                    {/* Rule list */}
                    <div class="debugger__rule-list">
                        <Show when={props.rules.length > 0} fallback={
                            <div class="debugger__empty">
                                <Icon name="code" size={24} />
                                <p>No logic rules defined. Create rules in the Logic dialog first.</p>
                            </div>
                        }>
                            <For each={props.rules}>
                                {(rule, idx) => {
                                    const evaluation = () => session()?.evaluations.find((e) => e.ruleId === rule.id);
                                    const isCurrentStep = () => stepIndex() !== null && stepIndex() === idx();
                                    const isSelected = () => selectedRuleId() === rule.id;
                                    const hasBP = () => breakpoints().has(rule.id);

                                    return (
                                        <div
                                            class={`debugger__rule-row ${isSelected() ? 'debugger__rule-row--selected' : ''} ${isCurrentStep() ? 'debugger__rule-row--current' : ''}`}
                                            onClick={() => setSelectedRuleId(rule.id)}
                                        >
                                            {/* Breakpoint gutter */}
                                            <button
                                                class={`debugger__bp-dot ${hasBP() ? 'debugger__bp-dot--active' : ''}`}
                                                onClick={(e) => { e.stopPropagation(); toggleBreakpoint(rule.id); }}
                                                title={hasBP() ? 'Remove breakpoint' : 'Set breakpoint'}
                                            >
                                                <span class="debugger__bp-inner" />
                                            </button>

                                            {/* Status indicator */}
                                            <Show when={evaluation()} fallback={
                                                <span class="debugger__status debugger__status--pending">○</span>
                                            }>
                                                {(ev) => (
                                                    <span class={`debugger__status ${statusClass(ev().status)}`}>
                                                        {statusIcon(ev().status)}
                                                    </span>
                                                )}
                                            </Show>

                                            {/* Rule name */}
                                            <span class="debugger__rule-name">
                                                {rule.name || `Rule ${idx() + 1}`}
                                            </span>

                                            {/* Enabled badge */}
                                            <Show when={!rule.enabled}>
                                                <span class="debugger__badge debugger__badge--disabled">off</span>
                                            </Show>

                                            {/* Current step arrow */}
                                            <Show when={isCurrentStep()}>
                                                <span class="debugger__current-arrow">←</span>
                                            </Show>
                                        </div>
                                    );
                                }}
                            </For>
                        </Show>
                    </div>

                    {/* Coverage bar */}
                    <Show when={session()}>
                        {(s) => (
                            <div class="debugger__coverage">
                                <div class="debugger__coverage-label">
                                    <span>Coverage</span>
                                    <span>{s().coverage.fired}/{s().coverage.total} ({s().coverage.percentage}%)</span>
                                </div>
                                <div class="debugger__coverage-bar">
                                    <div
                                        class="debugger__coverage-fill"
                                        style={{ width: `${s().coverage.percentage}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </Show>
                </div>

                {/* ── Center: Inspection panels ────────────────────────────── */}
                <div class="debugger__inspect-panel">
                    {/* Tabs */}
                    <div class="debugger__tabs">
                        <button
                            class={`debugger__tab ${activeTab() === 'watch' ? 'debugger__tab--active' : ''}`}
                            onClick={() => setActiveTab('watch')}
                        >
                            <Icon name="eye" size={14} />
                            Watch
                        </button>
                        <button
                            class={`debugger__tab ${activeTab() === 'trace' ? 'debugger__tab--active' : ''}`}
                            onClick={() => setActiveTab('trace')}
                        >
                            <Icon name="activity" size={14} />
                            Trace
                        </button>
                        <button
                            class={`debugger__tab ${activeTab() === 'conflicts' ? 'debugger__tab--active' : ''}`}
                            onClick={() => setActiveTab('conflicts')}
                        >
                            <Icon name="alert-triangle" size={14} />
                            Conflicts
                            <Show when={session() && session()!.conflicts.length > 0}>
                                <span class="debugger__tab-badge">{session()!.conflicts.length}</span>
                            </Show>
                        </button>
                        <button
                            class={`debugger__tab ${activeTab() === 'coverage' ? 'debugger__tab--active' : ''}`}
                            onClick={() => setActiveTab('coverage')}
                        >
                            <Icon name="bar-chart" size={14} />
                            Detail
                        </button>
                    </div>

                    {/* Tab content */}
                    <div class="debugger__tab-content">
                        {/* ── Watch Panel ──────────────────────────────────── */}
                        <Show when={activeTab() === 'watch'}>
                            <Show when={session()} fallback={
                                <div class="debugger__empty-tab">
                                    <p>Click <strong>Run</strong> to start debugging. Set breakpoints by clicking the dots next to rules.</p>
                                </div>
                            }>
                                {(s) => (
                                    <div class="debugger__watch">
                                        {/* Field values */}
                                        <div class="debugger__watch-section">
                                            <div class="debugger__watch-section-title">Field Values</div>
                                            <For each={Object.entries(s().snapshot.fieldValues)}>
                                                {([fieldId, value]) => (
                                                    <div class="debugger__watch-row">
                                                        <span class="debugger__watch-key">{fieldLabel(props.elements, fieldId)}</span>
                                                        <span class="debugger__watch-value">
                                                            {value === '' ? <em>empty</em> : String(value)}
                                                        </span>
                                                    </div>
                                                )}
                                            </For>
                                        </div>

                                        {/* Visibility */}
                                        <Show when={Object.keys(s().snapshot.visibility).length > 0}>
                                            <div class="debugger__watch-section">
                                                <div class="debugger__watch-section-title">Visibility</div>
                                                <For each={Object.entries(s().snapshot.visibility)}>
                                                    {([fieldId, visible]) => (
                                                        <div class="debugger__watch-row">
                                                            <span class="debugger__watch-key">{fieldLabel(props.elements, fieldId)}.visible</span>
                                                            <span class={`debugger__watch-bool ${visible ? 'debugger__watch-bool--true' : 'debugger__watch-bool--false'}`}>
                                                                {visible ? 'true' : 'false'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </For>
                                            </div>
                                        </Show>

                                        {/* Required state */}
                                        <Show when={Object.keys(s().snapshot.requiredState).length > 0}>
                                            <div class="debugger__watch-section">
                                                <div class="debugger__watch-section-title">Required</div>
                                                <For each={Object.entries(s().snapshot.requiredState)}>
                                                    {([fieldId, required]) => (
                                                        <div class="debugger__watch-row">
                                                            <span class="debugger__watch-key">{fieldLabel(props.elements, fieldId)}.required</span>
                                                            <span class={`debugger__watch-bool ${required ? 'debugger__watch-bool--true' : 'debugger__watch-bool--false'}`}>
                                                                {required ? 'true' : 'false'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </For>
                                            </div>
                                        </Show>

                                        {/* Enabled state */}
                                        <Show when={Object.keys(s().snapshot.enabledState).length > 0}>
                                            <div class="debugger__watch-section">
                                                <div class="debugger__watch-section-title">Enabled</div>
                                                <For each={Object.entries(s().snapshot.enabledState)}>
                                                    {([fieldId, enabled]) => (
                                                        <div class="debugger__watch-row">
                                                            <span class="debugger__watch-key">{fieldLabel(props.elements, fieldId)}.enabled</span>
                                                            <span class={`debugger__watch-bool ${enabled ? 'debugger__watch-bool--true' : 'debugger__watch-bool--false'}`}>
                                                                {enabled ? 'true' : 'false'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </For>
                                            </div>
                                        </Show>
                                    </div>
                                )}
                            </Show>
                        </Show>

                        {/* ── Trace Panel ──────────────────────────────────── */}
                        <Show when={activeTab() === 'trace'}>
                            <Show when={session()} fallback={
                                <div class="debugger__empty-tab">
                                    <p>Run the debugger to see the execution trace.</p>
                                </div>
                            }>
                                {(s) => (
                                    <div class="debugger__trace">
                                        <div class="debugger__trace-path">
                                            {s().trace.join(' → ')}
                                        </div>
                                        <div class="debugger__trace-list">
                                            <For each={s().evaluations}>
                                                {(ev, idx) => (
                                                    <div
                                                        class={`debugger__trace-item ${statusClass(ev.status)}`}
                                                        onClick={() => setSelectedRuleId(ev.ruleId)}
                                                    >
                                                        <span class="debugger__trace-idx">{idx() + 1}</span>
                                                        <span class={`debugger__trace-status ${statusClass(ev.status)}`}>
                                                            {statusIcon(ev.status)}
                                                        </span>
                                                        <span class="debugger__trace-name">{ev.ruleName}</span>
                                                        <Show when={ev.conditionResults.length > 0}>
                                                            <span class="debugger__trace-conditions">
                                                                ({ev.conditionResults.filter((c) => c.passed).length}/{ev.conditionResults.length} conditions)
                                                            </span>
                                                        </Show>
                                                        <Show when={ev.executedActions.length > 0}>
                                                            <span class="debugger__trace-actions">
                                                                → {ev.executedActions.map((a) => ACTION_LABELS[a.type]).join(', ')}
                                                            </span>
                                                        </Show>
                                                    </div>
                                                )}
                                            </For>
                                        </div>
                                    </div>
                                )}
                            </Show>
                        </Show>

                        {/* ── Conflicts Panel ─────────────────────────────── */}
                        <Show when={activeTab() === 'conflicts'}>
                            <Show when={session()} fallback={
                                <div class="debugger__empty-tab"><p>Run the debugger to detect conflicts.</p></div>
                            }>
                                {(s) => (
                                    <div class="debugger__conflicts">
                                        <Show when={s().conflicts.length === 0}>
                                            <div class="debugger__no-conflicts">
                                                <Icon name="check-circle" size={24} />
                                                <p>No conflicts detected!</p>
                                            </div>
                                        </Show>
                                        <For each={s().conflicts}>
                                            {(conflict) => (
                                                <div class="debugger__conflict-card">
                                                    <div class="debugger__conflict-icon">
                                                        <Icon name="alert-triangle" size={16} />
                                                    </div>
                                                    <div class="debugger__conflict-body">
                                                        <div class="debugger__conflict-title">
                                                            Conflict on "{fieldLabel(props.elements, conflict.targetId)}"
                                                        </div>
                                                        <div class="debugger__conflict-desc">{conflict.description}</div>
                                                        <div class="debugger__conflict-rules">
                                                            <span class="debugger__conflict-chip">{conflict.ruleA.name}</span>
                                                            <span class="debugger__conflict-vs">vs</span>
                                                            <span class="debugger__conflict-chip">{conflict.ruleB.name}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </For>
                                    </div>
                                )}
                            </Show>
                        </Show>

                        {/* ── Detail Panel (selected rule) ────────────────── */}
                        <Show when={activeTab() === 'coverage'}>
                            <Show when={selectedEval()} fallback={
                                <div class="debugger__empty-tab">
                                    <p>Select a rule from the list to see its evaluation details.</p>
                                </div>
                            }>
                                {(ev) => (
                                    <div class="debugger__detail">
                                        <div class="debugger__detail-header">
                                            <span class={`debugger__status ${statusClass(ev().status)}`}>
                                                {statusIcon(ev().status)}
                                            </span>
                                            <h3>{ev().ruleName}</h3>
                                            <span class={`debugger__badge ${ev().conditionsMet ? 'debugger__badge--pass' : 'debugger__badge--fail'}`}>
                                                {ev().conditionsMet ? 'PASS' : 'FAIL'}
                                            </span>
                                        </div>

                                        {/* Conditions */}
                                        <div class="debugger__detail-section">
                                            <div class="debugger__detail-section-title">Conditions</div>
                                            <For each={ev().conditionResults}>
                                                {(cr) => (
                                                    <div class={`debugger__condition-row ${cr.passed ? 'debugger__condition-row--pass' : 'debugger__condition-row--fail'}`}>
                                                        <span class="debugger__condition-status">{cr.passed ? '✓' : '✗'}</span>
                                                        <code class="debugger__condition-field">
                                                            {fieldLabel(props.elements, cr.condition.fieldId)}
                                                        </code>
                                                        <span class="debugger__condition-op">
                                                            {OPERATOR_SYMBOLS[cr.condition.operator] || cr.condition.operator}
                                                        </span>
                                                        <code class="debugger__condition-expected">{cr.condition.value || '""'}</code>
                                                        <span class="debugger__condition-actual">
                                                            (actual: <code>{cr.actualValue === undefined ? 'undefined' : cr.actualValue === '' ? '""' : String(cr.actualValue)}</code>)
                                                        </span>
                                                    </div>
                                                )}
                                            </For>
                                        </div>

                                        {/* Actions */}
                                        <Show when={ev().executedActions.length > 0}>
                                            <div class="debugger__detail-section">
                                                <div class="debugger__detail-section-title">Actions Executed</div>
                                                <For each={ev().executedActions}>
                                                    {(action) => (
                                                        <div class="debugger__action-row">
                                                            <span class="debugger__action-type">{ACTION_LABELS[action.type]}</span>
                                                            <span class="debugger__action-arrow">→</span>
                                                            <span class="debugger__action-target">
                                                                {fieldLabel(props.elements, action.targetId)}
                                                            </span>
                                                            <Show when={action.value}>
                                                                <span class="debugger__action-value">= "{action.value}"</span>
                                                            </Show>
                                                        </div>
                                                    )}
                                                </For>
                                            </div>
                                        </Show>

                                        {/* Error */}
                                        <Show when={ev().error}>
                                            <div class="debugger__detail-error">
                                                <Icon name="alert-triangle" size={14} />
                                                <span>{ev().error}</span>
                                            </div>
                                        </Show>
                                    </div>
                                )}
                            </Show>
                        </Show>
                    </div>
                </div>

                {/* ── Right: Test Data & Edge Cases ────────────────────────── */}
                <div class="debugger__data-panel">
                    <div class="debugger__panel-header">
                        <span class="debugger__panel-title">Test Data</span>
                    </div>

                    {/* Edge case presets */}
                    <Show when={edgeCases().length > 0}>
                        <div class="debugger__edge-cases">
                            <div class="debugger__edge-label">Edge Cases</div>
                            <div class="debugger__edge-list">
                                <For each={edgeCases()}>
                                    {(ec) => (
                                        <button
                                            class="debugger__edge-btn"
                                            onClick={() => applyEdgeCase(ec)}
                                            title={ec.description}
                                        >
                                            <Icon name="lightning" size={12} />
                                            {ec.label}
                                        </button>
                                    )}
                                </For>
                            </div>
                        </div>
                    </Show>

                    {/* Per-field inputs */}
                    <div class="debugger__field-inputs">
                        <Show when={referencedFields().length > 0} fallback={
                            <div class="debugger__empty-fields">
                                <p>No fields referenced in rules.</p>
                            </div>
                        }>
                            <For each={referencedFields()}>
                                {(fieldId) => (
                                    <div class="debugger__field-row">
                                        <label class="debugger__field-label" title={fieldId}>
                                            {fieldLabel(props.elements, fieldId)}
                                        </label>
                                        <input
                                            type="text"
                                            class="debugger__field-input"
                                            value={testValues()[fieldId] ?? ''}
                                            onInput={(e) => updateTestValue(fieldId, e.currentTarget.value)}
                                            placeholder="test value…"
                                        />
                                    </div>
                                )}
                            </For>
                        </Show>
                    </div>

                    {/* Clear test data */}
                    <div class="debugger__data-actions">
                        <button class="debugger__clear-btn" onClick={() => setTestValues({})}>
                            <Icon name="trash" size={12} />
                            Clear All
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};
