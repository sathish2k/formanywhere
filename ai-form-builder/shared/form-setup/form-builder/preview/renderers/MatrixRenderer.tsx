/**
 * Matrix Renderer
 */

'use client';

import {
  Box,
  FormHelperText,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useFormContext } from 'react-hook-form';
import type { DroppedElement } from '../../form-builder.configuration';

interface MatrixRendererProps {
  element: DroppedElement;
}

export function MatrixRenderer({ element }: MatrixRendererProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const fieldName = element.fieldName || element.id;
  // Matrix always uses array of rows/columns, not number
  const rows = Array.isArray(element.rows) ? element.rows : [];
  const columns = element.columns || [];
  const error = errors[fieldName];

  return (
    <Box>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {element.label}
        {element.required && ' *'}
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
                  <Radio
                    {...register(`${fieldName}.${row.id}`, {
                      required: element.required
                        ? `Please select an option for ${row.label}`
                        : false,
                    })}
                    value={col.id}
                    size="small"
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {(error || element.helperText) && (
        <FormHelperText error={!!error}>
          {error ? String(error.message) : element.helperText}
        </FormHelperText>
      )}
    </Box>
  );
}
