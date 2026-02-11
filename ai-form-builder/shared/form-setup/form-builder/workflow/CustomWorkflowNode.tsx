/**
 * Custom Workflow Node Component
 * Compact node design for ReactFlow workflow builder
 */

'use client';

import { Box, Typography, alpha } from '@mui/material';
import {
    Play,
    Database,
    GitBranch,
    Code,
    Settings,
    Mail,
    Webhook,
    ArrowRight,
    Package,
} from 'lucide-react';
import type { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';

export type WorkflowNodeType =
    | 'start'
    | 'api'
    | 'condition'
    | 'transform'
    | 'action'
    | 'email'
    | 'webhook'
    | 'navigate'
    | 'variable';

export interface WorkflowNodeData {
    label: string;
    type: WorkflowNodeType;
    config?: any;
}

// Block categories and configurations
export const WORKFLOW_BLOCKS = [
    {
        category: 'Triggers',
        blocks: [
            { type: 'start' as const, label: 'Start', icon: Play, color: '#10B981', description: 'Workflow entry point' },
        ],
    },
    {
        category: 'Actions',
        blocks: [
            { type: 'api' as const, label: 'API Call', icon: Database, color: '#3B82F6', description: 'Make HTTP requests' },
            { type: 'action' as const, label: 'Form Action', icon: Settings, color: '#8B5CF6', description: 'Show/hide/enable fields' },
            { type: 'email' as const, label: 'Send Email', icon: Mail, color: '#EF4444', description: 'Send email notifications' },
            { type: 'webhook' as const, label: 'Webhook', icon: Webhook, color: '#F59E0B', description: 'Call external webhooks' },
            { type: 'navigate' as const, label: 'Navigate', icon: ArrowRight, color: '#6366F1', description: 'Navigate to a different page' },
        ],
    },
    {
        category: 'Logic',
        blocks: [
            { type: 'condition' as const, label: 'Condition', icon: GitBranch, color: '#EC4899', description: 'Conditional branching' },
            { type: 'transform' as const, label: 'Transform Data', icon: Code, color: '#06B6D4', description: 'Transform and map data' },
        ],
    },
    {
        category: 'Data',
        blocks: [
            { type: 'variable' as const, label: 'Set Variable', icon: Package, color: '#F59E0B', description: 'Store and reuse data' },
        ],
    },
] as const;

export const CustomWorkflowNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data, selected }) => {
    const block = WORKFLOW_BLOCKS.flatMap((cat) => cat.blocks).find((b) => b.type === data.type) as any;
    const Icon = block?.icon || Settings;
    const color = block?.color || '#6B7280';
    const isCondition = data.type === 'condition';

    return (
        <Box
            sx={{
                minWidth: 160,
                bgcolor: 'white',
                borderRadius: 1.5,
                border: '2px solid',
                borderColor: selected ? color : alpha(color, 0.2),
                boxShadow: selected
                    ? `0 4px 12px ${alpha(color, 0.25)}`
                    : '0 2px 6px rgba(0,0,0,0.08)',
                transition: 'all 0.2s',
                '&:hover': {
                    borderColor: color,
                    boxShadow: `0 4px 12px ${alpha(color, 0.2)}`,
                },
            }}
        >
            <Handle
                type="target"
                position={Position.Top}
                style={{
                    background: color,
                    width: 10,
                    height: 10,
                    border: '2px solid white',
                }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5 }}>
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1,
                        bgcolor: alpha(color, 0.12),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: color,
                        flexShrink: 0,
                    }}
                >
                    <Icon size={20} strokeWidth={2} />
                </Box>
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: 'text.primary',
                    }}
                >
                    {data.label}
                </Typography>
            </Box>

            {isCondition ? (
                <>
                    <Handle
                        type="source"
                        position={Position.Bottom}
                        id="true"
                        style={{
                            background: '#10B981',
                            width: 10,
                            height: 10,
                            border: '2px solid white',
                            left: '30%',
                        }}
                    />
                    <Handle
                        type="source"
                        position={Position.Bottom}
                        id="false"
                        style={{
                            background: '#EF4444',
                            width: 10,
                            height: 10,
                            border: '2px solid white',
                            left: '70%',
                        }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            px: 2,
                            pb: 1,
                            gap: 1,
                        }}
                    >
                        <Typography sx={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700 }}>
                            TRUE
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#EF4444', fontWeight: 700 }}>
                            FALSE
                        </Typography>
                    </Box>
                </>
            ) : (
                <Handle
                    type="source"
                    position={Position.Bottom}
                    style={{
                        background: color,
                        width: 10,
                        height: 10,
                        border: '2px solid white',
                    }}
                />
            )}
        </Box>
    );
};

export const nodeTypes = {
    custom: CustomWorkflowNode,
};
