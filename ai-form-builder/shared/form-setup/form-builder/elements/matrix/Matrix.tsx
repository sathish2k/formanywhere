/**
 * Matrix Component
 * Renders matrix/grid question on canvas
 */

'use client';

import {
  Box,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { DroppedElement } from '../../form-builder.configuration';

interface MatrixProps {
  element: DroppedElement;
  isSelected?: boolean;
  onClick?: () => void;
}

export function Matrix({ element, isSelected, onClick }: MatrixProps) {
  // Matrix always uses array of rows/columns, not number
  const rows = Array.isArray(element.rows) ? element.rows : [{ id: 'row1', label: 'Row 1' }];
  const columns = element.columns || [{ id: 'col1', label: 'Column 1' }];

  return (
    <ElementWrapper onClick={onClick} isSelected={isSelected}>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {element.required ? `${element.label} *` : element.label}
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            {columns.map((col) => (
              <TableCell key={col.id} align="center">
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.label}</TableCell>
              {columns.map((col) => (
                <TableCell key={col.id} align="center">
                  <Radio disabled size="small" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {element.helperText && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          {element.helperText}
        </Typography>
      )}
    </ElementWrapper>
  );
}

const ElementWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  position: 'relative',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  border: `2px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
  backgroundColor: isSelected ? theme.palette.action.hover : 'transparent',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    borderColor: theme.palette.primary.light,
    backgroundColor: theme.palette.action.hover,
  },
}));
