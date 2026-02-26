/**
 * WorkflowDialog — Full-screen visual workflow builder
 *
 * Manages a list of workflows and provides the node-based canvas editor
 * for building flows (Page → Call API → Set Data → Page → Redirect).
 *
 * Uses inline styles + @formanywhere/ui only (no SCSS classes).
 */
import { splitProps, For, Show, createSignal, type Component } from 'solid-js';
import { Dialog } from '@formanywhere/ui/dialog';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Typography } from '@formanywhere/ui/typography';
import { Stack } from '@formanywhere/ui/stack';
import { Box } from '@formanywhere/ui/box';
import { List, ListItem } from '@formanywhere/ui/list';
import { Chip } from '@formanywhere/ui/chip';
import { TextField } from '@formanywhere/ui/textfield';
import type { FormWorkflow, FormElement } from '@formanywhere/shared/types';
import type { PageTab } from '../page-toolbar/PageToolbar';
import { WorkflowCanvas } from '../workflow-canvas/WorkflowCanvas';

export interface WorkflowDialogProps {
    open: boolean;
    onClose: () => void;
    workflows: FormWorkflow[];
    pages: PageTab[];
    elements: FormElement[];
    onAddWorkflow: (workflow: FormWorkflow) => void;
    onUpdateWorkflow: (workflowId: string, workflow: FormWorkflow) => void;
    onDeleteWorkflow: (workflowId: string) => void;
}

