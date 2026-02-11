/**
 * Workflow Manager Component
 * Comprehensive workflow organization and management system
 * Features: naming, tagging, search, enable/disable, duplicate, version history
 */

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  Typography,
  IconButton,
  Paper,
  TextField,
  Chip,
  alpha,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Tooltip,
  Divider,
  Avatar,
  Badge,
} from '@mui/material';
import {
  X,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Copy,
  Trash2,
  Edit,
  Play,
  Pause,
  History,
  Tag,
  Folder,
  Clock,
  CheckCircle2,
  XCircle,
  Workflow as WorkflowIcon,
  ArrowLeft,
  Save,
  FileText,
} from 'lucide-react';
import { WorkflowBuilder } from './WorkflowBuilder';
import { FormRule, DroppedElement, PageData } from '../types/form.types';
import { Node, Edge } from 'reactflow';

// Workflow metadata interface
export interface WorkflowMetadata {
  id: string;
  name: string;
  description: string;
  tags: string[];
  category: string;
  enabled: boolean;
  nodes: Node[];
  edges: Edge[];
  createdAt: Date;
  updatedAt: Date;
  versions: WorkflowVersion[];
  stats?: {
    totalRuns?: number;
    successRate?: number;
    lastRun?: Date;
  };
}

interface WorkflowVersion {
  id: string;
  version: number;
  name: string;
  timestamp: Date;
  nodes: Node[];
  edges: Edge[];
  changes: string;
}

interface WorkflowManagerProps {
  open: boolean;
  onClose: () => void;
  rules: FormRule[];
  onAddRule: (rule: FormRule) => void;
  onUpdateRule: (ruleId: string, rule: FormRule) => void;
  onDeleteRule: (ruleId: string) => void;
  elements: DroppedElement[];
  pages: PageData[];
}

// Predefined categories
const CATEGORIES = [
  { value: 'all', label: 'All Workflows', color: '#6B7280' },
  { value: 'validation', label: 'Validation', color: '#10B981' },
  { value: 'integration', label: 'Integration', color: '#3B82F6' },
  { value: 'automation', label: 'Automation', color: '#8B5CF6' },
  { value: 'notification', label: 'Notification', color: '#EF4444' },
  { value: 'calculation', label: 'Calculation', color: '#F59E0B' },
  { value: 'other', label: 'Other', color: '#6366F1' },
];

// Predefined tags
const COMMON_TAGS = [
  'API',
  'Email',
  'Webhook',
  'Conditional',
  'Transform',
  'Critical',
  'Testing',
  'Production',
];

