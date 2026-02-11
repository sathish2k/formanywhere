/**
 * Multi-Select Properties Panel
 */

'use client';

import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';
import type { DroppedElement } from '../../form-builder.configuration';

interface MultiSelectPropertiesProps {
  element: DroppedElement;
  onUpdate: (updates: Partial<DroppedElement>) => void;
}

export function MultiSelectProperties({ element, onUpdate }: MultiSelectPropertiesProps) {
  const options = element.options || [{ value: '', label: '' }];

  const addOption = () => {
    const newOptions = [...options, { value: '', label: '' }];
    onUpdate({ options: newOptions });
  };

  const updateOption = (index: number, field: 'value' | 'label', value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        Multi-Select Settings
      </Typography>

      <TextField
        fullWidth
        label="Label"
        value={element.label || ''}
        onChange={(e) => onUpdate({ label: e.target.value })}
        size="small"
      />

      <Box>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Options
        </Typography>
        {options.map((option, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField
              size="small"
              label="Label"
              value={option.label}
              onChange={(e) => updateOption(index, 'label', e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              size="small"
              label="Value"
              value={option.value}
              onChange={(e) => updateOption(index, 'value', e.target.value)}
              sx={{ flex: 1 }}
            />
            <IconButton
              size="small"
              onClick={() => removeOption(index)}
              disabled={options.length === 1}
            >
              <Trash2 size={18} />
            </IconButton>
          </Box>
        ))}
        <Button size="small" startIcon={<Plus size={16} />} onClick={addOption}>
          Add Option
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Helper Text"
        value={element.helperText || ''}
        onChange={(e) => onUpdate({ helperText: e.target.value })}
        size="small"
        multiline
        rows={2}
      />

      <TextField
        fullWidth
        label="Field Name"
        value={element.fieldName || ''}
        onChange={(e) => onUpdate({ fieldName: e.target.value })}
        size="small"
        helperText="Used for data submission"
      />

      <FormControlLabel
        control={
          <Switch
            checked={element.required || false}
            onChange={(e) => onUpdate({ required: e.target.checked })}
          />
        }
        label="Required"
      />
    </Box>
  );
}
