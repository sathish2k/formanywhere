/**
 * NodeConfigPanel — Right panel for configuring the selected node
 * Uses inline styles + @formanywhere/ui only (no SCSS classes)
 */
import { Show, For } from 'solid-js';
import type { Component, JSX } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Button } from '@formanywhere/ui/button';
import { Typography } from '@formanywhere/ui/typography';
import { Stack } from '@formanywhere/ui/stack';
import { Box } from '@formanywhere/ui/box';
import type { WorkflowNode, WorkflowNodeConfig, DataMappingEntry, FormElement, TriggerType } from '@formanywhere/shared/types';
import type { PageTab } from '../page-toolbar/PageToolbar';

export interface NodeConfigPanelProps {
    node: WorkflowNode | null;
    pages: PageTab[];
    elements: FormElement[];
    onUpdate: (nodeId: string, config: WorkflowNodeConfig) => void;
    onUpdateLabel: (nodeId: string, label: string) => void;
    onDelete: (nodeId: string) => void;
}

/** Flatten nested elements into a flat list of field-type elements */
function flattenFields(elements: FormElement[]): FormElement[] {
    const result: FormElement[] = [];
    const layoutTypes = new Set(['container', 'grid', 'section', 'card', 'grid-column', 'divider', 'spacer', 'heading', 'logo', 'text-block']);
    for (const el of elements) {
        if (!layoutTypes.has(el.type)) {
            result.push(el);
        }
        if (el.elements) {
            result.push(...flattenFields(el.elements));
        }
    }
    return result;
}

/* ── Inline Styles ───────────────────────────────────────────────────────────── */

const inputStyle: JSX.CSSProperties = {
    padding: '6px 8px',
    border: '1px solid var(--m3-color-outline-variant, #C4C7C5)',
    'border-radius': '7px',
    background: 'var(--m3-color-surface-container-lowest, #fff)',
    color: 'var(--m3-color-on-surface, #1C1B1F)',
    'font-size': '0.75rem',
    width: '100%',
    'box-sizing': 'border-box',
    outline: 'none',
};

const selectStyle: JSX.CSSProperties = {
    ...inputStyle,
};

const textareaStyle: JSX.CSSProperties = {
    ...inputStyle,
    resize: 'vertical',
    'min-height': '60px',
    'font-family': "'SF Mono', 'Menlo', monospace",
    'font-size': '0.6875rem',
    'line-height': '1.5',
};

const labelStyle: JSX.CSSProperties = {
    'font-size': '0.6875rem',
    'font-weight': '600',
    color: 'var(--m3-color-on-surface-variant, #49454F)',
    'text-transform': 'uppercase',
    'letter-spacing': '0.04em',
};

const S = {
    typeLabel: {
        'font-size': '0.6875rem',
        'font-weight': '700',
        'text-transform': 'uppercase',
        'letter-spacing': '0.06em',
        color: 'var(--m3-color-on-surface-variant, #49454F)',
    } as JSX.CSSProperties,

    sectionLabel: {
        'font-size': '0.6875rem',
        'font-weight': '700',
        'text-transform': 'uppercase',
        'letter-spacing': '0.04em',
        color: 'var(--m3-color-on-surface-variant, #49454F)',
    } as JSX.CSSProperties,

    addBtn: {
        display: 'inline-flex',
        'align-items': 'center',
        gap: '3px',
        border: 'none',
        background: 'transparent',
        color: 'var(--m3-color-primary, #6750A4)',
        'font-size': '0.6875rem',
        'font-weight': '600',
        cursor: 'pointer',
    } as JSX.CSSProperties,

    mappingRow: {
        display: 'flex',
        'align-items': 'center',
        gap: '4px',
    } as JSX.CSSProperties,

    mappingInput: {
        ...inputStyle,
        flex: '1',
        width: 'auto',
        'font-family': "'SF Mono', 'Menlo', monospace",
        'font-size': '0.6875rem',
    } as JSX.CSSProperties,

    mappingSelect: {
        ...selectStyle,
        flex: '1',
        width: 'auto',
        'font-family': "'SF Mono', 'Menlo', monospace",
        'font-size': '0.6875rem',
    } as JSX.CSSProperties,

    mappingArrow: {
        'flex-shrink': '0',
        'font-weight': '700',
        color: 'var(--m3-color-primary, #6750A4)',
        'font-size': '0.875rem',
    } as JSX.CSSProperties,
};

