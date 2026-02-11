/**
 * Rules Manager Dialog
 * Simplified UI for managing form conditional rules
 */

'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Button,
    Typography,
    IconButton,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Switch,
    FormControlLabel,
    Divider,
} from '@mui/material';
import { X, Plus, Trash2, Save } from 'lucide-react';
import type { Rule, Condition, RuleAction, DroppedElement, ConditionOperator } from '../form-builder.configuration';

interface RulesManagerProps {
    open: boolean;
    onClose: () => void;
    rules: Rule[];
    elements: DroppedElement[];
    onAddRule: (rule: Rule) => void;
    onUpdateRule: (ruleId: string, rule: Rule) => void;
    onDeleteRule: (ruleId: string) => void;
}

export const RulesManager: React.FC<RulesManagerProps> = ({
    open,
    onClose,
    rules,
    elements,
    onAddRule,
    onUpdateRule,
    onDeleteRule,
}) => {
    const [editingRule, setEditingRule] = useState<Rule | null>(null);
    const [isNewRule, setIsNewRule] = useState(false);

    const handleCreateNew = () => {
        const newRule: Rule = {
            id: `rule-${Date.now()}`,
            name: 'New Rule',
            enabled: true,
            conditions: [{ fieldId: '', operator: 'equals', value: '' }],
            operator: 'AND',
            actions: [{ type: 'show', targetId: '' }],
        };
        setEditingRule(newRule);
        setIsNewRule(true);
    };

    const handleSaveRule = () => {
        if (!editingRule) return;

        if (isNewRule) {
            onAddRule(editingRule);
        } else {
            onUpdateRule(editingRule.id, editingRule);
        }

        setEditingRule(null);
        setIsNewRule(false);
    };

    const handleDeleteRule = (ruleId: string) => {
        onDeleteRule(ruleId);
        if (editingRule?.id === ruleId) {
            setEditingRule(null);
        }
    };

    const updateCondition = (index: number, updates: Partial<Condition>) => {
        if (!editingRule) return;
        const newConditions = [...editingRule.conditions];
        newConditions[index] = { ...newConditions[index], ...updates };
        setEditingRule({ ...editingRule, conditions: newConditions });
    };

    const addCondition = () => {
        if (!editingRule) return;
        setEditingRule({
            ...editingRule,
            conditions: [
                ...editingRule.conditions,
                { fieldId: '', operator: 'equals', value: '' },
            ],
        });
    };

    const updateAction = (index: number, updates: Partial<RuleAction>) => {
        if (!editingRule) return;
        const newActions = [...editingRule.actions];
        newActions[index] = { ...newActions[index], ...updates };
        setEditingRule({ ...editingRule, actions: newActions });
    };

    const addAction = () => {
        if (!editingRule) return;
        setEditingRule({
            ...editingRule,
            actions: [...editingRule.actions, { type: 'show', targetId: '' }],
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight={700}>
                    Rules & Conditional Logic
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <X size={20} />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', gap: 2, minHeight: 400 }}>
                    {/* Rules List */}
                    <Box sx={{ width: 250, borderRight: '1px solid', borderColor: 'divider', pr: 2 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<Plus size={16} />}
                            onClick={handleCreateNew}
                            sx={{ mb: 2 }}
                        >
                            New Rule
                        </Button>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {rules.map((rule) => (
                                <Paper
                                    key={rule.id}
                                    sx={{
                                        p: 1.5,
                                        cursor: 'pointer',
                                        border: '1px solid',
                                        borderColor: editingRule?.id === rule.id ? 'primary.main' : 'divider',
                                        bgcolor: editingRule?.id === rule.id ? 'primary.50' : 'transparent',
                                        '&:hover': { bgcolor: 'grey.50' },
                                    }}
                                    onClick={() => {
                                        setEditingRule(rule);
                                        setIsNewRule(false);
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" fontWeight={600}>
                                            {rule.name}
                                        </Typography>
                                        <Switch checked={rule.enabled} size="small" />
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        {rule.conditions.length} condition(s), {rule.actions.length} action(s)
                                    </Typography>
                                </Paper>
                            ))}
                        </Box>
                    </Box>

                    {/* Rule Editor */}
                    <Box sx={{ flex: 1 }}>
                        {editingRule ? (
                            <Box>
                                <TextField
                                    fullWidth
                                    label="Rule Name"
                                    value={editingRule.name}
                                    onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                                    sx={{ mb: 2 }}
                                    size="small"
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={editingRule.enabled}
                                            onChange={(e) => setEditingRule({ ...editingRule, enabled: e.target.checked })}
                                        />
                                    }
                                    label="Enabled"
                                    sx={{ mb: 2 }}
                                />

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                                    Conditions
                                </Typography>
                                <FormControl size="small" sx={{ mb: 2, minWidth: 120 }}>
                                    <InputLabel>Logic</InputLabel>
                                    <Select
                                        value={editingRule.operator}
                                        onChange={(e) => setEditingRule({ ...editingRule, operator: e.target.value as 'AND' | 'OR' })}
                                        label="Logic"
                                    >
                                        <MenuItem value="AND">AND (all must match)</MenuItem>
                                        <MenuItem value="OR">OR (any must match)</MenuItem>
                                    </Select>
                                </FormControl>

                                {editingRule.conditions.map((condition, index) => (
                                    <Paper key={index} sx={{ p: 2, mb: 1, bgcolor: 'grey.50' }}>
                                        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Field</InputLabel>
                                                <Select
                                                    value={condition.fieldId}
                                                    onChange={(e) => updateCondition(index, { fieldId: e.target.value })}
                                                    label="Field"
                                                >
                                                    {elements.map((el) => (
                                                        <MenuItem key={el.id} value={el.id}>
                                                            {el.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            <FormControl fullWidth size="small">
                                                <InputLabel>Operator</InputLabel>
                                                <Select
                                                    value={condition.operator}
                                                    onChange={(e) => updateCondition(index, { operator: e.target.value as ConditionOperator })}
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
                                                value={condition.value}
                                                onChange={(e) => updateCondition(index, { value: e.target.value })}
                                            />
                                        </Box>
                                    </Paper>
                                ))}

                                <Button size="small" startIcon={<Plus size={14} />} onClick={addCondition} sx={{ mb: 2 }}>
                                    Add Condition
                                </Button>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                                    Actions
                                </Typography>

                                {editingRule.actions.map((action, index) => (
                                    <Paper key={index} sx={{ p: 2, mb: 1, bgcolor: 'grey.50' }}>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Action</InputLabel>
                                                <Select
                                                    value={action.type}
                                                    onChange={(e) => updateAction(index, { type: e.target.value as any })}
                                                    label="Action"
                                                >
                                                    <MenuItem value="show">Show Field</MenuItem>
                                                    <MenuItem value="hide">Hide Field</MenuItem>
                                                    <MenuItem value="enable">Enable Field</MenuItem>
                                                    <MenuItem value="disable">Disable Field</MenuItem>
                                                    <MenuItem value="require">Make Required</MenuItem>
                                                </Select>
                                            </FormControl>

                                            <FormControl fullWidth size="small">
                                                <InputLabel>Target Field</InputLabel>
                                                <Select
                                                    value={action.targetId}
                                                    onChange={(e) => updateAction(index, { targetId: e.target.value })}
                                                    label="Target Field"
                                                >
                                                    {elements.map((el) => (
                                                        <MenuItem key={el.id} value={el.id}>
                                                            {el.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Paper>
                                ))}

                                <Button size="small" startIcon={<Plus size={14} />} onClick={addAction} sx={{ mb: 2 }}>
                                    Add Action
                                </Button>

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                    {!isNewRule && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<Trash2 size={16} />}
                                            onClick={() => handleDeleteRule(editingRule.id)}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                    <Button variant="contained" startIcon={<Save size={16} />} onClick={handleSaveRule}>
                                        Save Rule
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    color: 'text.secondary',
                                }}
                            >
                                <Typography>Select a rule to edit or create a new one</Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};
