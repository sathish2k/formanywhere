/**
 * WorkflowEdgeSvg — SVG path for a connection between two nodes
 */
import type { Component } from 'solid-js';
import type { WorkflowEdge, WorkflowNode, EdgeSourcePort } from '@formanywhere/shared/types';

/** Port position offsets relative to node top-left */
const NODE_WIDTH = 220;
const PORT_IN_Y = 0;        // top of node
const PORT_OUT_Y = 120;     // bottom of node (approximate)
const PORT_CENTER_X = NODE_WIDTH / 2;
const TRUE_PORT_X = NODE_WIDTH * 0.3;
const FALSE_PORT_X = NODE_WIDTH * 0.7;

/** Get the canvas-relative position of a port */
export function getPortPosition(
    node: WorkflowNode,
    port: 'in' | EdgeSourcePort,
): { x: number; y: number } {
    const baseX = node.position.x;
    const baseY = node.position.y;

    if (port === 'in') {
        return { x: baseX + PORT_CENTER_X, y: baseY + PORT_IN_Y };
    }
    if (port === 'true') {
        return { x: baseX + TRUE_PORT_X, y: baseY + PORT_OUT_Y };
    }
    if (port === 'false') {
        return { x: baseX + FALSE_PORT_X, y: baseY + PORT_OUT_Y };
    }
    // 'out'
    return { x: baseX + PORT_CENTER_X, y: baseY + PORT_OUT_Y };
}

/** Build a smooth cubic bezier path between two points */
function buildCurvePath(
    x1: number, y1: number,
    x2: number, y2: number,
): string {
    const dy = Math.abs(y2 - y1);
    const controlOffset = Math.max(50, dy * 0.4);
    return `M ${x1} ${y1} C ${x1} ${y1 + controlOffset}, ${x2} ${y2 - controlOffset}, ${x2} ${y2}`;
}

export interface WorkflowEdgeSvgProps {
    edge: WorkflowEdge;
    sourceNode: WorkflowNode;
    targetNode: WorkflowNode;
    selected?: boolean;
    onSelect?: (edgeId: string) => void;
}

export const WorkflowEdgeSvg: Component<WorkflowEdgeSvgProps> = (props) => {
    const src = () => getPortPosition(props.sourceNode, props.edge.sourcePort);
    const tgt = () => getPortPosition(props.targetNode, 'in');
    const path = () => buildCurvePath(src().x, src().y, tgt().x, tgt().y);

    const strokeColor = () => {
        if (props.edge.sourcePort === 'true') return '#4CAF50';
        if (props.edge.sourcePort === 'false') return '#F44336';
        return 'var(--m3-color-outline, #79747E)';
    };

    return (
        <g>
            {/* Invisible fat path for easier click target */}
            <path
                d={path()}
                fill="none"
                stroke="transparent"
                stroke-width={12}
                style={{ cursor: 'pointer' }}
                onClick={() => props.onSelect?.(props.edge.id)}
            />
            {/* Visible edge */}
            <path
                d={path()}
                fill="none"
                stroke={props.selected ? 'var(--m3-color-primary, #6750A4)' : strokeColor()}
                stroke-width={props.selected ? 2.5 : 1.5}
                stroke-dasharray={props.edge.sourcePort === 'false' ? '6 3' : undefined}
            />
            {/* Arrow at target */}
            <circle
                cx={tgt().x}
                cy={tgt().y}
                r={3}
                fill={strokeColor()}
            />
        </g>
    );
};

/** Render a temporary edge while dragging from a port */
export interface DragEdgeProps {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
}

export const DragEdgeSvg: Component<DragEdgeProps> = (props) => {
    const path = () => buildCurvePath(props.fromX, props.fromY, props.toX, props.toY);
    return (
        <path
            d={path()}
            fill="none"
            stroke="var(--m3-color-primary, #6750A4)"
            stroke-width={1.5}
            stroke-dasharray="4 3"
            opacity={0.7}
        />
    );
};