export const NodeConfigPanel: Component<NodeConfigPanelProps> = (props) => {
    const fields = () => flattenFields(props.elements);

    const updateConfig = (partial: Partial<WorkflowNodeConfig>) => {
        const n = props.node;
        if (!n) return;
        props.onUpdate(n.id, { ...n.config, ...partial });
    };

    const updateApi = (partial: Record<string, unknown>) => {
        const n = props.node;
        if (!n) return;
        const api = { url: '', method: 'GET' as const, ...n.config.api, ...partial };
        props.onUpdate(n.id, { ...n.config, api });
    };

    const addMapping = () => {
        const n = props.node;
        if (!n) return;
        const mappings = [...(n.config.dataMapping ?? []), { from: '', to: '' }];
        updateConfig({ dataMapping: mappings });
    };

    const updateMapping = (idx: number, partial: Partial<DataMappingEntry>) => {
        const n = props.node;
        if (!n) return;
        const mappings = [...(n.config.dataMapping ?? [])];
        mappings[idx] = { ...mappings[idx], ...partial };
        updateConfig({ dataMapping: mappings });
    };

    const removeMapping = (idx: number) => {
        const n = props.node;
        if (!n) return;
        const mappings = (n.config.dataMapping ?? []).filter((_, i) => i !== idx);
        updateConfig({ dataMapping: mappings });
    };

    /** Reusable field picker dropdown */
    const FieldPicker = (pickerProps: { label: string; value: string; onChange: (id: string) => void }) => (
        <Stack gap="xs">
            <label style={labelStyle}>{pickerProps.label}</label>
            <select
                style={selectStyle}
                value={pickerProps.value}
                onChange={(e) => pickerProps.onChange(e.currentTarget.value)}
            >
                <option value="">Select field...</option>
                <For each={fields()}>
                    {(el) => <option value={el.id}>{el.label} ({el.id})</option>}
                </For>
            </select>
        </Stack>
    );

    return (
        <Box style={{ width: '260px', 'flex-shrink': '0', 'border-left': '1px solid var(--m3-color-outline-variant, #C4C7C5)', 'overflow-y': 'auto', background: 'var(--m3-color-surface-container-low, #F7F2FA)' }}>
            <Show when={props.node} fallback={
                <Stack align="center" justify="center" gap="sm" style={{ height: '100%', 'text-align': 'center', color: 'var(--m3-color-on-surface-variant, #49454F)', padding: '24px' }}>
                    <Icon name="settings" size={24} />
                    <Typography variant="body-medium">Select a node to configure</Typography>
                </Stack>
            }>
                {(node) => (
                    <Stack gap="sm" style={{ padding: '12px' }}>
                        <Stack direction="row" align="center" justify="between">
                            <span style={S.typeLabel}>{node().type}</span>
                            <IconButton
                                variant="standard"
                                icon={<Icon name="trash" size={14} />}
                                onClick={() => props.onDelete(node().id)}
                                aria-label="Delete node"
                            />
                        </Stack>

                        {/* Label */}
                        <Stack gap="xs">
                            <label style={labelStyle}>Label</label>
                            <input
                                type="text"
                                style={inputStyle}
                                value={node().label}
                                onInput={(e) => props.onUpdateLabel(node().id, e.currentTarget.value)}
                                placeholder="Node label"
                            />
                        </Stack>

                        {/* ═══ Trigger config ═══ */}
                        <Show when={node().type === 'trigger'}>
                            <Stack gap="xs" style={{ 'padding-top': '4px', 'border-top': '1px solid var(--m3-color-outline-variant, #C4C7C5)' }}>
                                <span style={S.sectionLabel}>Trigger Event</span>
                                <Stack gap="xs">
                                    <label style={labelStyle}>When</label>
                                    <select
                                        style={selectStyle}
                                        value={node().config.triggerType ?? ''}
                                        onChange={(e) => updateConfig({ triggerType: e.currentTarget.value as TriggerType })}
                                    >
                                        <option value="">Select event...</option>
                                        <option value="pageLoad">Page Load</option>
                                        <option value="fieldChange">Field Change</option>
                                        <option value="formSubmit">Form Submit</option>
                                    </select>
                                </Stack>
                                <Show when={node().config.triggerType === 'fieldChange'}>
                                    <FieldPicker
                                        label="Watch Field"
                                        value={node().config.triggerFieldId ?? ''}
                                        onChange={(id) => updateConfig({ triggerFieldId: id })}
                                    />
                                </Show>
                            </Stack>
                        </Show>

                        {/* ═══ Page config ═══ */}
                        <Show when={node().type === 'page'}>
                            <Stack gap="xs">
                                <label style={labelStyle}>Page</label>
                                <select
                                    style={selectStyle}
                                    value={node().config.pageId ?? ''}
                                    onChange={(e) => updateConfig({ pageId: e.currentTarget.value })}
                                >
                                    <option value="">Select page...</option>
                                    <For each={props.pages}>
                                        {(page) => <option value={page.id}>{page.title}</option>}
                                    </For>
                                </select>
                            </Stack>
                        </Show>

                        {/* ═══ API config (callApi / fetchOptions) ═══ */}
                        <Show when={node().type === 'callApi' || node().type === 'fetchOptions'}>
                            <Stack gap="xs" style={{ 'padding-top': '4px', 'border-top': '1px solid var(--m3-color-outline-variant, #C4C7C5)' }}>
                                <span style={S.sectionLabel}>API Configuration</span>
                                <Stack direction="row" gap="xs">
                                    <Stack gap="xs" style={{ width: '100px' }}>
                                        <label style={labelStyle}>Method</label>
                                        <select
                                            style={selectStyle}
                                            value={node().config.api?.method ?? 'GET'}
                                            onChange={(e) => updateApi({ method: e.currentTarget.value })}
                                        >
                                            <option value="GET">GET</option>
                                            <option value="POST">POST</option>
                                            <option value="PUT">PUT</option>
                                            <option value="DELETE">DELETE</option>
                                        </select>
                                    </Stack>
                                    <Stack gap="xs" style={{ flex: '1' }}>
                                        <label style={labelStyle}>URL</label>
                                        <input
                                            type="text"
                                            style={inputStyle}
                                            value={node().config.api?.url ?? ''}
                                            onInput={(e) => updateApi({ url: e.currentTarget.value })}
                                            placeholder="https://api.example.com/{{fieldId}}"
                                        />
                                    </Stack>
                                </Stack>
                                <Show when={node().config.api?.method !== 'GET'}>
                                    <Stack gap="xs">
                                        <label style={labelStyle}>Body Template (JSON)</label>
                                        <textarea
                                            style={textareaStyle}
                                            value={node().config.api?.bodyTemplate ?? ''}
                                            onInput={(e) => updateApi({ bodyTemplate: e.currentTarget.value })}
                                            placeholder={'{\n  "key": "{{fieldId}}"\n}'}
                                            rows={4}
                                        />
                                    </Stack>
                                </Show>
                            </Stack>
                        </Show>

                        {/* ═══ Fetch options config ═══ */}
                        <Show when={node().type === 'fetchOptions'}>
                            <Stack gap="xs" style={{ 'padding-top': '4px', 'border-top': '1px solid var(--m3-color-outline-variant, #C4C7C5)' }}>
                                <span style={S.sectionLabel}>Options Mapping</span>
                                <FieldPicker
                                    label="Target Select Field"
                                    value={node().config.targetFieldId ?? ''}
                                    onChange={(id) => updateConfig({ targetFieldId: id })}
                                />
                                <Stack direction="row" gap="xs">
                                    <Stack gap="xs">
                                        <label style={labelStyle}>Response Path</label>
                                        <input
                                            type="text"
                                            style={inputStyle}
                                            value={node().config.responsePath ?? ''}
                                            onInput={(e) => updateConfig({ responsePath: e.currentTarget.value })}
                                            placeholder="e.g. data.items"
                                        />
                                    </Stack>
                                </Stack>
                                <Stack direction="row" gap="xs">
                                    <Stack gap="xs">
                                        <label style={labelStyle}>Label Key</label>
                                        <input
                                            type="text"
                                            style={inputStyle}
                                            value={node().config.labelKey ?? ''}
                                            onInput={(e) => updateConfig({ labelKey: e.currentTarget.value })}
                                            placeholder="name"
                                        />
                                    </Stack>
                                    <Stack gap="xs">
                                        <label style={labelStyle}>Value Key</label>
                                        <input
                                            type="text"
                                            style={inputStyle}
                                            value={node().config.valueKey ?? ''}
                                            onInput={(e) => updateConfig({ valueKey: e.currentTarget.value })}
                                            placeholder="id"
                                        />
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Show>

                        {/* ═══ Set Data mapping ═══ */}
                        <Show when={node().type === 'setData'}>
                            <Stack gap="xs" style={{ 'padding-top': '4px', 'border-top': '1px solid var(--m3-color-outline-variant, #C4C7C5)' }}>
                                <Stack direction="row" align="center" justify="between">
                                    <span style={S.sectionLabel}>Data Mapping</span>
                                    <button style={S.addBtn} onClick={addMapping}>
                                        <Icon name="plus" size={12} /> Add
                                    </button>
                                </Stack>
                                <For each={node().config.dataMapping ?? []}>
                                    {(mapping, idx) => (
                                        <Stack direction="row" align="center" gap="xs">
                                            <input
                                                type="text"
                                                style={S.mappingInput}
                                                value={mapping.from}
                                                onInput={(e) => updateMapping(idx(), { from: e.currentTarget.value })}
                                                placeholder="response.path"
                                            />
                                            <span style={S.mappingArrow}>→</span>
                                            <select
                                                style={S.mappingSelect}
                                                value={mapping.to}
                                                onChange={(e) => updateMapping(idx(), { to: e.currentTarget.value })}
                                            >
                                                <option value="">Target field…</option>
                                                <For each={fields()}>
                                                    {(el) => <option value={el.id}>{el.label}</option>}
                                                </For>
                                            </select>
                                            <IconButton
                                                variant="standard"
                                                icon={<Icon name="close" size={12} />}
                                                onClick={() => removeMapping(idx())}
                                                aria-label="Remove mapping"
                                                style={{ width: '22px', height: '22px' }}
                                            />
                                        </Stack>
                                    )}
                                </For>
                            </Stack>
                        </Show>

                        {/* ═══ Show Dialog config ═══ */}
                        <Show when={node().type === 'showDialog'}>
                            <Stack gap="xs">
                                <label style={labelStyle}>Title</label>
                                <input
                                    type="text"
                                    style={inputStyle}
                                    value={node().config.dialogTitle ?? ''}
                                    onInput={(e) => updateConfig({ dialogTitle: e.currentTarget.value })}
                                    placeholder="Dialog title"
                                />
                            </Stack>
                            <Stack gap="xs">
                                <label style={labelStyle}>Message</label>
                                <textarea
                                    style={textareaStyle}
                                    value={node().config.dialogMessage ?? ''}
                                    onInput={(e) => updateConfig({ dialogMessage: e.currentTarget.value })}
                                    placeholder="Message text (supports {{fieldId}})"
                                    rows={3}
                                />
                            </Stack>
                        </Show>

                        {/* ═══ Redirect config ═══ */}
                        <Show when={node().type === 'redirect'}>
                            <Stack gap="xs">
                                <label style={labelStyle}>Redirect URL</label>
                                <input
                                    type="text"
                                    style={inputStyle}
                                    value={node().config.redirectUrl ?? ''}
                                    onInput={(e) => updateConfig({ redirectUrl: e.currentTarget.value })}
                                    placeholder="https://example.com/{{fieldId}}"
                                />
                            </Stack>
                            <Stack direction="row" align="center" gap="xs">
                                <input
                                    type="checkbox"
                                    checked={node().config.redirectNewTab ?? false}
                                    onChange={(e) => updateConfig({ redirectNewTab: e.currentTarget.checked })}
                                    style={{ width: '16px', height: '16px', 'accent-color': 'var(--m3-color-primary, #6750A4)' }}
                                />
                                <label style={{ ...labelStyle, 'text-transform': 'none', 'font-size': '0.75rem' }}>Open in new tab</label>
                            </Stack>
                        </Show>

                        {/* ═══ Condition config ═══ */}
                        <Show when={node().type === 'condition'}>
                            <Stack gap="xs" style={{ 'padding-top': '4px', 'border-top': '1px solid var(--m3-color-outline-variant, #C4C7C5)' }}>
                                <span style={S.sectionLabel}>Condition</span>
                                <FieldPicker
                                    label="Field"
                                    value={node().config.conditionField ?? ''}
                                    onChange={(id) => updateConfig({ conditionField: id })}
                                />
                                <Stack direction="row" gap="xs">
                                    <Stack gap="xs">
                                        <label style={labelStyle}>Operator</label>
                                        <select
                                            style={selectStyle}
                                            value={node().config.conditionOperator ?? 'equals'}
                                            onChange={(e) => updateConfig({ conditionOperator: e.currentTarget.value as any })}
                                        >
                                            <option value="equals">Equals</option>
                                            <option value="notEquals">Not Equals</option>
                                            <option value="contains">Contains</option>
                                            <option value="greaterThan">Greater Than</option>
                                            <option value="lessThan">Less Than</option>
                                            <option value="isEmpty">Is Empty</option>
                                            <option value="isNotEmpty">Is Not Empty</option>
                                        </select>
                                    </Stack>
                                    <Stack gap="xs">
                                        <label style={labelStyle}>Value</label>
                                        <input
                                            type="text"
                                            style={inputStyle}
                                            value={node().config.conditionValue ?? ''}
                                            onInput={(e) => updateConfig({ conditionValue: e.currentTarget.value })}
                                            placeholder="Expected value"
                                        />
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Show>
                    </Stack>
                )}
            </Show>
        </Box>
    );
};
