import type { FormWorkflow, WorkflowNode } from '@formanywhere/shared/types';
import { findStartNodes, resolveNextNodes } from './engine';

const X_SPACING = 350;
const Y_SPACING = 150;
const START_X = 60;
const START_Y = 60;

/**
 * Topologically sorts and computes auto-layout positions for a workflow's nodes.
 * 
 * Works by assigning nodes to "layers" based on their distance from trigger nodes,
 * then spacing out nodes evenly within each layer.
 * 
 * @param workflow The workflow to auto-layout
 * @returns A new array of nodes with updated positions
 */
export function autoLayoutWorkflow(workflow: FormWorkflow): WorkflowNode[] {
    const nodes = workflow.nodes;
    if (nodes.length === 0) return [];

    // Map to keep track of the maximum layer depth for each node
    const nodeLayers = new Map<string, number>();

    // Start with all trigger nodes in layer 0
    const startNodes = findStartNodes(workflow);
    const queue: { node: WorkflowNode; depth: number }[] = startNodes.map(n => ({ node: n, depth: 0 }));

    // If there are no trigger nodes, just use the first node in the array (e.g., partial workflow)
    if (startNodes.length === 0 && nodes.length > 0) {
        queue.push({ node: nodes[0], depth: 0 });
    }

    // Process nodes by depth (BFS)
    while (queue.length > 0) {
        // We can safely cast here since we checked length
        const { node, depth } = queue.shift() as { node: WorkflowNode; depth: number };

        // If we've already visited this node at a deeper or equal level, skip
        // This handles cycles gracefully by taking the longest path
        const currentDepth = nodeLayers.get(node.id) ?? -1;
        if (currentDepth >= depth) {
            continue;
        }

        nodeLayers.set(node.id, depth);

        // Find all children. `resolveNextNodes` requires a map of evaluated conditions, we can pass null to get all edges regardless of conditions
        const children = resolveNextNodes(node.id, workflow.edges, workflow.nodes);
        for (const child of children) {
            queue.push({ node: child, depth: depth + 1 });
        }
    }

    // For any disconnected nodes that weren't reached during traversal, place them in layer 0
    for (const node of nodes) {
        if (!nodeLayers.has(node.id)) {
            nodeLayers.set(node.id, 0);
        }
    }

    // Group nodes by layer
    const layers = new Map<number, WorkflowNode[]>();
    for (const node of nodes) {
        const depth = nodeLayers.get(node.id) ?? 0;
        const layerNodes = layers.get(depth) ?? [];
        layerNodes.push(node);
        layers.set(depth, layerNodes);
    }

    // Calculate new positions
    // To ensure predictable ordering, we can sort nodes within a layer by their original Y position
    const updatedNodes: WorkflowNode[] = [];

    // We update the positions while cloning the nodes so we don't mutate input
    for (const node of nodes) {
        const depth = nodeLayers.get(node.id) ?? 0;
        const layerNodes = layers.get(depth) ?? [];

        // Sort nodes in this layer primarily by incoming edge source Y, but fallback to existing Y
        layerNodes.sort((a, b) => a.position.y - b.position.y);

        const indexInLayer = layerNodes.findIndex(n => n.id === node.id);

        updatedNodes.push({
            ...node,
            position: {
                x: START_X + depth * X_SPACING,
                y: START_Y + indexInLayer * Y_SPACING,
            }
        });
    }

    return updatedNodes;
}
