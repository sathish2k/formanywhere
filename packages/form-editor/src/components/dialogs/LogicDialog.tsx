/**
 * LogicDialog — Manage conditional logic rules for form fields
 * Migrated from AI-Powered Form Builder UI → SolidJS + M3
 */
import { For, Show, createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import { Dialog } from '@formanywhere/ui/dialog';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import type { FormRule, RuleCondition, RuleAction } from '@formanywhere/shared/types';
import type { PageTab } from '../page-toolbar/PageToolbar';
import './dialogs.scss';

export interface LogicDialogProps {
    open: boolean;
    onClose: () => void;
    rules: FormRule[];
    onAddRule: (rule: FormRule) => void;
    onUpdateRule: (ruleId: string, rule: FormRule) => void;
    onDeleteRule: (ruleId: string) => void;
    pages: PageTab[];
}

const TRIGGERS: { value: FormRule['trigger']; label: string }[] = [
    { value: 'onChange', label: 'On Change' },
    { value: 'onBlur', label: 'On Blur' },
    { value: 'onFocus', label: 'On Focus' },
    { value: 'onSubmit', label: 'On Submit' },
    { value: 'onPageLoad', label: 'On Page Load' },
];

const OPERATORS: { value: RuleCondition['operator']; label: string }[] = [
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'notContains', label: 'Not Contains' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
    { value: 'isEmpty', label: 'Is Empty' },
    { value: 'isNotEmpty', label: 'Is Not Empty' },
];

const ACTION_TYPES: { value: RuleAction['type']; label: string }[] = [
    { value: 'show', label: 'Show' },
    { value: 'hide', label: 'Hide' },
    { value: 'enable', label: 'Enable' },
    { value: 'disable', label: 'Disable' },
    { value: 'require', label: 'Make Required' },
    { value: 'setValue', label: 'Set Value' },
    { value: 'navigate', label: 'Navigate to Page' },
];

export const LogicDialog: Component<LogicDialogProps> = (props) => {
    const [editingRule, setEditingRule] = createSignal<FormRule | null>(null);
    const [isNew, setIsNew] = createSignal(false);

    const createNewRule = (): FormRule => ({
        id: `rule-${Date.now()}`,
        name: '',
        enabled: true,
        trigger: 'onChange',
        triggerFieldId: '',
        conditions: [{ fieldId: '', operator: 'equals', value: '' }],
        conditionOperator: 'AND',
        actions: [{ type: 'show', targetId: '', value: '' }],
    });

    const handleAdd = () => { setEditingRule(createNewRule()); setIsNew(true); };
    const handleEdit = (rule: FormRule) => { setEditingRule({ ...rule }); setIsNew(false); };

    const handleSave = () => {
        const rule = editingRule();
        if (!rule || !rule.name.trim()) return;
        if (isNew()) props.onAddRule(rule);
        else props.onUpdateRule(rule.id, rule);
        setEditingRule(null);
    };

    const updateField = <K extends keyof FormRule>(key: K, value: FormRule[K]) => {
        const r = editingRule();
        if (r) setEditingRule({ ...r, [key]: value });
    };

    const updateCondition = (idx: number, c: Partial<RuleCondition>) => {
        const r = editingRule();
        if (!r) return;
        const conds = [...r.conditions];
        conds[idx] = { ...conds[idx], ...c };
        setEditingRule({ ...r, conditions: conds });
    };

    const addCondition = () => {
        const r = editingRule();
        if (r) setEditingRule({ ...r, conditions: [...r.conditions, { fieldId: '', operator: 'equals', value: '' }] });
    };

    const removeCondition = (idx: number) => {
        const r = editingRule();
        if (r && r.conditions.length > 1) {
            setEditingRule({ ...r, conditions: r.conditions.filter((_, i) => i !== idx) });
        }
    };

    const updateAction = (idx: number, a: Partial<RuleAction>) => {
        const r = editingRule();
        if (!r) return;
        const acts = [...r.actions];
        acts[idx] = { ...acts[idx], ...a };
        setEditingRule({ ...r, actions: acts });
    };

    const addAction = () => {
        const r = editingRule();
        if (r) setEditingRule({ ...r, actions: [...r.actions, { type: 'show', targetId: '', value: '' }] });
    };

    const removeAction = (idx: number) => {
        const r = editingRule();
        if (r && r.actions.length > 1) {
            setEditingRule({ ...r, actions: r.actions.filter((_, i) => i !== idx) });
        }
    };

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            title="Conditional Logic"
            icon={<Icon name="git-branch" size={20} />}
            class="logic-dialog"
            actions={
                <Button variant="text" size="sm" onClick={props.onClose}>Close</Button>
            }
        >
            <div class="logic-dialog__content">
                {/* Rule list view */}
                <Show when={!editingRule()}>
                    <div class="logic-dialog__header-row">
                        <span class="logic-dialog__count">{props.rules.length} rule{props.rules.length !== 1 ? 's' : ''}</span>
                        <Button variant="filled" size="sm" onClick={handleAdd}>
                            <Icon name="plus" size={14} />
                            Add Rule
                        </Button>
                    </div>

                    <Show when={props.rules.length === 0}>
                        <div class="logic-dialog__empty">
                            <Icon name="git-branch" size={32} />
                            <p>No rules yet. Add conditional logic to control field visibility, values, and page navigation.</p>
                        </div>
                    </Show>

                    <div class="logic-dialog__list">
                        <For each={props.rules}>
                            {(rule) => (
                                <div class="logic-dialog__rule-card">
                                    <div class="logic-dialog__rule-header">
                                        <div class="logic-dialog__rule-info">
                                            <label class="logic-dialog__toggle">
                                                <input
                                                    type="checkbox"
                                                    checked={rule.enabled}
                                                    onChange={() => props.onUpdateRule(rule.id, { ...rule, enabled: !rule.enabled })}
                                                />
                                                <span class="logic-dialog__toggle-slider" />
                                            </label>
                                            <span class="logic-dialog__rule-name">{rule.name}</span>
                                        </div>
                                        <div class="logic-dialog__rule-actions">
                                            <button class="logic-dialog__icon-btn" onClick={() => handleEdit(rule)} title="Edit">
                                                <Icon name="pencil" size={14} />
                                            </button>
                                            <button class="logic-dialog__icon-btn logic-dialog__icon-btn--danger" onClick={() => props.onDeleteRule(rule.id)} title="Delete">
                                                <Icon name="trash" size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div class="logic-dialog__rule-meta">
                                        <span class="logic-dialog__chip">{rule.trigger}</span>
                                        <span class="logic-dialog__chip">{rule.conditions.length} condition{rule.conditions.length !== 1 ? 's' : ''}</span>
                                        <span class="logic-dialog__chip">{rule.actions.length} action{rule.actions.length !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>
                            )}
                        </For>
                    </div>
                </Show>

                {/* Rule editor view */}
                <Show when={editingRule()}>
                    {(rule) => (
                        <div class="logic-dialog__editor">
                            <div class="logic-dialog__field">
                                <label>Rule Name</label>
                                <input
                                    type="text"
                                    value={rule().name}
                                    onInput={(e) => updateField('name', e.currentTarget.value)}
                                    placeholder="e.g. Show address when country selected"
                                />
                            </div>

                            <div class="logic-dialog__row">
                                <div class="logic-dialog__field">
                                    <label>Trigger</label>
                                    <select value={rule().trigger} onChange={(e) => updateField('trigger', e.currentTarget.value as FormRule['trigger'])}>
                                        <For each={TRIGGERS}>{(t) => <option value={t.value}>{t.label}</option>}</For>
                                    </select>
                                </div>
                                <div class="logic-dialog__field">
                                    <label>Condition Logic</label>
                                    <select value={rule().conditionOperator} onChange={(e) => updateField('conditionOperator', e.currentTarget.value as 'AND' | 'OR')}>
                                        <option value="AND">All conditions (AND)</option>
                                        <option value="OR">Any condition (OR)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Conditions */}
                            <div class="logic-dialog__section">
                                <div class="logic-dialog__section-header">
                                    <span>Conditions</span>
                                    <button class="logic-dialog__link-btn" onClick={addCondition}>
                                        <Icon name="plus" size={12} /> Add
                                    </button>
                                </div>
                                <For each={rule().conditions}>
                                    {(cond, idx) => (
                                        <div class="logic-dialog__condition-row">
                                            <input
                                                type="text"
                                                placeholder="Field ID"
                                                value={cond.fieldId}
                                                onInput={(e) => updateCondition(idx(), { fieldId: e.currentTarget.value })}
                                            />
                                            <select value={cond.operator} onChange={(e) => updateCondition(idx(), { operator: e.currentTarget.value as RuleCondition['operator'] })}>
                                                <For each={OPERATORS}>{(o) => <option value={o.value}>{o.label}</option>}</For>
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="Value"
                                                value={cond.value}
                                                onInput={(e) => updateCondition(idx(), { value: e.currentTarget.value })}
                                            />
                                            <button class="logic-dialog__remove-btn" onClick={() => removeCondition(idx())} disabled={rule().conditions.length <= 1}>
                                                <Icon name="close" size={12} />
                                            </button>
                                        </div>
                                    )}
                                </For>
                            </div>

                            {/* Actions */}
                            <div class="logic-dialog__section">
                                <div class="logic-dialog__section-header">
                                    <span>Actions</span>
                                    <button class="logic-dialog__link-btn" onClick={addAction}>
                                        <Icon name="plus" size={12} /> Add
                                    </button>
                                </div>
                                <For each={rule().actions}>
                                    {(act, idx) => (
                                        <div class="logic-dialog__condition-row">
                                            <select value={act.type} onChange={(e) => updateAction(idx(), { type: e.currentTarget.value as RuleAction['type'] })}>
                                                <For each={ACTION_TYPES}>{(a) => <option value={a.value}>{a.label}</option>}</For>
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="Target ID"
                                                value={act.targetId}
                                                onInput={(e) => updateAction(idx(), { targetId: e.currentTarget.value })}
                                            />
                                            <Show when={act.type === 'setValue'}>
                                                <input
                                                    type="text"
                                                    placeholder="Value"
                                                    value={act.value}
                                                    onInput={(e) => updateAction(idx(), { value: e.currentTarget.value })}
                                                />
                                            </Show>
                                            <button class="logic-dialog__remove-btn" onClick={() => removeAction(idx())} disabled={rule().actions.length <= 1}>
                                                <Icon name="close" size={12} />
                                            </button>
                                        </div>
                                    )}
                                </For>
                            </div>

                            <div class="logic-dialog__editor-actions">
                                <Button variant="text" size="sm" onClick={() => setEditingRule(null)}>Cancel</Button>
                                <Button variant="filled" size="sm" onClick={handleSave} disabled={!rule().name.trim()}>
                                    {isNew() ? 'Add Rule' : 'Save'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Show>
            </div>
        </Dialog>
    );
};
