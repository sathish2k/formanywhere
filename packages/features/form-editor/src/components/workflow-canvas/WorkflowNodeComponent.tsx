/**
 * WorkflowNodeComponent — Individual node on the canvas with input/output ports
 * Uses inline styles + @formanywhere/ui only (no SCSS classes)
 */
import { Show } from 'solid-js';
import type { Component, JSX } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';
import { Typography } from '@formanywhere/ui/typography';
import { Stack } from '@formanywhere/ui/stack';
import { Box } from '@formanywhere/ui/box';
import type { WorkflowNode } from '@formanywhere/shared/types';
import { getNodeColor, getNodeIcon } from './NodePalette';

export interface WorkflowNodeComponentProps {
    node: WorkflowNode;
    selected: boolean;
    onSelect: (nodeId: string) => void;
    onPortMouseDown: (nodeId: string, port: 'in' | 'out' | 'true' | 'false', e: MouseEvent) => void;
    onDragStart: (nodeId: string, e: MouseEvent) => void;
}

const portBase: JSX.CSSProperties = {
    position: 'absolute',
    width: '12px',
    height: '12px',
    'border-radius': '50%',
    border: '2px solid var(--m3-color-outline, #79747E)',
    background: 'var(--m3-color-surface-container-lowest, #fff)',
    cursor: 'crosshair',
    'z-index': '10',
};

const portIn: JSX.CSSProperties = {
    ...portBase,
    top: '-6px',
    left: '50%',
    transform: 'translateX(-50%)',
};

const portOut: JSX.CSSProperties = {
    ...portBase,
    bottom: '-6px',
    left: '50%',
    transform: 'translateX(-50%)',
};

const portBranch = (color: string): JSX.CSSProperties => ({
    ...portBase,
    position: 'relative',
    bottom: 'auto',
    left: 'auto',
    transform: 'none',
    'border-color': color,
});

