/**
 * WorkflowCanvas — Main canvas with undo/redo, multi-select, validation, and minimap
 * Uses inline styles + @formanywhere/ui only (no SCSS classes)
 */
import { createSignal, For, Show, onMount, onCleanup, createMemo, batch } from 'solid-js';
import type { Component, JSX } from 'solid-js';
import type {
    WorkflowNode,
    WorkflowEdge,
    WorkflowNodeType,
    WorkflowNodeConfig,
    EdgeSourcePort,
    FormWorkflow,
    FormElement,
    WorkflowValidationIssue,
} from '@formanywhere/shared/types';
import { validateWorkflow } from '@formanywhere/domain/form';
import { Icon } from '@formanywhere/ui/icon';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Tooltip } from '@formanywhere/ui/tooltip';
import { Stack } from '@formanywhere/ui/stack';
import { Box } from '@formanywhere/ui/box';
import { Typography } from '@formanywhere/ui/typography';
import { WorkflowNodeComponent } from './WorkflowNodeComponent';
import { WorkflowEdgeSvg, DragEdgeSvg, getPortPosition } from './WorkflowEdgeSvg';
import { NodePalette, NODE_TYPES } from './NodePalette';
import { NodeConfigPanel } from './NodeConfigPanel';
import { WorkflowDebuggerDialog } from '../dialogs/WorkflowDebuggerDialog';
import type { PageTab } from '../page-toolbar/PageToolbar';

export interface WorkflowCanvasProps {
    workflow: FormWorkflow;
    pages: PageTab[];
    elements: FormElement[];
    onUpdateWorkflow: (workflow: FormWorkflow) => void;
}