function uid(): string {
    return `wkfl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/* ── Inline Styles ───────────────────────────────────────────────────────────── */

const S = {
    dialogClass: 'workflow-dialog workflow-dialog--fullscreen',
};

export const WorkflowDialog: Component<WorkflowDialogProps> = (props) => {
    const [local] = splitProps(props, ['open', 'onClose', 'workflows', 'pages', 'elements', 'onAddWorkflow', 'onUpdateWorkflow', 'onDeleteWorkflow']);
    const [activeWorkflowId, setActiveWorkflowId] = createSignal<string | null>(null);
    const [editingName, setEditingName] = createSignal<string | null>(null);

    const activeWorkflow = () => local.workflows.find((w) => w.id === activeWorkflowId()) ?? null;

    const createWorkflow = () => {
        const wf: FormWorkflow = {
            id: uid(),
            name: `Workflow ${local.workflows.length + 1}`,
            enabled: true,
            nodes: [],
            edges: [],
        };
        local.onAddWorkflow(wf);
        setActiveWorkflowId(wf.id);
    };

    const handleUpdateWorkflow = (updated: FormWorkflow) => {
        local.onUpdateWorkflow(updated.id, updated);
    };

    const toggleWorkflow = (wf: FormWorkflow) => {
        local.onUpdateWorkflow(wf.id, { ...wf, enabled: !wf.enabled });
    };

    const deleteWorkflow = (wfId: string) => {
        local.onDeleteWorkflow(wfId);
        if (activeWorkflowId() === wfId) setActiveWorkflowId(null);
    };

    const startRename = (wfId: string) => {
        setEditingName(wfId);
    };

    const finishRename = (wfId: string, name: string) => {
        const wf = local.workflows.find((w) => w.id === wfId);
        if (wf && name.trim()) {
            local.onUpdateWorkflow(wfId, { ...wf, name: name.trim() });
        }
        setEditingName(null);
    };

    return (
        <Dialog
            open={local.open}
            onClose={local.onClose}
            title="Workflow Builder"
            icon={<Icon name="workflow" size={20} />}
            class={S.dialogClass}
            actions={
                <Button variant="text" size="sm" onClick={local.onClose}>Close</Button>
            }
        >
            <Stack direction="row" style={{ flex: 1, 'min-height': 0, overflow: 'hidden' }}>
                {/* Workflow list sidebar */}
                <Box
                    style={{
                        width: '230px',
                        'flex-shrink': 0,
                        'border-right': '1px solid var(--m3-color-outline-variant, #C4C7C5)',
                        overflow: 'auto',
                    }}
                >
                    <Stack
                        direction="row"
                        align="center"
                        justify="between"
                        style={{
                            padding: '12px 16px',
                            'border-bottom': '1px solid var(--m3-color-outline-variant, #C4C7C5)',
                        }}
                    >
                        <Typography variant="label-small" style={{ 'font-weight': 700, 'text-transform': 'uppercase', 'letter-spacing': '0.05em' }}>
                            Workflows ({local.workflows.length})
                        </Typography>
                        <IconButton
                            variant="standard"
                            size="sm"
                            icon={<Icon name="plus" size={16} />}
                            onClick={createWorkflow}
                        />
                    </Stack>

                    <Show when={local.workflows.length === 0}>
                        <Box padding="xl" style={{ 'text-align': 'center' }}>
                            <Stack align="center" justify="center" gap="sm">
                                <Icon name="workflow" size={24} style={{ color: 'var(--m3-color-on-surface-variant, #49454F)' }} />
                                <Typography variant="body-small" color="on-surface-variant">
                                    No workflows yet. Create one to connect pages with actions.
                                </Typography>
                            </Stack>
                        </Box>
                    </Show>

                    <Box padding="xs">
                        <List>
                            <For each={local.workflows}>
                                {(wf) => (
                                    <ListItem
                                        headline={editingName() !== wf.id ? wf.name : ''}
                                        selected={activeWorkflowId() === wf.id}
                                        interactive
                                        onClick={() => {
                                            if (editingName() !== wf.id) setActiveWorkflowId(wf.id);
                                        }}
                                        start={
                                            editingName() === wf.id ? (
                                                <div
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') finishRename(wf.id, (e.target as HTMLInputElement).value);
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <TextField
                                                        size="sm"
                                                        value={wf.name}
                                                        onBlur={(e) => finishRename(wf.id, (e.target as HTMLInputElement).value)}
                                                    />
                                                </div>
                                            ) : undefined
                                        }
                                        supportingText={
                                            editingName() !== wf.id
                                                ? `${wf.nodes.length} nodes · ${wf.edges.length} edges`
                                                : undefined
                                        }
                                        end={
                                            editingName() !== wf.id ? (
                                                <Box onClick={(e: MouseEvent) => e.stopPropagation()}>
                                                    <Stack direction="row" gap="none">
                                                        <IconButton
                                                            variant="standard"
                                                            size="sm"
                                                            icon={<Icon name={wf.enabled ? 'eye' : 'eye-off'} size={14} />}
                                                            onClick={() => toggleWorkflow(wf)}
                                                        />
                                                        <IconButton
                                                            variant="standard"
                                                            size="sm"
                                                            icon={<Icon name="trash" size={14} />}
                                                            onClick={() => deleteWorkflow(wf.id)}
                                                        />
                                                    </Stack>
                                                </Box>
                                            ) : undefined
                                        }
                                    />
                                )}
                            </For>
                        </List>
                    </Box>
                </Box>

                {/* Canvas area */}
                <Box style={{ flex: 1, 'min-width': 0, 'min-height': 0, overflow: 'hidden' }}>
                    <Show
                        when={activeWorkflow()}
                        fallback={
                            <Stack align="center" justify="center" gap="sm" style={{ height: '100%', 'text-align': 'center' }}>
                                <Icon name="mouse-pointer" size={32} style={{ color: 'var(--m3-color-on-surface-variant, #49454F)' }} />
                                <Typography variant="body-large" color="on-surface-variant">
                                    Select a workflow from the sidebar or create a new one
                                </Typography>
                            </Stack>
                        }
                    >
                        {(wf) => (
                            <WorkflowCanvas
                                workflow={wf()}
                                pages={local.pages}
                                elements={local.elements}
                                onUpdateWorkflow={handleUpdateWorkflow}
                            />
                        )}
                    </Show>
                </Box>
            </Stack>
        </Dialog>
    );
};
