/**
 * Workflow Builder Component
 * Visual node-based workflow editor similar to n8n/Retool
 * Create complex workflows with API calls, conditions, transformations, and actions
 */

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
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  X,
  Play,
  Save,
  Zap,
  Code,
  GitBranch,
  Database,
  Mail,
  Webhook,
  Eye,
  EyeOff,
  ChevronDown,
  Plus,
  Settings,
  Trash2,
  Workflow,
  ArrowRight,
  Package,
  ArrowLeft,
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
  Connection,
  Panel,
  NodeProps,
  Handle,
  Position,
  useReactFlow,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FormRule, DroppedElement, PageData } from '../types/form.types';

interface WorkflowBuilderProps {
  open: boolean;
  onClose: () => void;
  rules: FormRule[];
  onAddRule: (rule: FormRule) => void;
  onUpdateRule: (ruleId: string, rule: FormRule) => void;
  onDeleteRule: (ruleId: string) => void;
  elements: DroppedElement[];
  pages: PageData[];
  workflow?: any; // Optional workflow metadata from WorkflowManager
  onSave?: (nodes: Node[], edges: Edge[]) => void; // Optional save callback
  onBack?: () => void; // Optional back callback
}

// Node types for workflow blocks
type NodeType = 'start' | 'api' | 'condition' | 'transform' | 'action' | 'email' | 'webhook' | 'navigate' | 'variable';

interface WorkflowNodeData {
  label: string;
  type: NodeType;
  config?: any;
}

// Block categories for sidebar
const WORKFLOW_BLOCKS = [
  {
    category: 'Triggers',
    blocks: [
      { type: 'start', label: 'Start', icon: Play, color: '#10B981', description: 'Workflow entry point' },
    ],
  },
  {
    category: 'Actions',
    blocks: [
      { type: 'api', label: 'API Call', icon: Database, color: '#3B82F6', description: 'Make HTTP requests' },
      { type: 'action', label: 'Form Action', icon: Settings, color: '#8B5CF6', description: 'Show/hide/enable fields' },
      { type: 'email', label: 'Send Email', icon: Mail, color: '#EF4444', description: 'Send email notifications' },
      { type: 'webhook', label: 'Webhook', icon: Webhook, color: '#F59E0B', description: 'Call external webhooks' },
      { type: 'navigate', label: 'Navigate', icon: ArrowRight, color: '#6366F1', description: 'Navigate to a different page' },
    ],
  },
  {
    category: 'Logic',
    blocks: [
      { type: 'condition', label: 'Condition', icon: GitBranch, color: '#EC4899', description: 'Conditional branching' },
      { type: 'transform', label: 'Transform Data', icon: Code, color: '#06B6D4', description: 'Transform and map data' },
    ],
  },
  {
    category: 'Data',
    blocks: [
      { type: 'variable', label: 'Set Variable', icon: Package, color: '#F59E0B', description: 'Store and reuse data' },
    ],
  },
];

// Custom Node Component
const CustomWorkflowNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data, selected }) => {
  const block = WORKFLOW_BLOCKS.flatMap((cat) => cat.blocks).find((b) => b.type === data.type);
  const Icon = block?.icon || Settings;
  const color = block?.color || '#6B7280';
  const isCondition = data.type === 'condition';

  return (
    <Box
      sx={{
        minWidth: 45,
        maxWidth: 55,
        bgcolor: 'white',
        borderRadius: 0.75,
        border: '1.5px solid',
        borderColor: selected ? color : alpha(color, 0.2),
        boxShadow: selected
          ? `0 2px 8px ${alpha(color, 0.2)}`
          : '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'all 0.12s',
        '&:hover': {
          borderColor: color,
          boxShadow: `0 2px 8px ${alpha(color, 0.15)}`,
        },
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ 
          background: color, 
          width: 3, 
          height: 3,
          border: 'none',
        }} 
      />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2, p: 0.4, pt: 0.5 }}>
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: 0.4,
            bgcolor: alpha(color, 0.12),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            flexShrink: 0,
          }}
        >
          <Icon size={8} strokeWidth={2.5} />
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            fontSize: '0.5rem',
            color: 'text.primary',
            lineHeight: 1,
            textAlign: 'center',
            px: 0.2,
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
              width: 3, 
              height: 3,
              border: 'none',
              left: '30%',
            }} 
          />
          <Handle 
            type="source" 
            position={Position.Bottom}
            id="false"
            style={{ 
              background: '#EF4444',
              width: 3, 
              height: 3,
              border: 'none',
              left: '70%',
            }} 
          />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            px: 0.4,
            pb: 0.3,
            gap: 0.2,
          }}>
            <Typography sx={{ fontSize: '0.4rem', color: '#10B981', fontWeight: 700 }}>
              IF
            </Typography>
            <Typography sx={{ fontSize: '0.4rem', color: '#EF4444', fontWeight: 700 }}>
              ELSE
            </Typography>
          </Box>
        </>
      ) : (
        <Handle 
          type="source" 
          position={Position.Bottom} 
          style={{ 
            background: color,
            width: 3, 
            height: 3,
            border: 'none',
          }} 
        />
      )}
    </Box>
  );
};