function uid(): string {
    return `wf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

// ─── Undo / Redo History ─────────────────────────────────────────────────────

interface HistoryEntry {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
}

const MAX_HISTORY = 50;

/* ── Inline Styles ───────────────────────────────────────────────────────────── */

/* ── Inline Styles ───────────────────────────────────────────────────────────── */

const S = {
    canvas: {
        flex: '1',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'grab',
        background:
            'radial-gradient(circle, var(--m3-color-outline-variant, #C4C7C5) 1px, transparent 1px)',
        'background-size': '20px 20px',
    } as JSX.CSSProperties,

    inner: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '5000px',
        height: '5000px',
    } as JSX.CSSProperties,

    svg: {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        'pointer-events': 'none',
        overflow: 'visible',
    } as JSX.CSSProperties,
};

export const WorkflowCanvas: Component<WorkflowCanvasProps> = (props) => {
    let canvasRef: HTMLDivElement | undefined;
    let svgRef: SVGSVGElement | undefined;

    const [selectedNodeIds, setSelectedNodeIds] = createSignal<Set<string>>(new Set());
    const [selectedEdgeId, setSelectedEdgeId] = createSignal<string | null>(null);

    // Undo/redo
    const [history, setHistory] = createSignal<HistoryEntry[]>([]);
    const [historyIdx, setHistoryIdx] = createSignal(-1);
    const [isUndoRedoing, setIsUndoRedoing] = createSignal(false);

    const pushHistory = () => {
        if (isUndoRedoing()) return;
        const entry: HistoryEntry = {
            nodes: JSON.parse(JSON.stringify(props.workflow.nodes)),
            edges: JSON.parse(JSON.stringify(props.workflow.edges)),
        };
        const newHistory = [...history().slice(0, historyIdx() + 1), entry].slice(-MAX_HISTORY);
        setHistory(newHistory);
        setHistoryIdx(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIdx() <= 0) return;
        const prevIdx = historyIdx() - 1;
        const entry = history()[prevIdx];
        if (!entry) return;
        setIsUndoRedoing(true);
        setHistoryIdx(prevIdx);
        props.onUpdateWorkflow({ ...props.workflow, nodes: entry.nodes, edges: entry.edges });
        setIsUndoRedoing(false);
    };

    const redo = () => {
        if (historyIdx() >= history().length - 1) return;
        const nextIdx = historyIdx() + 1;
        const entry = history()[nextIdx];
        if (!entry) return;
        setIsUndoRedoing(true);
        setHistoryIdx(nextIdx);
        props.onUpdateWorkflow({ ...props.workflow, nodes: entry.nodes, edges: entry.edges });
        setIsUndoRedoing(false);
    };

    // Initialize history on mount
    onMount(() => pushHistory());

    // Drag state
    const [dragging, setDragging] = createSignal<{
        nodeId: string;
        startX: number;
        startY: number;
        origPositions: Map<string, { x: number; y: number }>;
    } | null>(null);

    // Edge creation drag state
    const [edgeDrag, setEdgeDrag] = createSignal<{
        sourceNodeId: string;
        sourcePort: 'in' | EdgeSourcePort;
        fromX: number; fromY: number;
        toX: number; toY: number;
    } | null>(null);

    // Canvas pan state
    const [panOffset, setPanOffset] = createSignal({ x: 0, y: 0 });
    const [panning, setPanning] = createSignal<{ startX: number; startY: number; origPanX: number; origPanY: number } | null>(null);
    const [zoom, setZoom] = createSignal(1);

    // Box select state
    const [boxSelect, setBoxSelect] = createSignal<{ startX: number; startY: number; curX: number; curY: number } | null>(null);

    // Validation & Debugging
    const [showValidation, setShowValidation] = createSignal(false);
    const validationResult = createMemo(() => validateWorkflow(props.workflow));
    const [showDebugger, setShowDebugger] = createSignal(false);

    // Helpers
    const nodes = () => props.workflow.nodes;
    const edges = () => props.workflow.edges;
    const nodeMap = () => new Map(nodes().map((n) => [n.id, n]));
    const selectedNode = () => {
        const ids = selectedNodeIds();
        if (ids.size !== 1) return null;
        const id = [...ids][0];
        return nodeMap().get(id) ?? null;
    };

    const updateNodes = (fn: (nodes: WorkflowNode[]) => WorkflowNode[]) => {
        pushHistory();
        props.onUpdateWorkflow({ ...props.workflow, nodes: fn([...props.workflow.nodes]) });
    };

    const updateEdges = (fn: (edges: WorkflowEdge[]) => WorkflowEdge[]) => {
        pushHistory();
        props.onUpdateWorkflow({ ...props.workflow, edges: fn([...props.workflow.edges]) });
    };

    // ── Add Node ─────────────────────────────────────────────────────────────

    const addNode = (type: WorkflowNodeType) => {
        const label = NODE_TYPES.find((n) => n.type === type)?.label ?? type;
        const existingCount = nodes().filter((n) => n.type === type).length;
        const col = nodes().length % 3;
        const row = Math.floor(nodes().length / 3);

        const newNode: WorkflowNode = {
            id: uid(),
            type,
            label: `${label} ${existingCount + 1}`,
            position: { x: 60 + col * 260, y: 60 + row * 180 },
            config: {} as WorkflowNodeConfig,
        };
        updateNodes((ns) => [...ns, newNode]);
        setSelectedNodeIds(new Set([newNode.id]));
        setSelectedEdgeId(null);
    };

    // ── Delete ───────────────────────────────────────────────────────────────

    const deleteSelectedNodes = () => {
        const ids = selectedNodeIds();
        if (ids.size === 0) return;
        pushHistory();
        batch(() => {
            props.onUpdateWorkflow({
                ...props.workflow,
                nodes: props.workflow.nodes.filter((n) => !ids.has(n.id)),
                edges: props.workflow.edges.filter((e) => !ids.has(e.sourceNodeId) && !ids.has(e.targetNodeId)),
            });
            setSelectedNodeIds(new Set<string>());
        });
    };

    const deleteNode = (nodeId: string) => {
        pushHistory();
        batch(() => {
            props.onUpdateWorkflow({
                ...props.workflow,
                nodes: props.workflow.nodes.filter((n) => n.id !== nodeId),
                edges: props.workflow.edges.filter((e) => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId),
            });
            setSelectedNodeIds((s) => { const ns = new Set(s); ns.delete(nodeId); return ns; });
        });
    };

    // ── Update Node ──────────────────────────────────────────────────────────

    const updateNodeConfig = (nodeId: string, config: WorkflowNodeConfig) => {
        updateNodes((ns) => ns.map((n) => n.id === nodeId ? { ...n, config } : n));
    };

    const updateNodeLabel = (nodeId: string, label: string) => {
        updateNodes((ns) => ns.map((n) => n.id === nodeId ? { ...n, label } : n));
    };

    // ── Delete Edge ──────────────────────────────────────────────────────────

    const deleteSelectedEdge = () => {
        const eid = selectedEdgeId();
        if (eid) {
            updateEdges((es) => es.filter((e) => e.id !== eid));
            setSelectedEdgeId(null);
        }
    };

    // ── Node Dragging ────────────────────────────────────────────────────────

    const onNodeDragStart = (nodeId: string, e: MouseEvent) => {
        const ids = selectedNodeIds();
        const toMove = ids.has(nodeId) ? ids : new Set([nodeId]);
        if (!ids.has(nodeId)) setSelectedNodeIds(toMove);

        const origPositions = new Map<string, { x: number; y: number }>();
        for (const id of toMove) {
            const node = nodeMap().get(id);
            if (node) origPositions.set(id, { ...node.position });
        }
        setDragging({ nodeId, startX: e.clientX, startY: e.clientY, origPositions });
    };

    // ── Port / Edge Creation ─────────────────────────────────────────────────

    const onPortMouseDown = (nodeId: string, port: 'in' | 'out' | 'true' | 'false', e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const node = nodeMap().get(nodeId);
        if (!node) return;
        const pos = getPortPosition(node, port as any);
        setEdgeDrag({ sourceNodeId: nodeId, sourcePort: port, fromX: pos.x, fromY: pos.y, toX: pos.x, toY: pos.y });
    };

    // ── Canvas Panning + Box Select ──────────────────────────────────────────

    const onCanvasMouseDown = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        // Only start pan/box-select on the canvas background itself
        if (target === canvasRef || target.dataset.canvasInner === 'true') {
            if (e.shiftKey) {
                // Box select
                const rect = canvasRef!.getBoundingClientRect();
                const z = zoom();
                const pan = panOffset();
                const x = (e.clientX - rect.left - pan.x) / z;
                const y = (e.clientY - rect.top - pan.y) / z;
                setBoxSelect({ startX: x, startY: y, curX: x, curY: y });
            } else {
                // Pan
                setPanning({
                    startX: e.clientX, startY: e.clientY,
                    origPanX: panOffset().x, origPanY: panOffset().y,
                });
                setSelectedNodeIds(new Set<string>());
                setSelectedEdgeId(null);
            }
        }
    };

    // ── Global Mouse Handlers ────────────────────────────────────────────────

    const onGlobalMouseMove = (e: MouseEvent) => {
        // Node dragging (supports multi-select)
        const drag = dragging();
        if (drag) {
            const z = zoom();
            const dx = (e.clientX - drag.startX) / z;
            const dy = (e.clientY - drag.startY) / z;
            setIsUndoRedoing(true);
            props.onUpdateWorkflow({
                ...props.workflow,
                nodes: props.workflow.nodes.map((n) => {
                    const orig = drag.origPositions.get(n.id);
                    if (orig) {
                        return { ...n, position: { x: Math.max(0, orig.x + dx), y: Math.max(0, orig.y + dy) } };
                    }
                    return n;
                }),
            });
            setIsUndoRedoing(false);
            return;
        }

        // Edge creation
        const ed = edgeDrag();
        if (ed && canvasRef) {
            const rect = canvasRef.getBoundingClientRect();
            const z = zoom();
            const pan = panOffset();
            setEdgeDrag({ ...ed, toX: (e.clientX - rect.left - pan.x) / z, toY: (e.clientY - rect.top - pan.y) / z });
            return;
        }

        // Box select
        const bs = boxSelect();
        if (bs && canvasRef) {
            const rect = canvasRef.getBoundingClientRect();
            const z = zoom();
            const pan = panOffset();
            setBoxSelect({ ...bs, curX: (e.clientX - rect.left - pan.x) / z, curY: (e.clientY - rect.top - pan.y) / z });
            return;
        }

        // Canvas panning
        const pan = panning();
        if (pan) {
            setPanOffset({ x: pan.origPanX + (e.clientX - pan.startX), y: pan.origPanY + (e.clientY - pan.startY) });
        }
    };

    const onGlobalMouseUp = (e: MouseEvent) => {
        // Finish box select
        const bs = boxSelect();
        if (bs) {
            const minX = Math.min(bs.startX, bs.curX);
            const maxX = Math.max(bs.startX, bs.curX);
            const minY = Math.min(bs.startY, bs.curY);
            const maxY = Math.max(bs.startY, bs.curY);
            const selected = new Set<string>();
            for (const node of nodes()) {
                if (node.position.x >= minX && node.position.x + 200 <= maxX + 200 &&
                    node.position.y >= minY && node.position.y + 80 <= maxY + 80) {
                    selected.add(node.id);
                }
            }
            setSelectedNodeIds(selected);
            setBoxSelect(null);
            return;
        }

        // Finish edge creation — use data-port attribute instead of CSS class
        const ed = edgeDrag();
        if (ed) {
            const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
            if (target?.dataset.port) {
                const targetNodeId = target.dataset.nodeId;
                const targetPort = target.dataset.port;
                if (targetNodeId && targetNodeId !== ed.sourceNodeId) {
                    let sourceNodeId = ed.sourceNodeId;
                    let sourcePort: EdgeSourcePort = ed.sourcePort === 'in' ? 'out' : ed.sourcePort as EdgeSourcePort;
                    let tgtNodeId = targetNodeId;
                    if (ed.sourcePort === 'in' && targetPort !== 'in') {
                        sourceNodeId = targetNodeId;
                        sourcePort = targetPort as EdgeSourcePort;
                        tgtNodeId = ed.sourceNodeId;
                    }
                    const exists = edges().some(
                        (e) => e.sourceNodeId === sourceNodeId && e.targetNodeId === tgtNodeId && e.sourcePort === sourcePort
                    );
                    if (!exists) {
                        updateEdges((es) => [...es, { id: uid(), sourceNodeId, sourcePort, targetNodeId: tgtNodeId }]);
                    }
                }
            }
            setEdgeDrag(null);
        }

        setDragging(null);
        setPanning(null);
    };

    // ── Zoom ─────────────────────────────────────────────────────────────────

    const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        setZoom((z) => Math.max(0.3, Math.min(2, z + delta)));
    };

    // ── Keyboard ─────────────────────────────────────────────────────────────

    const onKeyDown = (e: KeyboardEvent) => {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (selectedEdgeId()) {
                deleteSelectedEdge();
            } else if (selectedNodeIds().size > 0) {
                deleteSelectedNodes();
            }
        }

        if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undo();
        }

        if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
            e.preventDefault();
            redo();
        }
        if (e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            redo();
        }

        if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
            e.preventDefault();
            setSelectedNodeIds(new Set(nodes().map((n) => n.id)));
        }
    };

    onMount(() => {
        window.addEventListener('mousemove', onGlobalMouseMove);
        window.addEventListener('mouseup', onGlobalMouseUp);
        window.addEventListener('keydown', onKeyDown);
    });

    onCleanup(() => {
        window.removeEventListener('mousemove', onGlobalMouseMove);
        window.removeEventListener('mouseup', onGlobalMouseUp);
        window.removeEventListener('keydown', onKeyDown);
    });

    // ── Node select handler ──────────────────────────────────────────────────

    const onNodeSelect = (nodeId: string, e?: MouseEvent) => {
        if (e?.shiftKey) {
            setSelectedNodeIds((s) => {
                const ns = new Set(s);
                if (ns.has(nodeId)) ns.delete(nodeId);
                else ns.add(nodeId);
                return ns;
            });
        } else {
            setSelectedNodeIds(new Set([nodeId]));
        }
        setSelectedEdgeId(null);
    };

    // ── Minimap ──────────────────────────────────────────────────────────────

    const MINIMAP_W = 160;
    const MINIMAP_H = 100;

    const minimapData = createMemo(() => {
        const ns = nodes();
        if (ns.length === 0) return { scale: 1, offsetX: 0, offsetY: 0, rects: [] as Array<{ x: number; y: number; w: number; h: number; selected: boolean }> };
        const minX = Math.min(...ns.map((n) => n.position.x));
        const minY = Math.min(...ns.map((n) => n.position.y));
        const maxX = Math.max(...ns.map((n) => n.position.x + 200));
        const maxY = Math.max(...ns.map((n) => n.position.y + 80));
        const w = maxX - minX || 1;
        const h = maxY - minY || 1;
        const scale = Math.min(MINIMAP_W / w, MINIMAP_H / h, 1) * 0.85;
        const ids = selectedNodeIds();
        const rects = ns.map((n) => ({
            x: (n.position.x - minX) * scale,
            y: (n.position.y - minY) * scale,
            w: 200 * scale,
            h: 80 * scale,
            selected: ids.has(n.id),
        }));
        return { scale, offsetX: minX, offsetY: minY, rects };
    });

    // ── Validation ───────────────────────────────────────────────────────────

    const errorCount = createMemo(() => validationResult().issues.filter((i) => i.severity === 'error').length);

    return (
        <Stack direction="row" style={{ height: '100%', overflow: 'hidden', background: 'var(--m3-color-surface-container-lowest, #fff)' }}>
            {/* Left: Node Palette */}
            <NodePalette onAddNode={addNode} />

            {/* Center: Canvas */}
            <div
                style={S.canvas}
                ref={canvasRef}
                onMouseDown={onCanvasMouseDown}
                onWheel={onWheel}
            >
                <div
                    data-canvas-inner="true"
                    style={{
                        ...S.inner,
                        transform: `translate(${panOffset().x}px, ${panOffset().y}px) scale(${zoom()})`,
                        'transform-origin': '0 0',
                    }}
                >
                    {/* SVG layer for edges */}
                    <svg
                        ref={svgRef}
                        style={S.svg}
                    >
                        <For each={edges()}>
                            {(edge) => {
                                const srcNode = () => nodeMap().get(edge.sourceNodeId);
                                const tgtNode = () => nodeMap().get(edge.targetNodeId);
                                return (
                                    <Show when={srcNode() && tgtNode()}>
                                        <WorkflowEdgeSvg
                                            edge={edge}
                                            sourceNode={srcNode()!}
                                            targetNode={tgtNode()!}
                                            selected={selectedEdgeId() === edge.id}
                                            onSelect={(id) => { setSelectedEdgeId(id); setSelectedNodeIds(new Set<string>()); }}
                                        />
                                    </Show>
                                );
                            }}
                        </For>
                        <Show when={edgeDrag()}>
                            {(drag) => (
                                <DragEdgeSvg fromX={drag().fromX} fromY={drag().fromY} toX={drag().toX} toY={drag().toY} />
                            )}
                        </Show>
                        {/* Box select rectangle */}
                        <Show when={boxSelect()}>
                            {(bs) => {
                                const x = () => Math.min(bs().startX, bs().curX);
                                const y = () => Math.min(bs().startY, bs().curY);
                                const w = () => Math.abs(bs().curX - bs().startX);
                                const h = () => Math.abs(bs().curY - bs().startY);
                                return (
                                    <rect
                                        x={x()} y={y()} width={w()} height={h()}
                                        fill="rgba(103,80,164,0.08)" stroke="#6750A4" stroke-width={1}
                                        stroke-dasharray="4 2" pointer-events="none"
                                    />
                                );
                            }}
                        </Show>
                    </svg>

                    {/* Node layer */}
                    <For each={nodes()}>
                        {(node) => (
                            <WorkflowNodeComponent
                                node={node}
                                selected={selectedNodeIds().has(node.id)}
                                onSelect={(id) => onNodeSelect(id)}
                                onPortMouseDown={onPortMouseDown}
                                onDragStart={onNodeDragStart}
                            />
                        )}
                    </For>

                    {/* Empty state */}
                    <Show when={nodes().length === 0}>
                        <Stack align="center" justify="center" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 'text-align': 'center', 'pointer-events': 'none', 'user-select': 'none', width: '300px' }}>
                            <Typography variant="body-medium" color="on-surface-variant">Click a node type on the left to add it to the canvas</Typography>
                            <Typography variant="body-small" color="on-surface-variant" style={{ 'margin-top': '4px', opacity: 0.6 }}>Start with a <strong>Trigger</strong> node to define when this workflow runs</Typography>
                        </Stack>
                    </Show>
                </div>

                {/* ── Toolbar ── */}
                <Stack direction="row" align="center" gap="xs" style={{ position: 'absolute', top: '8px', right: '8px', padding: '4px 8px', 'border-radius': '10px', background: 'var(--glass-tint-light, rgba(255,255,255,0.7))', 'backdrop-filter': 'blur(12px)', '-webkit-backdrop-filter': 'blur(12px)', border: '1px solid var(--glass-border-medium, rgba(255,255,255,0.4))', 'box-shadow': 'var(--glass-shadow, 0 4px 16px rgba(0,0,0,0.06))', 'z-index': 20 }}>
                    <Tooltip text="Undo (Cmd+Z)" position="bottom">
                        <IconButton
                            variant="standard"
                            icon={<span style={{ 'font-size': '1rem' }}>↶</span>}
                            onClick={undo}
                            disabled={historyIdx() <= 0}
                            aria-label="Undo"
                            style={{ width: '28px', height: '28px' }}
                        />
                    </Tooltip>
                    <Tooltip text="Redo (Cmd+Shift+Z)" position="bottom">
                        <IconButton
                            variant="standard"
                            icon={<span style={{ 'font-size': '1rem' }}>↷</span>}
                            onClick={redo}
                            disabled={historyIdx() >= history().length - 1}
                            aria-label="Redo"
                            style={{ width: '28px', height: '28px' }}
                        />
                    </Tooltip>
                    <Box style={{ width: '1px', height: '18px', background: 'var(--m3-color-outline-variant, #C4C7C5)', margin: '0 2px' }} />
                    <Typography variant="label-small" style={{ 'min-width': '32px', 'text-align': 'center', color: 'var(--m3-color-on-surface-variant, #49454F)' }}>{Math.round(zoom() * 100)}%</Typography>
                    <Box style={{ width: '1px', height: '18px', background: 'var(--m3-color-outline-variant, #C4C7C5)', margin: '0 2px' }} />
                    <Tooltip text="Test Workflow" position="bottom">
                        <IconButton
                            variant="standard"
                            icon={<Icon name="bug" size={16} />}
                            onClick={() => setShowDebugger(true)}
                            aria-label="Test Workflow"
                            style={{
                                width: '28px',
                                height: '28px',
                                color: 'var(--m3-color-primary, #6750A4)',
                            }}
                        />
                    </Tooltip>
                    <Tooltip text="Validate workflow" position="bottom">
                        <IconButton
                            variant="standard"
                            icon={
                                <span style={{ 'font-size': '0.75rem', 'font-weight': '700' }}>
                                    {errorCount() > 0 ? `⚠ ${errorCount()}` : '✓'}
                                </span>
                            }
                            onClick={() => setShowValidation(!showValidation())}
                            aria-label="Validate"
                            style={{
                                width: '28px',
                                height: '28px',
                                color: errorCount() > 0 ? '#B3261E' : 'var(--m3-color-primary, #6750A4)',
                            }}
                        />
                    </Tooltip>
                </Stack>

                {/* ── Validation panel ── */}
                <Show when={showValidation() && validationResult().issues.length > 0}>
                    <Stack style={{ position: 'absolute', top: '48px', right: '8px', width: '240px', 'max-height': '200px', 'overflow-y': 'auto', 'border-radius': '12px', background: 'var(--glass-tint-light, rgba(255,255,255,0.85))', 'backdrop-filter': 'blur(16px)', '-webkit-backdrop-filter': 'blur(16px)', border: '1px solid var(--glass-border-medium, rgba(255,255,255,0.4))', 'box-shadow': 'var(--glass-shadow-elevated, 0 8px 32px rgba(0,0,0,0.1))', 'z-index': 20 }}>
                        <Stack direction="row" align="center" justify="between" style={{ padding: '8px 12px', 'border-bottom': '1px solid var(--m3-color-outline-variant, #C4C7C5)' }}>
                            <Typography variant="label-medium" style={{ 'text-transform': 'uppercase', 'letter-spacing': '0.04em', color: 'var(--m3-color-on-surface-variant, #49454F)' }}>
                                Issues ({validationResult().issues.length})
                            </Typography>
                            <IconButton
                                variant="standard"
                                icon={<span>×</span>}
                                onClick={() => setShowValidation(false)}
                                aria-label="Close validation"
                                style={{ width: '22px', height: '22px' }}
                            />
                        </Stack>
                        <For each={validationResult().issues}>
                            {(issue) => (
                                <div
                                    onClick={() => {
                                        if (issue.nodeId) {
                                            setSelectedNodeIds(new Set<string>([issue.nodeId]));
                                        }
                                    }}
                                    style={{ padding: '6px 12px', 'font-size': '0.6875rem', color: issue.severity === 'error' ? '#B3261E' : '#7D5800', cursor: 'pointer' }}
                                >
                                    <Stack direction="row" align="center" gap="xs">
                                        <span style={{ 'flex-shrink': '0', 'font-weight': '700', width: '16px', 'text-align': 'center', color: issue.severity === 'error' ? '#B3261E' : '#FF8F00' }}>
                                            {issue.severity === 'error' ? '✕' : '⚠'}
                                        </span>
                                        <Typography variant="body-small" style={{ color: 'inherit' }}>{issue.message}</Typography>
                                    </Stack>
                                </div>
                            )}
                        </For>
                    </Stack>
                </Show>

                {/* ── Minimap ── */}
                <Show when={nodes().length > 2}>
                    <div style={{ position: 'absolute', bottom: '8px', right: '8px', 'border-radius': '8px', background: 'var(--glass-tint-light, rgba(255,255,255,0.7))', 'backdrop-filter': 'blur(8px)', '-webkit-backdrop-filter': 'blur(8px)', border: '1px solid var(--glass-border-subtle, rgba(255,255,255,0.2))', padding: '4px', 'z-index': 10, width: `${MINIMAP_W}px`, height: `${MINIMAP_H}px` }}>
                        <svg width={MINIMAP_W} height={MINIMAP_H}>
                            <For each={minimapData().rects}>
                                {(r) => (
                                    <rect
                                        x={r.x} y={r.y} width={Math.max(r.w, 3)} height={Math.max(r.h, 3)}
                                        rx={2}
                                        fill={r.selected ? '#6750A4' : 'rgba(0,0,0,0.25)'}
                                        stroke={r.selected ? '#6750A4' : 'none'}
                                    />
                                )}
                            </For>
                        </svg>
                    </div>
                </Show>
            </div>

            {/* Right: Config Panel */}
            <NodeConfigPanel
                node={selectedNode()}
                pages={props.pages}
                elements={props.elements}
                onUpdate={updateNodeConfig}
                onUpdateLabel={updateNodeLabel}
                onDelete={deleteNode}
            />

            {/* Debugger Dialog */}
            <WorkflowDebuggerDialog
                open={showDebugger()}
                onClose={() => setShowDebugger(false)}
                workflow={props.workflow}
                elements={props.elements}
            />
        </Stack>
    );
};
