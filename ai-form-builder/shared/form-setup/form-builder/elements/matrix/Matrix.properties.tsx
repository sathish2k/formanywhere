/**
 * Matrix Properties Panel
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

interface MatrixPropertiesProps {
  element: DroppedElement;
  onUpdate: (updates: Partial<DroppedElement>) => void;
}

export function MatrixProperties({ element, onUpdate }: MatrixPropertiesProps) {
  // Matrix always uses array of rows, not number
  const rows = Array.isArray(element.rows) ? element.rows : [{ id: 'row1', label: 'Row 1' }];
  const columns = element.columns || [{ id: 'col1', label: 'Column 1' }];

  const addRow = () => {
    const newRows = [...rows, { id: `row${rows.length + 1}`, label: `Row ${rows.length + 1}` }];
    onUpdate({ rows: newRows });
  };

  const updateRow = (index: number, label: string) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], label };
    onUpdate({ rows: newRows });
  };

  const removeRow = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index);
    onUpdate({ rows: newRows });
  };

  const addColumn = () => {
    const newColumns = [
      ...columns,
      { id: `col${columns.length + 1}`, label: `Column ${columns.length + 1}` },
    ];
    onUpdate({ columns: newColumns });
  };

  const updateColumn = (index: number, label: string) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], label };
    onUpdate({ columns: newColumns });
  };

  const removeColumn = (index: number) => {
    const newColumns = columns.filter((_, i) => i !== index);
    onUpdate({ columns: newColumns });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        Matrix/Grid Settings
      </Typography>

      <TextField
        fullWidth
        label="Question Label"
        value={element.label || ''}
        onChange={(e) => onUpdate({ label: e.target.value })}
        size="small"
      />

      <Box>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Rows (Questions)
        </Typography>
        {rows.map((row, index) => (
          <Box key={row.id} sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField
              size="small"
              label={`Row ${index + 1}`}
              value={row.label}
              onChange={(e) => updateRow(index, e.target.value)}
              sx={{ flex: 1 }}
            />
            <IconButton size="small" onClick={() => removeRow(index)} disabled={rows.length === 1}>
              <Trash2 size={18} />
            </IconButton>
          </Box>
        ))}
        <Button size="small" startIcon={<Plus size={16} />} onClick={addRow}>
          Add Row
        </Button>
      </Box>

      <Box>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Columns (Options)
        </Typography>
        {columns.map((col, index) => (
          <Box key={col.id} sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField
              size="small"
              label={`Column ${index + 1}`}
              value={col.label}
              onChange={(e) => updateColumn(index, e.target.value)}
              sx={{ flex: 1 }}
            />
            <IconButton
              size="small"
              onClick={() => removeColumn(index)}
              disabled={columns.length === 1}
            >
              <Trash2 size={18} />
            </IconButton>
          </Box>
        ))}
        <Button size="small" startIcon={<Plus size={16} />} onClick={addColumn}>
          Add Column
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
