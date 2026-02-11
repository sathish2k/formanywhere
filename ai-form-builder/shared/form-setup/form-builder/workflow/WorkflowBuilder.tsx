/**
 * Workflow Builder Component
 * Visual node-based workflow editor using ReactFlow
 */

'use client';

import React, { useState, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Button,
    Typography,
    IconButton,
    Drawer,
    Paper,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    alpha,
} from '@mui/material';
import {
    X,
    Play,
    Save,
    Workflow as WorkflowIcon,
    ArrowLeft,
    Plus,
} from 'lucide-react';
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    BackgroundVariant,
    useNodesState,
    useEdgesState,
    addEdge,
    type Connection,
    Panel,
    MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { Rule, DroppedElement, PageData } from '../form-builder.configuration';
import { CustomWorkflowNode, WORKFLOW_BLOCKS, nodeTypes, type WorkflowNodeData, type WorkflowNodeType } from './CustomWorkflowNode';
import { WorkflowExecutionEngine } from '../engines/WorkflowExecutionEngine';

interface WorkflowBuilderProps {
    open: boolean;
    onClose: () => void;
    rules: Rule[];
    onAddRule: (rule: Rule) => void;
    onUpdateRule: (ruleId: string, rule: Rule) => void;
    onDeleteRule: (ruleId: string) => void;
    elements: DroppedElement[];
    pages: PageData[];
    workflows?: any[]; // Array of workflows from form
    workflow?: any; // Single workflow when editing (legacy)
    onSave?: (nodes: Node[], edges: Edge[]) => void;
    onBack?: () => void;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
    open,
    onClose,
    rules,
    onAddRule,
    onUpdateRule,
    onDeleteRule,
    elements,
    pages,
    workflows,
    workflow,
    onSave,
    onBack,
}) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState<Node<WorkflowNodeData> | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [propertiesOpen, setPropertiesOpen] = useState(false);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

    // Test dialog state
    const [testDialogOpen, setTestDialogOpen] = useState(false);
    const [testFormData, setTestFormData] = useState<Record<string, any>>({});
    const [testResults, setTestResults] = useState<any>(null);

    // Load workflows when dialog opens
    React.useEffect(() => {
        if (open && workflows && workflows.length > 0) {
            // Load the first workflow by default
            const firstWorkflow = workflows[0];
            console.log('Loading workflow into canvas:', firstWorkflow);

            if (firstWorkflow.nodes && firstWorkflow.edges) {
                setNodes(firstWorkflow.nodes || []);
                setEdges(firstWorkflow.edges || []);
            }
        } else if (open && workflow) {
            // Legacy: load single workflow
            console.log('Loading single workflow into canvas:', workflow);
            if (workflow.nodes && workflow.edges) {
                setNodes(workflow.nodes || []);
                setEdges(workflow.edges || []);
            }
        }
    }, [open, workflows, workflow, setNodes, setEdges]);

    // Handle node connection
    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    // Handle drag start from sidebar
    const onDragStart = (event: React.DragEvent, nodeType: WorkflowNodeType, label: string, color: string) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, label, color }));
        event.dataTransfer.effectAllowed = 'move';
    };

    // Handle drag over canvas
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // Handle drop on canvas
    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const data = event.dataTransfer.getData('application/reactflow');
            if (!data) return;

            const { nodeType, label } = JSON.parse(data);

            if (reactFlowInstance) {
                const position = reactFlowInstance.screenToFlowPosition({
                    x: event.clientX,
                    y: event.clientY,
                });

                const id = `node-${Date.now()}`;
                const newNode: Node<WorkflowNodeData> = {
                    id,
                    type: 'custom',
                    position,
                    data: { label, type: nodeType, config: {} },
                };

                setNodes((nds) => [...nds, newNode]);
            }
        },
        [reactFlowInstance, setNodes]
    );

    // Handle node selection
    const onNodeClick = useCallback(
        (event: React.MouseEvent, node: Node<WorkflowNodeData>) => {
            setSelectedNode(node);
            setPropertiesOpen(true);
        },
        []
    );

    // Update node configuration
    const updateNodeConfig = (config: any) => {
        if (selectedNode) {
            setNodes((nds) =>
                nds.map((node) =>
                    node.id === selectedNode.id
                        ? { ...node, data: { ...node.data, config } }
                        : node
                )
            );
            setSelectedNode({
                ...selectedNode,
                data: { ...selectedNode.data, config },
            });
        }
    };

    // Open test dialog with sample data
    const handleOpenTest = () => {
        // Pre-fill with sample data based on form fields
        const sampleData: Record<string, any> = {};
        getFieldOptions().forEach((field) => {
            sampleData[field.id] = `Sample ${field.label}`;
        });
        setTestFormData(sampleData);
        setTestResults(null);
        setTestDialogOpen(true);
    };

    // Execute workflow test
    const handleRunTest = async () => {
        try {
            const engine = new WorkflowExecutionEngine(nodes, edges, testFormData);
            const result = await engine.execute();
            setTestResults(result);
        } catch (error) {
            setTestResults({
                success: false,
                errors: [error instanceof Error ? error.message : 'Unknown error'],
                executedNodes: [],
                context: { formData: testFormData, variables: {}, startTime: new Date() },
            });
        }
    };

    // Get form field options
    const getFieldOptions = () => {
        const fields: Array<{ id: string; label: string }> = [];

        const extractFields = (elementsList: DroppedElement[]) => {
            elementsList.forEach((element) => {
                if (element.label) {
                    fields.push({
                        id: element.id,
                        label: element.label,
                    });
                }

                if (element.children) {
                    extractFields(element.children);
                }
                // Traverse grid layout items
                if (element.gridItems) {
                    element.gridItems.forEach((gridItem) => {
                        extractFields(gridItem.children);
                    });
                }
            });
        };

        extractFields(elements);
        return fields;
    };

    // Render node properties panel based on node type
    const renderNodeProperties = () => {
        if (!selectedNode) return null;

        const config = selectedNode.data.config || {};

        switch (selectedNode.data.type) {
            case 'api':
                return (
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                            API Configuration
                        </Typography>
                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                            <InputLabel>Method</InputLabel>
                            <Select
                                value={config.method || 'GET'}
                                onChange={(e) => updateNodeConfig({ ...config, method: e.target.value })}
                                label="Method"
                            >
                                <MenuItem value="GET">GET</MenuItem>
                                <MenuItem value="POST">POST</MenuItem>
                                <MenuItem value="PUT">PUT</MenuItem>
                                <MenuItem value="DELETE">DELETE</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            size="small"
                            label="URL"
                            placeholder="https://api.example.com/endpoint"
                            value={config.url || ''}
                            onChange={(e) => updateNodeConfig({ ...config, url: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                    </Box>
                );

            case 'condition':
                return (
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                            Condition Configuration
                        </Typography>
                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                            <InputLabel>Field</InputLabel>
                            <Select
                                value={config.fieldId || ''}
                                onChange={(e) => updateNodeConfig({ ...config, fieldId: e.target.value })}
                                label="Field"
                            >
                                {getFieldOptions().map((field) => (
                                    <MenuItem key={field.id} value={field.id}>
                                        {field.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                            <InputLabel>Operator</InputLabel>
                            <Select
                                value={config.operator || 'equals'}
                                onChange={(e) => updateNodeConfig({ ...config, operator: e.target.value })}
                                label="Operator"
                            >
                                <MenuItem value="equals">Equals</MenuItem>
                                <MenuItem value="notEquals">Not Equals</MenuItem>
                                <MenuItem value="contains">Contains</MenuItem>
                                <MenuItem value="greaterThan">Greater Than</MenuItem>
                                <MenuItem value="lessThan">Less Than</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            size="small"
                            label="Value"
                            value={config.value || ''}
                            onChange={(e) => updateNodeConfig({ ...config, value: e.target.value })}
                        />
                    </Box>
                );

            default:
                return (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Select a node to configure its properties
                    </Typography>
                );
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen
            PaperProps={{
                sx: {
                    bgcolor: '#FAFAFA',
                },
            }}
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'white',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {onBack && (
                        <IconButton onClick={onBack} size="small">
                            <ArrowLeft size={20} />
                        </IconButton>
                    )}
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <WorkflowIcon size={20} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Workflow Builder
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Build visual workflows with drag-and-drop
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Play size={16} />}
                        onClick={handleOpenTest}
                        disabled={nodes.length === 0}
                        sx={{ textTransform: 'none' }}
                    >
                        Test
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<Save size={16} />}
                        onClick={() => onSave?.(nodes, edges)}
                        sx={{ textTransform: 'none' }}
                    >
                        Save
                    </Button>
                    <IconButton onClick={onClose} size="small">
                        <X size={20} />
                    </IconButton>
                </Box>
            </DialogTitle>

            {/* Main Content */}
            <DialogContent sx={{ p: 0, display: 'flex', height: 'calc(100vh - 80px)' }}>
                {/* Sidebar - Node Blocks */}
                <Drawer
                    variant="persistent"
                    anchor="left"
                    open={sidebarOpen}
                    sx={{
                        width: 280,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 280,
                            position: 'relative',
                            bgcolor: 'white',
                            borderRight: '1px solid',
                            borderColor: 'divider',
                        },
                    }}
                >
                    <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                            Workflow Blocks
                        </Typography>
                        {WORKFLOW_BLOCKS.map((category) => (
                            <Box key={category.category} sx={{ mb: 3 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                                    {category.category}
                                </Typography>
                                {category.blocks.map((block) => {
                                    const Icon = block.icon;
                                    return (
                                        <Paper
                                            key={block.type}
                                            draggable
                                            onDragStart={(e) => onDragStart(e, block.type, block.label, block.color)}
                                            sx={{
                                                p: 1.5,
                                                mb: 1,
                                                cursor: 'grab',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.5,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                '&:hover': {
                                                    borderColor: block.color,
                                                    bgcolor: alpha(block.color, 0.05),
                                                },
                                                '&:active': {
                                                    cursor: 'grabbing',
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: 1,
                                                    bgcolor: alpha(block.color, 0.12),
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: block.color,
                                                }}
                                            >
                                                <Icon size={16} />
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {block.label}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    {block.description}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    );
                                })}
                            </Box>
                        ))}
                    </Box>
                </Drawer>

                {/* ReactFlow Canvas */}
                <Box sx={{ flex: 1, position: 'relative' }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onNodeClick={onNodeClick}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
                        <Controls />
                        <MiniMap />
                        <Panel position="top-right">
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setPropertiesOpen(!propertiesOpen)}
                                sx={{ bgcolor: 'white' }}
                            >
                                Properties
                            </Button>
                        </Panel>
                    </ReactFlow>
                </Box>

                {/* Properties Panel */}
                <Drawer
                    variant="persistent"
                    anchor="right"
                    open={propertiesOpen}
                    sx={{
                        width: 320,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 320,
                            position: 'relative',
                            bgcolor: 'white',
                            borderLeft: '1px solid',
                            borderColor: 'divider',
                        },
                    }}
                >
                    <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                            Node Properties
                        </Typography>
                        {renderNodeProperties()}
                    </Box>
                </Drawer>
            </DialogContent>

            {/* Test Workflow Dialog */}
            <Dialog open={testDialogOpen} onClose={() => setTestDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" fontWeight={700}>Test Workflow</Typography>
                        <IconButton onClick={() => setTestDialogOpen(false)} size="small">
                            <X size={20} />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Enter sample form data to test your workflow execution
                    </Typography>

                    {/* Sample Form Data Inputs */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            Form Data (JSON)
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={8}
                            value={JSON.stringify(testFormData, null, 2)}
                            onChange={(e) => {
                                try {
                                    setTestFormData(JSON.parse(e.target.value));
                                } catch (err) {
                                    // Invalid JSON, ignore
                                }
                            }}
                            placeholder='{\n  "email": "test@example.com",\n  "name": "John Doe"\n}'
                            sx={{
                                fontFamily: 'monospace',
                                fontSize: '0.875rem',
                            }}
                        />
                    </Box>

                    {/* Test Results */}
                    {testResults && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                Test Results
                            </Typography>
                            <Paper
                                sx={{
                                    p: 2,
                                    bgcolor: testResults.success ? 'success.50' : 'error.50',
                                    border: '1px solid',
                                    borderColor: testResults.success ? 'success.main' : 'error.main',
                                }}
                            >
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                                    {testResults.success ? '✅ Success' : '❌ Failed'}
                                </Typography>

                                <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                                    Executed Nodes: {testResults.executedNodes.length}
                                </Typography>

                                {testResults.executedNodes.length > 0 && (
                                    <Box sx={{ mb: 1 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 600 }}>Node IDs:</Typography>
                                        <Typography variant="caption" sx={{ display: 'block', pl: 1, fontFamily: 'monospace' }}>
                                            {testResults.executedNodes.join(' → ')}
                                        </Typography>
                                    </Box>
                                )}

                                {Object.keys(testResults.context.variables).length > 0 && (
                                    <Box sx={{ mb: 1 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 600 }}>Variables:</Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            size="small"
                                            value={JSON.stringify(testResults.context.variables, null, 2)}
                                            InputProps={{ readOnly: true }}
                                            sx={{ mt: 0.5, fontFamily: 'monospace', fontSize: '0.75rem' }}
                                        />
                                    </Box>
                                )}

                                {testResults.errors.length > 0 && (
                                    <Box>
                                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'error.main' }}>
                                            Errors:
                                        </Typography>
                                        {testResults.errors.map((error: string, index: number) => (
                                            <Typography
                                                key={index}
                                                variant="caption"
                                                sx={{ display: 'block', pl: 1, color: 'error.main' }}
                                            >
                                                • {error}
                                            </Typography>
                                        ))}
                                    </Box>
                                )}
                            </Paper>
                        </Box>
                    )}

                    {/* Action Buttons */}
                    <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button onClick={() => setTestDialogOpen(false)}>Close</Button>
                        <Button variant="contained" onClick={handleRunTest} startIcon={<Play size={16} />}>
                            Run Test
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Dialog>
    );
};
