/**
 * WorkflowDialog — Visual workflow builder for form automation
 * Migrated from AI-Powered Form Builder UI → SolidJS + M3
 */
import { splitProps, For, Show, createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import { Dialog } from '@formanywhere/ui/dialog';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import type { FormRule, RuleCondition, RuleAction } from '@formanywhere/shared/types';
import type { PageTab } from '../page-toolbar/PageToolbar';
import './dialogs.scss';

export interface WorkflowDialogProps {
    open: boolean;
    onClose: () => void;
    rules: FormRule[];
    onAddRule: (rule: FormRule) => void;
    onUpdateRule: (ruleId: string, rule: FormRule) => void;
    onDeleteRule: (ruleId: string) => void;
    pages: PageTab[];
}

export const WorkflowDialog: Component<WorkflowDialogProps> = (props) => {
    const [local] = splitProps(props, ['open', 'onClose', 'rules', 'onUpdateRule', 'onDeleteRule']);
    const [selectedRule, setSelectedRule] = createSignal<string | null>(null);

    const activeRules = () => local.rules.filter((r) => r.enabled);
    const inactiveRules = () => local.rules.filter((r) => !r.enabled);

    const toggleRule = (rule: FormRule) => {
        local.onUpdateRule(rule.id, { ...rule, enabled: !rule.enabled });
    };

    const getTriggerLabel = (trigger: FormRule['trigger']) => {
        const map: Record<string, string> = {
            onChange: 'Value Changed',
            onBlur: 'Field Left',
            onFocus: 'Field Focused',
            onSubmit: 'Form Submitted',
            onPageLoad: 'Page Loaded',
        };
        return map[trigger] || trigger;
    };

    const getActionLabel = (type: RuleAction['type']) => {
        const map: Record<string, string> = {
            show: 'Show Field',
            hide: 'Hide Field',
            enable: 'Enable Field',
            disable: 'Disable Field',
            require: 'Make Required',
            setValue: 'Set Value',
            navigate: 'Go to Page',
        };
        return map[type] || type;
    };

    const getOperatorLabel = (op: RuleCondition['operator']) => {
        const map: Record<string, string> = {
            equals: '=', notEquals: '≠', contains: '⊃', notContains: '⊅',
            greaterThan: '>', lessThan: '<', isEmpty: '∅', isNotEmpty: '≠∅',
        };
        return map[op] || op;
    };

    return (
        <Dialog
            open={local.open}
            onClose={local.onClose}
            title="Workflow Builder"
            icon={<Icon name="workflow" size={20} />}
            class="workflow-dialog"
            actions={
                <Button variant="text" size="sm" onClick={local.onClose}>Close</Button>
            }
        >
            <div class="workflow-dialog__content">
                <div class="workflow-dialog__sidebar">
                    <div class="workflow-dialog__sidebar-header">
                        <span>Rules ({local.rules.length})</span>
                    </div>

                    <Show when={activeRules().length > 0}>
                        <div class="workflow-dialog__group-label">Active</div>
                        <For each={activeRules()}>
                            {(rule) => (
                                <button
                                    class={`workflow-dialog__rule-item ${selectedRule() === rule.id ? 'workflow-dialog__rule-item--selected' : ''}`}
                                    onClick={() => setSelectedRule(rule.id)}
                                >
                                    <span class="workflow-dialog__rule-dot workflow-dialog__rule-dot--active" />
                                    <span class="workflow-dialog__rule-item-name">{rule.name}</span>
                                </button>
                            )}
                        </For>
                    </Show>

                    <Show when={inactiveRules().length > 0}>
                        <div class="workflow-dialog__group-label">Inactive</div>
                        <For each={inactiveRules()}>
                            {(rule) => (
                                <button
                                    class={`workflow-dialog__rule-item ${selectedRule() === rule.id ? 'workflow-dialog__rule-item--selected' : ''}`}
                                    onClick={() => setSelectedRule(rule.id)}
                                >
                                    <span class="workflow-dialog__rule-dot" />
                                    <span class="workflow-dialog__rule-item-name">{rule.name}</span>
                                </button>
                            )}
                        </For>
                    </Show>

                    <Show when={local.rules.length === 0}>
                        <div class="workflow-dialog__empty-sidebar">
                            <Icon name="workflow" size={24} />
                            <p>No rules. Create rules in the Logic dialog first.</p>
                        </div>
                    </Show>
                </div>

                <div class="workflow-dialog__canvas">
                    <Show when={selectedRule()} fallback={
                        <div class="workflow-dialog__empty-canvas">
                            <Icon name="mouse-pointer" size={32} />
                            <p>Select a rule to view its workflow</p>
                        </div>
                    }>
                        {(() => {
                            const rule = () => local.rules.find((r) => r.id === selectedRule());
                            return (
                                <Show when={rule()}>
                                    {(r) => (
                                        <div class="workflow-dialog__flow">
                                            <div class="workflow-dialog__flow-header">
                                                <h3>{r().name}</h3>
                                                <div class="workflow-dialog__flow-header-actions">
                                                    <label class="logic-dialog__toggle">
                                                        <input type="checkbox" checked={r().enabled} onChange={() => toggleRule(r())} />
                                                        <span class="logic-dialog__toggle-slider" />
                                                    </label>
                                                    <button class="logic-dialog__icon-btn logic-dialog__icon-btn--danger" onClick={() => { local.onDeleteRule(r().id); setSelectedRule(null); }}>
                                                        <Icon name="trash" size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Trigger node */}
                                            <div class="workflow-dialog__node workflow-dialog__node--trigger">
                                                <div class="workflow-dialog__node-icon"><Icon name="lightning" size={16} /></div>
                                                <div class="workflow-dialog__node-body">
                                                    <span class="workflow-dialog__node-label">Trigger</span>
                                                    <span class="workflow-dialog__node-value">{getTriggerLabel(r().trigger)}</span>
                                                </div>
                                            </div>
                                            <div class="workflow-dialog__connector" />

                                            {/* Conditions */}
                                            <div class="workflow-dialog__node workflow-dialog__node--condition">
                                                <div class="workflow-dialog__node-icon"><Icon name="git-branch" size={16} /></div>
                                                <div class="workflow-dialog__node-body">
                                                    <span class="workflow-dialog__node-label">
                                                        Conditions ({r().conditionOperator})
                                                    </span>
                                                    <For each={r().conditions}>
                                                        {(c) => (
                                                            <div class="workflow-dialog__node-detail">
                                                                <code>{c.fieldId || '?'}</code>
                                                                <span class="workflow-dialog__op">{getOperatorLabel(c.operator)}</span>
                                                                <code>{c.value || '—'}</code>
                                                            </div>
                                                        )}
                                                    </For>
                                                </div>
                                            </div>
                                            <div class="workflow-dialog__connector" />

                                            {/* Actions */}
                                            <For each={r().actions}>
                                                {(act, idx) => (
                                                    <>
                                                        <div class="workflow-dialog__node workflow-dialog__node--action">
                                                            <div class="workflow-dialog__node-icon"><Icon name="play" size={16} /></div>
                                                            <div class="workflow-dialog__node-body">
                                                                <span class="workflow-dialog__node-label">{getActionLabel(act.type)}</span>
                                                                <span class="workflow-dialog__node-value">Target: {act.targetId || '—'}</span>
                                                            </div>
                                                        </div>
                                                        <Show when={idx() < r().actions.length - 1}>
                                                            <div class="workflow-dialog__connector" />
                                                        </Show>
                                                    </>
                                                )}
                                            </For>
                                        </div>
                                    )}
                                </Show>
                            );
                        })()}
                    </Show>
                </div>
            </div>
        </Dialog>
    );
};
