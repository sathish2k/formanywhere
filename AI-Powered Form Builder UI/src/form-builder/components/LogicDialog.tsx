/**
 * Logic Dialog Component
 * Manage form logic rules and conditional behavior with multiple conditions and actions
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  Typography,
  IconButton,
  Card,
  CardContent,
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  alpha,
  ToggleButtonGroup,
  ToggleButton,
  Switch,
} from '@mui/material';
import { X, Plus, Trash2, Edit2, Settings, Zap, ChevronRight, Power } from 'lucide-react';
import { FormRule, DroppedElement, PageData } from '../types/form.types';

interface LogicDialogProps {
  open: boolean;
  onClose: () => void;
  rules: FormRule[];
  onAddRule: (rule: FormRule) => void;
  onUpdateRule: (ruleId: string, rule: FormRule) => void;
  onDeleteRule: (ruleId: string) => void;
  elements: DroppedElement[];
  pages: PageData[];
}

export const LogicDialog: React.FC<LogicDialogProps> = ({
  open,
  onClose,
  rules,
  onAddRule,
  onUpdateRule,
  onDeleteRule,
  elements,
  pages,
}) => {
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [newRule, setNewRule] = useState<FormRule>({
    id: '',
    name: '',
    enabled: true,
    trigger: 'onChange',
    triggerFieldId: undefined,
    conditions: [{ fieldId: '', operator: 'equals', value: '' }],
    conditionOperator: 'AND',
    actions: [{ type: 'show', targetId: '', value: '' }],
  });

  const handleStartAddRule = () => {
    setIsAddingRule(true);
    setEditingRuleId(null);
    setNewRule({
      id: `rule-${Date.now()}`,
      name: '',
      enabled: true,
      trigger: 'onChange',
      triggerFieldId: undefined,
      conditions: [{ fieldId: '', operator: 'equals', value: '' }],
      conditionOperator: 'AND',
      actions: [{ type: 'show', targetId: '', value: '' }],
    });
  };

  const handleEditRule = (rule: FormRule) => {
    setIsAddingRule(true);
    setEditingRuleId(rule.id);
    setNewRule({ ...rule });
  };

  const handleSaveRule = () => {
    // Validate all conditions and actions
    const hasValidConditions = newRule.conditions.every((c) => c.fieldId && c.operator);
    const hasValidActions = newRule.actions.every((a) => a.type && a.targetId);

    if (!newRule.name || !hasValidConditions || !hasValidActions) {
      return;
    }

    if (editingRuleId) {
      onUpdateRule(editingRuleId, newRule);
    } else {
      onAddRule(newRule);
    }

    setIsAddingRule(false);
    setEditingRuleId(null);
    setNewRule({
      id: '',
      name: '',
      conditions: [{ fieldId: '', operator: 'equals', value: '' }],
      conditionOperator: 'AND',
      actions: [{ type: 'show', targetId: '', value: '' }],
    });
  };

  const handleCancelEdit = () => {
    setIsAddingRule(false);
    setEditingRuleId(null);
  };

  // Add new condition
  const handleAddCondition = () => {
    setNewRule({
      ...newRule,
      conditions: [...newRule.conditions, { fieldId: '', operator: 'equals', value: '' }],
    });
  };

  // Remove condition
  const handleRemoveCondition = (index: number) => {
    if (newRule.conditions.length > 1) {
      setNewRule({
        ...newRule,
        conditions: newRule.conditions.filter((_, i) => i !== index),
      });
    }
  };

  // Update condition
  const handleUpdateCondition = (index: number, updates: Partial<FormRule['conditions'][0]>) => {
    const updatedConditions = [...newRule.conditions];
    updatedConditions[index] = { ...updatedConditions[index], ...updates };
    setNewRule({ ...newRule, conditions: updatedConditions });
  };

  // Add new action
  const handleAddAction = () => {
    setNewRule({
      ...newRule,
      actions: [...newRule.actions, { type: 'show', targetId: '', value: '' }],
    });
  };

  // Remove action
  const handleRemoveAction = (index: number) => {
    if (newRule.actions.length > 1) {
      setNewRule({
        ...newRule,
        actions: newRule.actions.filter((_, i) => i !== index),
      });
    }
  };

  // Update action
  const handleUpdateAction = (index: number, updates: Partial<FormRule['actions'][0]>) => {
    const updatedActions = [...newRule.actions];
    updatedActions[index] = { ...updatedActions[index], ...updates };
    setNewRule({ ...newRule, actions: updatedActions });
  };

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

  const getActionTargetOptions = (actionType: string) => {
    if (actionType === 'navigate') {
      return pages.map((page) => ({
        id: page.id,
        label: page.name,
      }));
    }
    
    return getFieldOptions();
  };

  const operatorLabels: Record<string, string> = {
    equals: 'Equals',
    notEquals: 'Not Equals',
    contains: 'Contains',
    greaterThan: 'Greater Than',
    lessThan: 'Less Than',
    isEmpty: 'Is Empty',
    isNotEmpty: 'Is Not Empty',
  };

  const actionTypeLabels: Record<string, string> = {
    show: 'Show Element',
    hide: 'Hide Element',
    navigate: 'Navigate to Page',
    setValue: 'Set Field Value',
    enable: 'Enable Element',
    disable: 'Disable Element',
  };

  const triggerLabels: Record<FormRule['trigger'], string> = {
    onChange: 'Change',
    onBlur: 'Blur',
    onFocus: 'Focus',
    onSubmit: 'Submit',
    onPageLoad: 'Page Load',
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          bgcolor: '#f9fafb',
        },
      }}
    >
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
            <Zap size={20} style={{ fill: 'currentColor' }} color="inherit" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Form Logic & Rules
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Create conditional logic with multiple conditions and actions
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4, maxWidth: 1400, mx: 'auto', width: '100%' }}>
        {/* Add Rule Button */}
        {!isAddingRule && (
          <Button
            variant="outlined"
            startIcon={<Plus size={18} />}
            onClick={handleStartAddRule}
            sx={{
              mb: 4,
              py: 1.5,
              px: 3,
              borderStyle: 'dashed',
              borderWidth: 2,
              borderColor: 'divider',
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: 'white',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                color: 'primary.main',
              },
            }}
          >
            Add New Rule
          </Button>
        )}

        {/* Rule Editor */}
        {isAddingRule && (
          <Card
            sx={{
              mb: 3,
              border: '2px solid',
              borderColor: 'primary.main',
              boxShadow: (theme) => `0 0 0 4px ${alpha(theme.palette.primary.main, 0.08)}`,
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {editingRuleId ? 'Edit Rule' : 'Create New Rule'}
                </Typography>
              </Box>

              {/* Rule Name and Trigger - Side by side */}
              <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Rule Name"
                  placeholder="e.g., Show address fields when country is selected"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  size="small"
                />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Trigger Event</InputLabel>
                  <Select
                    value={newRule.trigger}
                    onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value as FormRule['trigger'] })}
                    label="Trigger Event"
                  >
                    <MenuItem value="onChange">On Change</MenuItem>
                    <MenuItem value="onBlur">On Blur</MenuItem>
                    <MenuItem value="onFocus">On Focus</MenuItem>
                    <MenuItem value="onSubmit">On Submit</MenuItem>
                    <MenuItem value="onPageLoad">On Page Load</MenuItem>
                  </Select>
                </FormControl>
                {/* Trigger Field Selector - Only show for field-based triggers */}
                {!['onSubmit', 'onPageLoad'].includes(newRule.trigger) && (
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Trigger Field</InputLabel>
                    <Select
                      value={newRule.triggerFieldId || ''}
                      onChange={(e) => setNewRule({ ...newRule, triggerFieldId: e.target.value })}
                      label="Trigger Field"
                    >
                      <MenuItem value="">
                        <em>Any Field</em>
                      </MenuItem>
                      {getFieldOptions().map((field) => (
                        <MenuItem key={field.id} value={field.id}>
                          {field.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>

              {/* CONDITIONS SECTION */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      Conditions
                    </Typography>
                    <ToggleButtonGroup
                      value={newRule.conditionOperator}
                      exclusive
                      onChange={(e, newValue: 'AND' | 'OR' | null) => {
                        if (newValue !== null) {
                          setNewRule(prev => ({ ...prev, conditionOperator: newValue }));
                        }
                      }}
                      size="small"
                      sx={{ height: 28 }}
                    >
                      <ToggleButton 
                        value="AND" 
                        sx={{ 
                          px: 2, 
                          py: 0.5, 
                          textTransform: 'none', 
                          fontWeight: 600, 
                          fontSize: '0.75rem',
                          minWidth: 50,
                          border: '1px solid',
                          borderColor: 'divider',
                          '&.Mui-selected': {
                            bgcolor: 'info.main',
                            color: 'white',
                            borderColor: 'info.main',
                            '&:hover': {
                              bgcolor: 'info.dark',
                            },
                          },
                        }}
                      >
                        AND
                      </ToggleButton>
                      <ToggleButton 
                        value="OR" 
                        sx={{ 
                          px: 2, 
                          py: 0.5, 
                          textTransform: 'none', 
                          fontWeight: 600, 
                          fontSize: '0.75rem',
                          minWidth: 50,
                          border: '1px solid',
                          borderColor: 'divider',
                          '&.Mui-selected': {
                            bgcolor: 'info.main',
                            color: 'white',
                            borderColor: 'info.main',
                            '&:hover': {
                              bgcolor: 'info.dark',
                            },
                          },
                        }}
                      >
                        OR
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                  <Button
                    startIcon={<Plus size={14} />}
                    onClick={handleAddCondition}
                    size="small"
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      py: 0.5,
                      px: 1.5,
                      color: 'info.main',
                      '&:hover': { bgcolor: (theme) => alpha(theme.palette.info.main, 0.08) },
                    }}
                  >
                    Add Condition
                  </Button>
                </Box>

                {newRule.conditions.map((condition, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 1,
                      p: 1.5,
                      bgcolor: (theme) => alpha(theme.palette.info.main, 0.04),
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'info.light',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Chip
                      label={index === 0 ? 'IF' : newRule.conditionOperator}
                      size="small"
                      sx={{
                        bgcolor: (theme) => alpha(theme.palette.info.main, 0.16),
                        color: 'info.main',
                        fontWeight: 700,
                        height: 22,
                        fontSize: '0.65rem',
                      }}
                    />

                    <FormControl size="small" sx={{ flex: 1, minWidth: 140 }}>
                      <InputLabel>Field</InputLabel>
                      <Select
                        value={condition.fieldId}
                        onChange={(e) => handleUpdateCondition(index, { fieldId: e.target.value })}
                        label="Field"
                      >
                        {getFieldOptions().map((field) => (
                          <MenuItem key={field.id} value={field.id}>
                            {field.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ flex: 1, minWidth: 120 }}>
                      <InputLabel>Operator</InputLabel>
                      <Select
                        value={condition.operator}
                        onChange={(e) => handleUpdateCondition(index, { operator: e.target.value })}
                        label="Operator"
                      >
                        {Object.entries(operatorLabels).map(([value, label]) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {!['isEmpty', 'isNotEmpty'].includes(condition.operator) && (
                      <TextField
                        size="small"
                        label="Value"
                        placeholder="Enter value"
                        value={condition.value}
                        onChange={(e) => handleUpdateCondition(index, { value: e.target.value })}
                        sx={{ flex: 1, minWidth: 120 }}
                      />
                    )}

                    {newRule.conditions.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveCondition(index)}
                        sx={{ color: 'error.main' }}
                      >
                        <Trash2 size={14} />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }}>
                <Chip label="THEN" size="small" sx={{ fontWeight: 700, px: 1.5, height: 22, fontSize: '0.7rem' }} />
              </Divider>

              {/* ACTIONS SECTION */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Actions
                  </Typography>
                  <Button
                    startIcon={<Plus size={14} />}
                    onClick={handleAddAction}
                    size="small"
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      py: 0.5,
                      px: 1.5,
                      color: 'success.main',
                      '&:hover': { bgcolor: (theme) => alpha(theme.palette.success.main, 0.08) },
                    }}
                  >
                    Add Action
                  </Button>
                </Box>

                {newRule.actions.map((action, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 1,
                      p: 1.5,
                      bgcolor: (theme) => alpha(theme.palette.success.main, 0.04),
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'success.light',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Chip
                      label={index + 1}
                      size="small"
                      sx={{
                        bgcolor: (theme) => alpha(theme.palette.success.main, 0.16),
                        color: 'success.main',
                        fontWeight: 700,
                        height: 22,
                        minWidth: 22,
                        fontSize: '0.65rem',
                      }}
                    />

                    <FormControl size="small" sx={{ flex: 1, minWidth: 150 }}>
                      <InputLabel>Action Type</InputLabel>
                      <Select
                        value={action.type}
                        onChange={(e) => handleUpdateAction(index, { type: e.target.value, targetId: '' })}
                        label="Action Type"
                      >
                        {Object.entries(actionTypeLabels).map(([value, label]) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ flex: 1, minWidth: 150 }}>
                      <InputLabel>{action.type === 'navigate' ? 'Page' : 'Target'}</InputLabel>
                      <Select
                        value={action.targetId}
                        onChange={(e) => handleUpdateAction(index, { targetId: e.target.value })}
                        label={action.type === 'navigate' ? 'Page' : 'Target'}
                      >
                        {getActionTargetOptions(action.type).map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {action.type === 'setValue' && (
                      <TextField
                        size="small"
                        label="Set Value To"
                        placeholder="Enter value"
                        value={action.value || ''}
                        onChange={(e) => handleUpdateAction(index, { value: e.target.value })}
                        sx={{ flex: 1, minWidth: 120 }}
                      />
                    )}

                    {newRule.actions.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveAction(index)}
                        sx={{ color: 'error.main' }}
                      >
                        <Trash2 size={14} />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleCancelEdit}
                  size="small"
                  sx={{ textTransform: 'none', px: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveRule}
                  size="small"
                  disabled={
                    !newRule.name ||
                    !newRule.conditions.every((c) => c.fieldId && c.operator) ||
                    !newRule.actions.every((a) => a.type && a.targetId)
                  }
                  sx={{ textTransform: 'none', px: 2 }}
                >
                  {editingRuleId ? 'Update Rule' : 'Save Rule'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Rules List Header */}
        {rules.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Active Rules ({rules.length})
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              All rules are applied in the order they appear below
            </Typography>
          </Box>
        )}

        {/* Rules List */}
        {rules.length === 0 && !isAddingRule ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 3,
              bgcolor: 'white',
              borderRadius: 3,
              border: '2px dashed',
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 3,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Settings size={36} color="#919EAB" strokeWidth={1.5} />
            </Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              No Rules Yet
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 400, mx: 'auto' }}>
              Create your first rule to add conditional logic to your form. Rules can show/hide elements, navigate between pages, and more.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {rules.map((rule, index) => (
              <Card
                key={rule.id}
                sx={{
                  border: '1px solid',
                  borderColor: rule.enabled ? 'divider' : 'grey.300',
                  transition: 'all 0.2s',
                  opacity: rule.enabled ? 1 : 0.6,
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: (theme) => `0 0 0 1px ${theme.palette.primary.main}`,
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: 1,
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                          color: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 700, flex: 1 }}>
                        {rule.name}
                      </Typography>
                      
                      {/* Enable/Disable Toggle */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                        <Typography variant="caption" sx={{ color: rule.enabled ? 'success.main' : 'text.secondary', fontWeight: 600 }}>
                          {rule.enabled ? 'Active' : 'Inactive'}
                        </Typography>
                        <Switch
                          checked={rule.enabled}
                          onChange={(e) => onUpdateRule(rule.id, { ...rule, enabled: e.target.checked })}
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: 'success.main',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: 'success.main',
                            },
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditRule(rule)}
                          sx={{
                            '&:hover': {
                              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                              color: 'primary.main',
                            },
                          }}
                        >
                          <Edit2 size={14} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => onDeleteRule(rule.id)}
                          sx={{
                            '&:hover': {
                              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                              color: 'error.main',
                            },
                          }}
                        >
                          <Trash2 size={14} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>

                  {/* Compact Rule Logic Display */}
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                      borderRadius: 1.5,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      {/* Trigger Badge */}
                      <Chip
                        label={`On ${triggerLabels[rule.trigger]}`}
                        size="small"
                        sx={{
                          bgcolor: (theme) => alpha(theme.palette.warning.main, 0.16),
                          color: 'warning.main',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          height: 20,
                          borderRadius: '4px',
                        }}
                      />

                      {/* Conditions Display - Compact */}
                      {rule.conditions.map((condition, condIndex) => (
                        <React.Fragment key={condIndex}>
                          {condIndex > 0 && (
                            <Chip
                              label={rule.conditionOperator}
                              size="small"
                              sx={{
                                bgcolor: (theme) => alpha(theme.palette.info.main, 0.12),
                                color: 'info.main',
                                fontWeight: 600,
                                fontSize: '0.65rem',
                                height: 20,
                              }}
                            />
                          )}
                          {condIndex === 0 && (
                            <Chip
                              label="IF"
                              size="small"
                              sx={{
                                bgcolor: (theme) => alpha(theme.palette.info.main, 0.16),
                                color: 'info.main',
                                fontWeight: 700,
                                fontSize: '0.65rem',
                                height: 20,
                              }}
                            />
                          )}
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {getFieldOptions().find((f) => f.id === condition.fieldId)?.label || 'Field'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {operatorLabels[condition.operator]}
                          </Typography>
                          {!['isEmpty', 'isNotEmpty'].includes(condition.operator) && (
                            <Chip
                              label={`"${condition.value}"`}
                              size="small"
                              sx={{
                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                color: 'primary.main',
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                height: 20,
                              }}
                            />
                          )}
                        </React.Fragment>
                      ))}

                      <ChevronRight size={14} color="#919EAB" style={{ margin: '0 4px' }} />

                      {/* Actions Display - Compact */}
                      {rule.actions.map((action, actIndex) => (
                        <React.Fragment key={actIndex}>
                          {actIndex > 0 && (
                            <Chip
                              label="AND"
                              size="small"
                              sx={{
                                bgcolor: (theme) => alpha(theme.palette.success.main, 0.12),
                                color: 'success.main',
                                fontWeight: 600,
                                fontSize: '0.65rem',
                                height: 20,
                              }}
                            />
                          )}
                          {actIndex === 0 && (
                            <Chip
                              label="THEN"
                              size="small"
                              sx={{
                                bgcolor: (theme) => alpha(theme.palette.success.main, 0.16),
                                color: 'success.main',
                                fontWeight: 700,
                                fontSize: '0.65rem',
                                height: 20,
                              }}
                            />
                          )}
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {actionTypeLabels[action.type]}
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {action.type === 'navigate'
                              ? pages.find((p) => p.id === action.targetId)?.name
                              : getFieldOptions().find((f) => f.id === action.targetId)?.label}
                          </Typography>
                          {action.type === 'setValue' && action.value && (
                            <>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                to
                              </Typography>
                              <Chip
                                label={`"${action.value}"`}
                                size="small"
                                sx={{
                                  bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
                                  color: 'success.main',
                                  fontWeight: 600,
                                  fontSize: '0.7rem',
                                  height: 20,
                                }}
                              />
                            </>
                          )}
                        </React.Fragment>
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};