export const WorkflowNodeComponent: Component<WorkflowNodeComponentProps> = (props) => {
    const color = () => getNodeColor(props.node.type);
    const icon = () => getNodeIcon(props.node.type);
    const isCondition = () => props.node.type === 'condition';

    const handleMouseDown = (e: MouseEvent) => {
        // Don't hijack port clicks
        const target = e.target as HTMLElement;
        if (target.dataset.port) return;
        props.onSelect(props.node.id);
        props.onDragStart(props.node.id, e);
        e.stopPropagation();
    };

    return (
        <div
            style={{
                position: 'absolute',
                width: '220px',
                'border-radius': '12px',
                border: `${props.selected ? '2px' : '1.5px'} solid ${props.selected ? color() : 'var(--m3-color-outline-variant, #C4C7C5)'}`,
                background: 'var(--m3-color-surface-container-lowest, #fff)',
                'box-shadow': props.selected ? '0 2px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.08)',
                cursor: 'move',
                'user-select': 'none',
                left: `${props.node.position.x}px`,
                top: `${props.node.position.y}px`,
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Input port */}
            <div
                style={portIn}
                onMouseDown={(e) => { e.stopPropagation(); props.onPortMouseDown(props.node.id, 'in', e); }}
                data-node-id={props.node.id}
                data-port="in"
            />

            {/* Node content */}
            <Stack direction="row" align="center" gap="xs" style={{ padding: '8px 10px', 'border-radius': '10px 10px 0 0', background: `${color()}15` }}>
                <Stack align="center" justify="center" style={{ width: '26px', height: '26px', 'border-radius': '7px', 'flex-shrink': '0', background: `${color()}25`, color: color() }}>
                    <Icon name={icon()} size={14} />
                </Stack>
                <Stack direction="column" style={{ 'min-width': '0' }}>
                    <Typography variant="label-small" style={{ 'font-size': '0.5625rem', 'font-weight': '700', 'text-transform': 'uppercase', 'letter-spacing': '0.06em', color: 'var(--m3-color-on-surface-variant, #49454F)', opacity: '0.7' }}>{props.node.type}</Typography>
                    <Typography variant="label-medium" style={{ overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap', color: 'var(--m3-color-on-surface, #1C1B1F)' }}>{props.node.label}</Typography>
                </Stack>
            </Stack>

            {/* Config preview */}
            <Show when={props.node.config.api?.url}>
                <Box style={{ padding: '4px 10px 8px' }}>
                    <code style={{ display: 'block', 'font-size': '0.625rem', 'font-family': "'SF Mono', 'Menlo', monospace", color: 'var(--m3-color-on-surface-variant, #49454F)', overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap', background: 'var(--m3-color-surface-container-highest, #E6E0E9)', padding: '2px 6px', 'border-radius': '4px' }}>{props.node.config.api?.method ?? 'GET'} {props.node.config.api?.url}</code>
                </Box>
            </Show>
            <Show when={props.node.config.redirectUrl}>
                <Box style={{ padding: '4px 10px 8px' }}>
                    <code style={{ display: 'block', 'font-size': '0.625rem', 'font-family': "'SF Mono', 'Menlo', monospace", color: 'var(--m3-color-on-surface-variant, #49454F)', overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap', background: 'var(--m3-color-surface-container-highest, #E6E0E9)', padding: '2px 6px', 'border-radius': '4px' }}>{props.node.config.redirectUrl}</code>
                </Box>
            </Show>
            <Show when={props.node.config.dialogTitle}>
                <Box style={{ padding: '4px 10px 8px' }}>
                    <code style={{ display: 'block', 'font-size': '0.625rem', 'font-family': "'SF Mono', 'Menlo', monospace", color: 'var(--m3-color-on-surface-variant, #49454F)', overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap', background: 'var(--m3-color-surface-container-highest, #E6E0E9)', padding: '2px 6px', 'border-radius': '4px' }}>{props.node.config.dialogTitle}</code>
                </Box>
            </Show>
            <Show when={props.node.config.pageId}>
                <Box style={{ padding: '4px 10px 8px' }}>
                    <code style={{ display: 'block', 'font-size': '0.625rem', 'font-family': "'SF Mono', 'Menlo', monospace", color: 'var(--m3-color-on-surface-variant, #49454F)', overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap', background: 'var(--m3-color-surface-container-highest, #E6E0E9)', padding: '2px 6px', 'border-radius': '4px' }}>Page: {props.node.config.pageId}</code>
                </Box>
            </Show>

            {/* Output ports */}
            <Show when={!isCondition()}>
                <div
                    style={portOut}
                    onMouseDown={(e) => { e.stopPropagation(); props.onPortMouseDown(props.node.id, 'out', e); }}
                    data-node-id={props.node.id}
                    data-port="out"
                />
            </Show>
            <Show when={isCondition()}>
                <Stack direction="row" justify="around" style={{ padding: '4px 10px 8px' }}>
                    <Stack align="center" gap="xs">
                        <span style={{ 'font-size': '0.5625rem', 'font-weight': '700', color: '#4CAF50' }}>✓</span>
                        <div
                            style={portBranch('#4CAF50')}
                            onMouseDown={(e) => { e.stopPropagation(); props.onPortMouseDown(props.node.id, 'true', e); }}
                            data-node-id={props.node.id}
                            data-port="true"
                        />
                    </Stack>
                    <Stack align="center" gap="xs">
                        <span style={{ 'font-size': '0.5625rem', 'font-weight': '700', color: '#F44336' }}>✗</span>
                        <div
                            style={portBranch('#F44336')}
                            onMouseDown={(e) => { e.stopPropagation(); props.onPortMouseDown(props.node.id, 'false', e); }}
                            data-node-id={props.node.id}
                            data-port="false"
                        />
                    </Stack>
                </Stack>
            </Show>
        </div>
    );
};
