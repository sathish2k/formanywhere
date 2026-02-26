/**
 * NodePalette — Left sidebar with draggable node types
 * Uses inline styles + @formanywhere/ui only (no SCSS classes)
 */
import { For } from 'solid-js';
import type { Component, JSX } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';
import { Typography } from '@formanywhere/ui/typography';
import { Tooltip } from '@formanywhere/ui/tooltip';
import { Stack } from '@formanywhere/ui/stack';
import { Box } from '@formanywhere/ui/box';
import { Divider } from '@formanywhere/ui/divider';
import type { WorkflowNodeType } from '@formanywhere/shared/types';
import { WORKFLOW_TEMPLATES, type WorkflowTemplate } from '@formanywhere/domain/form';

export interface NodeTypeItem {
    type: WorkflowNodeType;
    label: string;
    icon: string;
    color: string;
    description: string;
}

export const NODE_TYPES: NodeTypeItem[] = [
    { type: 'trigger', label: 'Trigger', icon: 'zap', color: '#E65100', description: 'When to run workflow' },
    { type: 'page', label: 'Page', icon: 'file-text', color: '#7D5260', description: 'Form page' },
    { type: 'callApi', label: 'Call API', icon: 'cloud', color: '#6750A4', description: 'Make an API request' },
    { type: 'setData', label: 'Set Data', icon: 'database', color: '#006B5F', description: 'Map response to fields' },
    { type: 'fetchOptions', label: 'Fetch Options', icon: 'list', color: '#FF9800', description: 'Load select options' },
    { type: 'showDialog', label: 'Show Dialog', icon: 'message-square', color: '#D81B60', description: 'Display a message' },
    { type: 'redirect', label: 'Redirect', icon: 'external-link', color: '#C62828', description: 'Navigate to URL' },
    { type: 'condition', label: 'Condition', icon: 'git-branch', color: '#FF8F00', description: 'Branch on field value' },
];

export const getNodeColor = (type: WorkflowNodeType): string =>
    NODE_TYPES.find((n) => n.type === type)?.color ?? '#6750A4';

export const getNodeIcon = (type: WorkflowNodeType): string =>
    NODE_TYPES.find((n) => n.type === type)?.icon ?? 'circle';

export interface NodePaletteProps {
    onAddNode: (type: WorkflowNodeType) => void;
    onAddTemplate?: (template: WorkflowTemplate) => void;
}


export const NodePalette: Component<NodePaletteProps> = (props) => {
    return (
        <Stack
            direction="column"
            style={{
                width: '180px',
                'flex-shrink': '0',
                'border-right': '1px solid var(--m3-color-outline-variant, #C4C7C5)',
                'overflow-y': 'auto',
                padding: '12px',
                background: 'var(--m3-color-surface-container-low, #F7F2FA)',
            }}
        >
            <Typography
                variant="label-small"
                style={{
                    'font-size': '0.6875rem',
                    'font-weight': '700',
                    'text-transform': 'uppercase',
                    'letter-spacing': '0.08em',
                    color: 'var(--m3-color-on-surface-variant, #49454F)',
                    'margin-bottom': '8px',
                }}
            >
                Nodes
            </Typography>
            <Stack direction="column" gap="xs">
                <For each={NODE_TYPES}>
                    {(item) => (
                        <Tooltip text={item.description} position="right">
                            <button
                                onClick={() => props.onAddNode(item.type)}
                                style={{
                                    display: 'flex',
                                    'align-items': 'center',
                                    gap: '8px',
                                    width: '100%',
                                    padding: '8px',
                                    border: 'none',
                                    'border-radius': '10px',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    'text-align': 'left',
                                }}
                            >
                                <Stack
                                    align="center"
                                    justify="center"
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        'border-radius': '7px',
                                        'flex-shrink': '0',
                                        background: `${item.color}20`,
                                        color: item.color,
                                    }}
                                >
                                    <Icon name={item.icon} size={16} />
                                </Stack>
                                <Stack direction="column" style={{ 'min-width': '0' }}>
                                    <Typography variant="label-medium" style={{ 'font-size': '0.75rem', 'font-weight': '600', color: 'var(--m3-color-on-surface, #1C1B1F)' }}>
                                        {item.label}
                                    </Typography>
                                    <Typography variant="body-small" style={{ 'font-size': '0.625rem', color: 'var(--m3-color-on-surface-variant, #49454F)', overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' }}>
                                        {item.description}
                                    </Typography>
                                </Stack>
                            </button>
                        </Tooltip>
                    )}
                </For>
            </Stack>

            {props.onAddTemplate && (
                <>
                    <Box style={{ padding: '8px 0' }}>
                        <Divider />
                    </Box>
                    <Typography
                        variant="label-small"
                        style={{
                            'font-size': '0.6875rem',
                            'font-weight': '700',
                            'text-transform': 'uppercase',
                            'letter-spacing': '0.08em',
                            color: 'var(--m3-color-on-surface-variant, #49454F)',
                            'margin-bottom': '8px',
                        }}
                    >
                        Templates
                    </Typography>
                    <Stack direction="column" gap="xs">
                        <For each={WORKFLOW_TEMPLATES}>
                            {(item) => (
                                <Tooltip text={item.description} position="right">
                                    <button
                                        onClick={() => props.onAddTemplate!(item)}
                                        style={{
                                            display: 'flex',
                                            'align-items': 'center',
                                            gap: '8px',
                                            width: '100%',
                                            padding: '8px',
                                            border: 'none',
                                            'border-radius': '10px',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                            'text-align': 'left',
                                        }}
                                    >
                                        <Stack
                                            align="center"
                                            justify="center"
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                'border-radius': '7px',
                                                'flex-shrink': '0',
                                                background: `var(--m3-color-secondary-container, #E8DEF8)`,
                                                color: `var(--m3-color-on-secondary-container, #1D192B)`,
                                            }}
                                        >
                                            <Icon name="copy" size={16} />
                                        </Stack>
                                        <Stack direction="column" style={{ 'min-width': '0' }}>
                                            <Typography variant="label-medium" style={{ 'font-size': '0.75rem', 'font-weight': '600', color: 'var(--m3-color-on-surface, #1C1B1F)' }}>
                                                {item.name}
                                            </Typography>
                                            <Typography variant="body-small" style={{ 'font-size': '0.625rem', color: 'var(--m3-color-on-surface-variant, #49454F)', overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' }}>
                                                {item.description}
                                            </Typography>
                                        </Stack>
                                    </button>
                                </Tooltip>
                            )}
                        </For>
                    </Stack>
                </>
            )}
        </Stack>
    );
};