export const WorkflowManager: React.FC<WorkflowManagerProps> = ({
  open,
  onClose,
  rules,
  onAddRule,
  onUpdateRule,
  onDeleteRule,
  elements,
  pages,
}) => {
  // State management
  const [workflows, setWorkflows] = useState<WorkflowMetadata[]>([
    // Sample workflows for demo
    {
      id: '1',
      name: 'Lead Notification Workflow',
      description: 'Send email notification when new lead is submitted',
      tags: ['Email', 'Critical', 'Production'],
      category: 'notification',
      enabled: true,
      nodes: [],
      edges: [],
      createdAt: new Date(2024, 0, 15),
      updatedAt: new Date(2024, 0, 20),
      versions: [],
      stats: {
        totalRuns: 247,
        successRate: 98.5,
        lastRun: new Date(),
      },
    },
    {
      id: '2',
      name: 'Form Validation Logic',
      description: 'Complex validation rules for multi-step form',
      tags: ['Conditional', 'Validation'],
      category: 'validation',
      enabled: true,
      nodes: [],
      edges: [],
      createdAt: new Date(2024, 0, 10),
      updatedAt: new Date(2024, 0, 18),
      versions: [],
      stats: {
        totalRuns: 1543,
        successRate: 99.8,
        lastRun: new Date(),
      },
    },
    {
      id: '3',
      name: 'CRM Integration',
      description: 'Sync form data with Salesforce CRM',
      tags: ['API', 'Integration', 'Testing'],
      category: 'integration',
      enabled: false,
      nodes: [],
      edges: [],
      createdAt: new Date(2024, 0, 5),
      updatedAt: new Date(2024, 0, 12),
      versions: [],
      stats: {
        totalRuns: 45,
        successRate: 88.2,
        lastRun: new Date(2024, 0, 12),
      },
    },
  ]);

  const [view, setView] = useState<'list' | 'edit'>('list');
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowMetadata | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuWorkflowId, setMenuWorkflowId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Partial<WorkflowMetadata> | null>(null);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);

  // Filtered workflows
  const filteredWorkflows = useMemo(() => {
    return workflows.filter((workflow) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        workflow.name.toLowerCase().includes(searchLower) ||
        workflow.description.toLowerCase().includes(searchLower) ||
        workflow.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      // Category filter
      const matchesCategory = selectedCategory === 'all' || workflow.category === selectedCategory;

      // Tags filter
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => workflow.tags.includes(tag));

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [workflows, searchQuery, selectedCategory, selectedTags]);

  // Stats
  const stats = useMemo(() => {
    const total = workflows.length;
    const enabled = workflows.filter((w) => w.enabled).length;
    const disabled = total - enabled;
    return { total, enabled, disabled };
  }, [workflows]);

  // Handlers
  const handleCreateWorkflow = () => {
    const newWorkflow: WorkflowMetadata = {
      id: `workflow-${Date.now()}`,
      name: 'Untitled Workflow',
      description: '',
      tags: [],
      category: 'other',
      enabled: true,
      nodes: [],
      edges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      versions: [],
    };
    setWorkflows([...workflows, newWorkflow]);
    setCurrentWorkflow(newWorkflow);
    setView('edit');
  };

  const handleOpenWorkflow = (workflow: WorkflowMetadata) => {
    setCurrentWorkflow(workflow);
    setView('edit');
  };

  const handleBackToList = () => {
    setView('list');
    setCurrentWorkflow(null);
  };

  const handleSaveWorkflow = (nodes: Node[], edges: Edge[]) => {
    if (currentWorkflow) {
      const updatedWorkflow = {
        ...currentWorkflow,
        nodes,
        edges,
        updatedAt: new Date(),
      };
      setWorkflows(
        workflows.map((w) => (w.id === currentWorkflow.id ? updatedWorkflow : w))
      );
      setCurrentWorkflow(updatedWorkflow);
    }
  };

  const handleToggleEnabled = (workflowId: string) => {
    setWorkflows(
      workflows.map((w) =>
        w.id === workflowId ? { ...w, enabled: !w.enabled, updatedAt: new Date() } : w
      )
    );
  };

  const handleDuplicateWorkflow = (workflowId: string) => {
    const workflow = workflows.find((w) => w.id === workflowId);
    if (workflow) {
      const duplicated: WorkflowMetadata = {
        ...workflow,
        id: `workflow-${Date.now()}`,
        name: `${workflow.name} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date(),
        versions: [],
        stats: undefined,
      };
      setWorkflows([...workflows, duplicated]);
    }
    handleMenuClose();
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      setWorkflows(workflows.filter((w) => w.id !== workflowId));
    }
    handleMenuClose();
  };

  const handleEditMetadata = (workflow: WorkflowMetadata) => {
    setEditingWorkflow(workflow);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleSaveMetadata = () => {
    if (editingWorkflow && editingWorkflow.id) {
      setWorkflows(
        workflows.map((w) =>
          w.id === editingWorkflow.id
            ? { ...w, ...editingWorkflow, updatedAt: new Date() }
            : w
        )
      );
      setEditDialogOpen(false);
      setEditingWorkflow(null);
    }
  };

  const handleViewVersionHistory = (workflow: WorkflowMetadata) => {
    setCurrentWorkflow(workflow);
    setVersionHistoryOpen(true);
    handleMenuClose();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, workflowId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuWorkflowId(workflowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuWorkflowId(null);
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // If editing a workflow, show the workflow builder
  if (view === 'edit' && currentWorkflow) {
    return (
      <WorkflowBuilder
        open={open}
        onClose={onClose}
        rules={rules}
        onAddRule={onAddRule}
        onUpdateRule={onUpdateRule}
        onDeleteRule={onDeleteRule}
        elements={elements}
        pages={pages}
        workflow={currentWorkflow}
        onSave={handleSaveWorkflow}
        onBack={handleBackToList}
      />
    );
  }

  // Otherwise show the workflow list/management view
  return (
    <>
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
                Workflow Manager
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Organize, manage, and debug your workflows
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<Plus size={16} />}
              onClick={handleCreateWorkflow}
              sx={{ textTransform: 'none' }}
            >
              New Workflow
            </Button>
            <IconButton onClick={onClose} size="small">
              <X size={20} />
            </IconButton>
          </Box>
        </DialogTitle>

        {/* Main Content */}
        <DialogContent sx={{ p: 3 }}>
          {/* Stats Cards */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Paper sx={{ flex: 1, p: 2.5, bgcolor: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Total Workflows
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: alpha('#3B82F6', 0.12),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#3B82F6',
                  }}
                >
                  <WorkflowIcon size={24} />
                </Box>
              </Box>
            </Paper>
            <Paper sx={{ flex: 1, p: 2.5, bgcolor: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {stats.enabled}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Active
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: alpha('#10B981', 0.12),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10B981',
                  }}
                >
                  <CheckCircle2 size={24} />
                </Box>
              </Box>
            </Paper>
            <Paper sx={{ flex: 1, p: 2.5, bgcolor: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {stats.disabled}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabled
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: alpha('#EF4444', 0.12),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#EF4444',
                  }}
                >
                  <Pause size={24} />
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Search and Filters */}
          <Paper sx={{ p: 2, mb: 3, bgcolor: 'white' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search workflows by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Category Filter */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {CATEGORIES.map((cat) => (
                <Chip
                  key={cat.value}
                  label={cat.label}
                  size="small"
                  onClick={() => setSelectedCategory(cat.value)}
                  sx={{
                    bgcolor:
                      selectedCategory === cat.value
                        ? alpha(cat.color, 0.12)
                        : 'transparent',
                    borderColor: cat.color,
                    color: selectedCategory === cat.value ? cat.color : 'text.secondary',
                    fontWeight: selectedCategory === cat.value ? 600 : 400,
                    border: '1px solid',
                    '&:hover': {
                      bgcolor: alpha(cat.color, 0.08),
                    },
                  }}
                />
              ))}
            </Box>

            {/* Tag Filter */}
            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', mb: 1, display: 'block' }}
              >
                Filter by tags:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {COMMON_TAGS.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    onClick={() => handleTagToggle(tag)}
                    sx={{
                      bgcolor: selectedTags.includes(tag)
                        ? alpha('#3B82F6', 0.12)
                        : 'transparent',
                      borderColor: selectedTags.includes(tag) ? '#3B82F6' : '#E5E7EB',
                      color: selectedTags.includes(tag) ? '#3B82F6' : 'text.secondary',
                      fontWeight: selectedTags.includes(tag) ? 600 : 400,
                      border: '1px solid',
                      '&:hover': {
                        bgcolor: alpha('#3B82F6', 0.08),
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Paper>

          {/* Workflows List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredWorkflows.length === 0 ? (
              <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'white' }}>
                <WorkflowIcon size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                  No workflows found
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {searchQuery || selectedTags.length > 0
                    ? 'Try adjusting your filters'
                    : 'Get started by creating your first workflow'}
                </Typography>
                {!searchQuery && selectedTags.length === 0 && (
                  <Button
                    variant="contained"
                    startIcon={<Plus size={16} />}
                    onClick={handleCreateWorkflow}
                    sx={{ textTransform: 'none' }}
                  >
                    Create Workflow
                  </Button>
                )}
              </Paper>
            ) : (
              filteredWorkflows.map((workflow) => {
                const category = CATEGORIES.find((c) => c.value === workflow.category);
                return (
                  <Paper
                    key={workflow.id}
                    sx={{
                      p: 2.5,
                      bgcolor: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: (theme) =>
                          `0 4px 12px ${alpha(theme.palette.primary.main, 0.12)}`,
                        transform: 'translateY(-2px)',
                      },
                    }}
                    onClick={() => handleOpenWorkflow(workflow)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      {/* Icon */}
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: alpha(category?.color || '#6B7280', 0.12),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: category?.color || '#6B7280',
                          flexShrink: 0,
                        }}
                      >
                        <WorkflowIcon size={24} />
                      </Box>

                      {/* Content */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                            {workflow.name}
                          </Typography>
                          <Chip
                            label={category?.label || 'Other'}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              bgcolor: alpha(category?.color || '#6B7280', 0.12),
                              color: category?.color || '#6B7280',
                            }}
                          />
                          <Box sx={{ flex: 1 }} />
                          <Switch
                            checked={workflow.enabled}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleEnabled(workflow.id);
                            }}
                            size="small"
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            mb: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {workflow.description || 'No description'}
                        </Typography>

                        {/* Tags */}
                        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 1.5 }}>
                          {workflow.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              icon={<Tag size={12} />}
                              sx={{
                                height: 22,
                                fontSize: '0.7rem',
                                bgcolor: alpha('#3B82F6', 0.08),
                                color: '#3B82F6',
                              }}
                            />
                          ))}
                        </Box>

                        {/* Stats and Meta */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            pt: 1.5,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Clock size={14} style={{ opacity: 0.5 }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Updated {workflow.updatedAt.toLocaleDateString()}
                            </Typography>
                          </Box>

                          {workflow.stats && (
                            <>
                              <Divider orientation="vertical" flexItem />
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Play size={14} style={{ opacity: 0.5 }} />
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  {workflow.stats.totalRuns} runs
                                </Typography>
                              </Box>
                              <Divider orientation="vertical" flexItem />
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CheckCircle2
                                  size={14}
                                  style={{
                                    color:
                                      workflow.stats.successRate >= 95 ? '#10B981' : '#F59E0B',
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color:
                                      workflow.stats.successRate >= 95
                                        ? '#10B981'
                                        : '#F59E0B',
                                    fontWeight: 600,
                                  }}
                                >
                                  {workflow.stats.successRate}% success
                                </Typography>
                              </Box>
                            </>
                          )}

                          <Box sx={{ flex: 1 }} />

                          {/* Actions Menu */}
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuOpen(e, workflow.id);
                            }}
                          >
                            <MoreVertical size={16} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                );
              })
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            const workflow = workflows.find((w) => w.id === menuWorkflowId);
            if (workflow) handleEditMetadata(workflow);
          }}
        >
          <ListItemIcon>
            <Edit size={16} />
          </ListItemIcon>
          <ListItemText>Edit Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => menuWorkflowId && handleDuplicateWorkflow(menuWorkflowId)}>
          <ListItemIcon>
            <Copy size={16} />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            const workflow = workflows.find((w) => w.id === menuWorkflowId);
            if (workflow) handleViewVersionHistory(workflow);
          }}
        >
          <ListItemIcon>
            <History size={16} />
          </ListItemIcon>
          <ListItemText>Version History</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => menuWorkflowId && handleDeleteWorkflow(menuWorkflowId)}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <Trash2 size={16} color="currentColor" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Metadata Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Workflow Details</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Workflow Name"
              value={editingWorkflow?.name || ''}
              onChange={(e) =>
                setEditingWorkflow({ ...editingWorkflow, name: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={editingWorkflow?.description || ''}
              onChange={(e) =>
                setEditingWorkflow({ ...editingWorkflow, description: e.target.value })
              }
            />
            <TextField
              fullWidth
              select
              label="Category"
              value={editingWorkflow?.category || 'other'}
              onChange={(e) =>
                setEditingWorkflow({ ...editingWorkflow, category: e.target.value })
              }
            >
              {CATEGORIES.filter((c) => c.value !== 'all').map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </TextField>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                {COMMON_TAGS.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    onClick={() => {
                      const currentTags = editingWorkflow?.tags || [];
                      const newTags = currentTags.includes(tag)
                        ? currentTags.filter((t) => t !== tag)
                        : [...currentTags, tag];
                      setEditingWorkflow({ ...editingWorkflow, tags: newTags });
                    }}
                    sx={{
                      bgcolor: editingWorkflow?.tags?.includes(tag)
                        ? alpha('#3B82F6', 0.12)
                        : 'transparent',
                      borderColor: editingWorkflow?.tags?.includes(tag)
                        ? '#3B82F6'
                        : '#E5E7EB',
                      color: editingWorkflow?.tags?.includes(tag)
                        ? '#3B82F6'
                        : 'text.secondary',
                      border: '1px solid',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <Box sx={{ p: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveMetadata}>
            Save Changes
          </Button>
        </Box>
      </Dialog>

      {/* Version History Dialog */}
      <Dialog
        open={versionHistoryOpen}
        onClose={() => setVersionHistoryOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <History size={20} />
            Version History - {currentWorkflow?.name}
          </Box>
        </DialogTitle>
        <DialogContent>
          {currentWorkflow?.versions && currentWorkflow.versions.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {currentWorkflow.versions.map((version) => (
                <Paper key={version.id} sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Chip label={`v${version.version}`} size="small" color="primary" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {version.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', ml: 'auto' }}>
                      {version.timestamp.toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {version.changes}
                  </Typography>
                  <Button size="small" sx={{ mt: 1 }}>
                    Restore This Version
                  </Button>
                </Paper>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <History size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No version history available yet
              </Typography>
            </Box>
          )}
        </DialogContent>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => setVersionHistoryOpen(false)}>Close</Button>
        </Box>
      </Dialog>
    </>
  );
};