const nodeTypes = {
  custom: CustomWorkflowNode,
};

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  open,
  onClose,
  rules,
  onAddRule,
  onUpdateRule,
  onDeleteRule,
  elements,
  pages,
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

  // Handle node connection
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle drag start from sidebar
  const onDragStart = (event: React.DragEvent, nodeType: NodeType, label: string, color: string) => {
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

      const { nodeType, label, color } = JSON.parse(data);

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

  // Add a new node to the canvas (for click)
  const addNode = (type: NodeType, label: string, color: string) => {
    const id = `node-${Date.now()}`;
    const newNode: Node<WorkflowNodeData> = {
      id,
      type: 'custom',
      position: { x: 250, y: nodes.length * 100 + 50 },
      data: { label, type, config: {} },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Handle node selection
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node<WorkflowNodeData>) => {
      setSelectedNode(node);
      setPropertiesOpen(true);
    },
    []
  );

  // Delete selected node
  const deleteNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id));
      setSelectedNode(null);
      setPropertiesOpen(false);
    }
  };

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

  // Get form field options
  const getFieldOptions = () => {
    const fields: Array<{ id: string; label: string }> = [];
    
    const extractFields = (elementsList: DroppedElement[]) => {
      elementsList.forEach((element) => {
        if (element.label && !element.isLayoutElement) {
          fields.push({
            id: element.id,
            label: element.label,
          });
        }
        
        if (element.children) {
          extractFields(element.children);
        }
        if (element.column1Children) extractFields(element.column1Children);
        if (element.column2Children) extractFields(element.column2Children);
        if (element.column3Children) extractFields(element.column3Children);
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
                <MenuItem value="PATCH">PATCH</MenuItem>
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
            <TextField
              fullWidth
              size="small"
              label="Headers (JSON)"
              placeholder='{"Authorization": "Bearer token"}'
              value={config.headers || ''}
              onChange={(e) => updateNodeConfig({ ...config, headers: e.target.value })}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              label="Request Body (JSON)"
              placeholder='{"key": "value"}'
              value={config.body || ''}
              onChange={(e) => updateNodeConfig({ ...config, body: e.target.value })}
              multiline
              rows={4}
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
                <MenuItem value="isEmpty">Is Empty</MenuItem>
                <MenuItem value="isNotEmpty">Is Not Empty</MenuItem>
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

      case 'transform':
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
              Transform Data
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="Input Variable"
              placeholder="response.data"
              value={config.input || ''}
              onChange={(e) => updateNodeConfig({ ...config, input: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              label="Transform Code (JavaScript)"
              placeholder="return data.map(item => item.name);"
              value={config.code || ''}
              onChange={(e) => updateNodeConfig({ ...config, code: e.target.value })}
              multiline
              rows={6}
              sx={{ mb: 2, fontFamily: 'monospace' }}
            />
            <TextField
              fullWidth
              size="small"
              label="Output Variable"
              placeholder="transformedData"
              value={config.output || ''}
              onChange={(e) => updateNodeConfig({ ...config, output: e.target.value })}
            />
          </Box>
        );

      case 'action':
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
              Form Action
            </Typography>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Action Type</InputLabel>
              <Select
                value={config.actionType || 'show'}
                onChange={(e) => updateNodeConfig({ ...config, actionType: e.target.value })}
                label="Action Type"
              >
                <MenuItem value="show">Show Element</MenuItem>
                <MenuItem value="hide">Hide Element</MenuItem>
                <MenuItem value="enable">Enable Element</MenuItem>
                <MenuItem value="disable">Disable Element</MenuItem>
                <MenuItem value="setValue">Set Field Value</MenuItem>
                <MenuItem value="navigate">Navigate to Page</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Target Element</InputLabel>
              <Select
                value={config.targetId || ''}
                onChange={(e) => updateNodeConfig({ ...config, targetId: e.target.value })}
                label="Target Element"
              >
                {getFieldOptions().map((field) => (
                  <MenuItem key={field.id} value={field.id}>
                    {field.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {config.actionType === 'setValue' && (
              <TextField
                fullWidth
                size="small"
                label="Value"
                value={config.value || ''}
                onChange={(e) => updateNodeConfig({ ...config, value: e.target.value })}
              />
            )}
          </Box>
        );

      case 'email':
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
              Email Configuration
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="To"
              placeholder="user@example.com"
              value={config.to || ''}
              onChange={(e) => updateNodeConfig({ ...config, to: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              label="Subject"
              placeholder="Email subject"
              value={config.subject || ''}
              onChange={(e) => updateNodeConfig({ ...config, subject: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              size="small"
              label="Body"
              placeholder="Email body content"
              value={config.body || ''}
              onChange={(e) => updateNodeConfig({ ...config, body: e.target.value })}
              multiline
              rows={6}
            />
          </Box>
        );

      case 'webhook':
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
              Webhook Configuration
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="Webhook URL"
              placeholder="https://hooks.example.com/webhook"
              value={config.url || ''}
              onChange={(e) => updateNodeConfig({ ...config, url: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Method</InputLabel>
              <Select
                value={config.method || 'POST'}
                onChange={(e) => updateNodeConfig({ ...config, method: e.target.value })}
                label="Method"
              >
                <MenuItem value="POST">POST</MenuItem>
                <MenuItem value="PUT">PUT</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              size="small"
              label="Payload (JSON)"
              placeholder='{"event": "form_submitted"}'
              value={config.payload || ''}
              onChange={(e) => updateNodeConfig({ ...config, payload: e.target.value })}
              multiline
              rows={4}
            />
          </Box>
        );

      case 'navigate':
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
              Navigation Configuration
            </Typography>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Target Page</InputLabel>
              <Select
                value={config.pageId || ''}
                onChange={(e) => updateNodeConfig({ ...config, pageId: e.target.value })}
                label="Target Page"
              >
                {pages.map((page) => (
                  <MenuItem key={page.id} value={page.id}>
                    {page.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );

      case 'variable':
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
              Set Variable Configuration
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="Variable Name"
              placeholder="myVariable"
              value={config.variableName || ''}
              onChange={(e) => updateNodeConfig({ ...config, variableName: e.target.value })}
              sx={{ mb: 2 }}
              helperText="Use this name to reference the variable in other blocks"
            />
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Value Source</InputLabel>
              <Select
                value={config.valueSource || 'static'}
                onChange={(e) => updateNodeConfig({ ...config, valueSource: e.target.value })}
                label="Value Source"
              >
                <MenuItem value="static">Static Value</MenuItem>
                <MenuItem value="field">Form Field</MenuItem>
                <MenuItem value="api">API Response</MenuItem>
                <MenuItem value="expression">Expression</MenuItem>
              </Select>
            </FormControl>
            
            {config.valueSource === 'static' && (
              <TextField
                fullWidth
                size="small"
                label="Value"
                placeholder="Enter static value"
                value={config.value || ''}
                onChange={(e) => updateNodeConfig({ ...config, value: e.target.value })}
                multiline
                rows={3}
              />
            )}

            {config.valueSource === 'field' && (
              <FormControl fullWidth size="small">
                <InputLabel>Select Field</InputLabel>
                <Select
                  value={config.fieldId || ''}
                  onChange={(e) => updateNodeConfig({ ...config, fieldId: e.target.value })}
                  label="Select Field"
                >
                  {getFieldOptions().map((field) => (
                    <MenuItem key={field.id} value={field.id}>
                      {field.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {config.valueSource === 'api' && (
              <TextField
                fullWidth
                size="small"
                label="API Response Path"
                placeholder="response.data.user.name"
                value={config.apiPath || ''}
                onChange={(e) => updateNodeConfig({ ...config, apiPath: e.target.value })}
                helperText="Dot notation to access nested values"
              />
            )}

            {config.valueSource === 'expression' && (
              <TextField
                fullWidth
                size="small"
                label="JavaScript Expression"
                placeholder="field1 + field2"
                value={config.expression || ''}
                onChange={(e) => updateNodeConfig({ ...config, expression: e.target.value })}
                multiline
                rows={3}
                sx={{ fontFamily: 'monospace' }}
                helperText="Write JavaScript to compute the value"
              />
            )}
          </Box>
        );

      default:
        return (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No configuration available for this node type.
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>\n          <Box
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
            <Workflow size={20} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Workflow Builder
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Build visual workflows with API calls, conditions, and actions
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Save size={16} />}
            sx={{ textTransform: 'none' }}
            onClick={() => onSave && onSave(nodes, edges)}
          >
            Save
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Play size={16} />}
            sx={{ textTransform: 'none' }}
          >
            Test Run
          </Button>
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Main Content */}
      <DialogContent sx={{ p: 0, display: 'flex', height: 'calc(100vh - 80px)' }}>
        {/* Left Sidebar - Blocks Palette */}
        <Drawer
          variant="persistent"
          anchor="left"
          open={sidebarOpen}
          sx={{
            width: 260,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 260,
              position: 'relative',
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: 'white',
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.25, fontSize: '0.813rem' }}>
              Workflow Blocks
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.688rem' }}>
              Drag blocks to canvas or click to add
            </Typography>
          </Box>
          <Box sx={{ p: 1.5, overflow: 'auto' }}>
            {WORKFLOW_BLOCKS.map((category, idx) => (
              <Box key={idx} sx={{ mb: 2 }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 700,
                    fontSize: '0.625rem',
                    letterSpacing: '0.08em',
                    mb: 0.75,
                    display: 'block',
                    px: 0.5,
                  }}
                >
                  {category.category}
                </Typography>
                {category.blocks.map((block) => {
                  const Icon = block.icon;
                  return (
                    <Paper
                      key={block.type}
                      draggable
                      onDragStart={(e) => onDragStart(e, block.type as NodeType, block.label, block.color)}
                      onClick={() => addNode(block.type as NodeType, block.label, block.color)}
                      elevation={0}
                      sx={{
                        p: 1,
                        mb: 0.75,
                        cursor: 'grab',
                        border: '1px solid',
                        borderColor: alpha(block.color, 0.2),
                        borderRadius: 1.5,
                        bgcolor: alpha(block.color, 0.03),
                        transition: 'all 0.15s ease',
                        '&:active': {
                          cursor: 'grabbing',
                        },
                        '&:hover': {
                          borderColor: block.color,
                          bgcolor: alpha(block.color, 0.08),
                          transform: 'translateX(2px)',
                          boxShadow: `0 2px 8px ${alpha(block.color, 0.12)}`,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: 1.25,
                            bgcolor: alpha(block.color, 0.12),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: block.color,
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={14} strokeWidth={2.5} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600, 
                              fontSize: '0.75rem',
                              lineHeight: 1.3,
                              mb: 0.25,
                            }}
                          >
                            {block.label}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'text.secondary', 
                              fontSize: '0.65rem',
                              lineHeight: 1.2,
                              display: 'block',
                            }}
                          >
                            {block.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Drawer>

        {/* Canvas */}
        <Box sx={{ flex: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
            nodeTypes={nodeTypes}
            onInit={setReactFlowInstance}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#E5E7EB" />
            <Controls />
          </ReactFlow>
        </Box>

        {/* Right Sidebar - Properties Panel */}
        <Drawer
          variant="persistent"
          anchor="right"
          open={propertiesOpen && selectedNode !== null}
          sx={{
            width: 320,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 320,
              position: 'relative',
              borderLeft: '1px solid',
              borderColor: 'divider',
              bgcolor: 'white',
            },
          }}
        >
          {selectedNode && (
            <>
              <Box
                sx={{
                  p: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {selectedNode.data.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Configure block properties
                  </Typography>
                </Box>
                <IconButton size="small" onClick={deleteNode} sx={{ color: 'error.main' }}>
                  <Trash2 size={16} />
                </IconButton>
              </Box>
              <Box sx={{ p: 2, overflow: 'auto' }}>{renderNodeProperties()}</Box>
            </>
          )}
        </Drawer>
      </DialogContent>
    </Dialog>
  );
};