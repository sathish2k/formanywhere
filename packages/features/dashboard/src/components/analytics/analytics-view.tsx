/**
 * Analytics View Component — SolidJS
 * Shows the form details and its workflow execution logs.
 */
import { Component, createSignal, createResource, Show, For } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { CircularProgress } from '@formanywhere/ui/progress';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Icon } from '@formanywhere/ui/icon';
import { Stack } from '@formanywhere/ui/stack';
import { Box } from '@formanywhere/ui/box';
import { getForm } from '../../services/dashboard-datasource';

export interface AnalyticsViewProps {
    formId?: string;
}

export interface WorkflowLog {
    id: string;
    formId: string;
    submissionId: string | null;
    trace: any;
    duration: number | null;
    success: boolean;
    executedAt: string;
}

const fetchLogs = async (formId?: string): Promise<WorkflowLog[]> => {
    if (!formId) return [];

    let API_URL = 'http://localhost:3001';
    try {
        API_URL = (import.meta as any).env?.VITE_API_URL || API_URL;
    } catch (e) {
        // Fallback
    }

    const res = await fetch(`${API_URL}/api/forms/${formId}/workflow-logs`, {
        credentials: 'include',
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || 'Failed to fetch logs');
    return result.logs;
};

export const AnalyticsView: Component<AnalyticsViewProps> = (props) => {
    const [form] = createResource(() => props.formId, getForm);
    const [logs] = createResource(() => props.formId, fetchLogs);
    const [expandedLogId, setExpandedLogId] = createSignal<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedLogId(prev => prev === id ? null : id);
    };

    return (
        <Stack direction="column" gap="lg" style={{ padding: '32px', 'max-width': '1200px', margin: '0 auto', width: '100%' }}>
            {/* Header */}
            <Stack direction="row" align="center" gap="md">
                <IconButton
                    icon={<Icon name="arrow-left" size={24} />}
                    variant="standard"
                    onClick={() => window.history.back()}
                />
                <Stack direction="column">
                    <Typography variant="headline-medium">
                        {form()?.form?.title || 'Form Analytics'}
                    </Typography>
                    <Typography variant="body-medium" color="on-surface-variant">
                        Workflow Execution Logs
                    </Typography>
                </Stack>
            </Stack>

            {/* Logs Table */}
            <Box style={{
                background: 'var(--m3-color-surface-container-low, #f7f2fa)',
                'border-radius': '16px',
                overflow: 'hidden',
                border: '1px solid var(--m3-color-outline-variant, #C4C7C5)'
            }}>
                <Show when={!logs.loading} fallback={
                    <Stack align="center" justify="center" style={{ padding: '64px' }}>
                        <CircularProgress indeterminate />
                    </Stack>
                }>
                    <Show when={logs()?.length} fallback={
                        <Stack align="center" justify="center" style={{ padding: '64px' }}>
                            <Icon name="activity" size={48} style={{ color: 'var(--m3-color-outline, #79747E)', 'margin-bottom': '16px' }} />
                            <Typography variant="title-medium" color="on-surface-variant">
                                No execution logs found
                            </Typography>
                            <Typography variant="body-medium" color="on-surface-variant">
                                Submit the form to trigger workflows and see logs here.
                            </Typography>
                        </Stack>
                    }>
                        <div style={{ width: '100%', overflow: 'auto' }}>
                            <table style={{ width: '100%', 'border-collapse': 'collapse', 'text-align': 'left' }}>
                                <thead>
                                    <tr style={{
                                        'border-bottom': '1px solid var(--m3-color-outline-variant, #C4C7C5)',
                                        background: 'color-mix(in srgb, var(--m3-color-surface-container-high, #e6e0e9) 50%, transparent)'
                                    }}>
                                        <th style={{ padding: '16px', 'font-weight': '600', 'font-size': '0.875rem' }}>Status</th>
                                        <th style={{ padding: '16px', 'font-weight': '600', 'font-size': '0.875rem' }}>Executed At</th>
                                        <th style={{ padding: '16px', 'font-weight': '600', 'font-size': '0.875rem' }}>Duration</th>
                                        <th style={{ padding: '16px', 'font-weight': '600', 'font-size': '0.875rem' }}>Submission ID</th>
                                        <th style={{ padding: '16px', width: '48px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <For each={logs()}>
                                        {(log) => (
                                            <>
                                                <tr style={{
                                                    'border-bottom': '1px solid var(--m3-color-outline-variant, #cac4d0)',
                                                    cursor: 'pointer',
                                                    background: expandedLogId() === log.id
                                                        ? 'var(--m3-color-surface-container-highest, #E6E0E9)'
                                                        : 'transparent'
                                                }} onClick={() => toggleExpand(log.id)}>
                                                    <td style={{ padding: '16px' }}>
                                                        <Stack direction="row" align="center" gap="xs">
                                                            <Icon
                                                                name={log.success ? 'check-circle' : 'alert-circle'}
                                                                size={18}
                                                                style={{ color: log.success ? 'var(--m3-color-primary, #6750A4)' : 'var(--m3-color-error, #B3261E)' }}
                                                            />
                                                            <Typography variant="body-medium" style={{ color: log.success ? 'inherit' : 'var(--m3-color-error, #B3261E)' }}>
                                                                {log.success ? 'Success' : 'Failed'}
                                                            </Typography>
                                                        </Stack>
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <Typography variant="body-medium">
                                                            {new Date(log.executedAt).toLocaleString()}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <Typography variant="body-medium">
                                                            {log.duration ? `${log.duration}ms` : '-'}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <Typography variant="body-medium" color="on-surface-variant">
                                                            {log.submissionId ? log.submissionId.slice(0, 8) + '...' : '-'}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        <IconButton
                                                            icon={<Icon name={expandedLogId() === log.id ? 'chevron-up' : 'chevron-down'} size={20} />}
                                                            variant="standard"
                                                            onClick={(e) => { e.stopPropagation(); toggleExpand(log.id); }}
                                                            size="sm"
                                                        />
                                                    </td>
                                                </tr>
                                                {/* Expanded details row */}
                                                <Show when={expandedLogId() === log.id}>
                                                    <tr style={{ background: 'var(--m3-color-surface-container-low, #f7f2fa)' }}>
                                                        <td colspan={5} style={{ padding: '0', 'border-bottom': '1px solid var(--m3-color-outline-variant, #cac4d0)' }}>
                                                            <Box style={{ padding: '24px', 'background-color': '#111827', color: '#E5E7EB', overflow: 'auto', 'max-height': '400px' }}>
                                                                <Typography variant="label-small" style={{ color: '#9CA3AF', 'margin-bottom': '8px', 'font-family': 'monospace' }}>
                                                                    RAW EXECUTION TRACE
                                                                </Typography>
                                                                <pre style={{ margin: 0, 'font-family': 'JetBrains Mono, monospace', 'font-size': '0.8125rem', 'line-height': '1.5' }}>
                                                                    {JSON.stringify(log.trace, null, 2)}
                                                                </pre>
                                                            </Box>
                                                        </td>
                                                    </tr>
                                                </Show>
                                            </>
                                        )}
                                    </For>
                                </tbody>
                            </table>
                        </div>
                    </Show>
                </Show>
            </Box>
        </Stack>
    );
};
