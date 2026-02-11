/**
 * Textarea Properties
 */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Divider,
  FormControl,
  MenuItem,
  Select as MuiSelect,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import type { DroppedElement } from '../../form-builder.configuration';

const textareaPropertiesSchema = z.object({
  label: z.string().min(1),
  fieldName: z.string().min(1),
  placeholder: z.string().optional(),
  helperText: z.string().optional(),
  required: z.boolean(),
  width: z.enum(['full', 'half', 'third']),
  rows: z.number().min(2).max(10),
});

type TextareaPropertiesFormData = z.infer<typeof textareaPropertiesSchema>;

interface TextareaPropertiesProps {
  element: DroppedElement;
  onUpdate: (updates: Partial<DroppedElement>) => void;
}

export function TextareaProperties({ element, onUpdate }: TextareaPropertiesProps) {
  const { control, watch, reset, register } = useForm<TextareaPropertiesFormData>({
    resolver: zodResolver(textareaPropertiesSchema),
    defaultValues: {
      label: element.label || '',
      fieldName: element.fieldName || '',
      placeholder: element.placeholder || '',
      helperText: element.helperText || '',
      required: element.required || false,
      width: element.width || 'full',
      // Textarea uses number for rows, not array
      rows: typeof element.rows === 'number' ? element.rows : 4,
    },
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onUpdate({
        label: values.label,
        fieldName: values.fieldName,
        placeholder: values.placeholder,
        helperText: values.helperText,
        required: values.required,
        width: values.width,
        rows: values.rows,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  useEffect(() => {
    reset({
      label: element.label || '',
      fieldName: element.fieldName || '',
      placeholder: element.placeholder || '',
      helperText: element.helperText || '',
      required: element.required || false,
      width: element.width || 'full',
      // Textarea uses number for rows, not array
      rows: typeof element.rows === 'number' ? element.rows : 4,
    });
  }, [element.id, reset]);

  return (
    <Stack spacing={3}>
      <Divider />
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Label
        </Typography>
        <TextField fullWidth size="small" {...register('label')} />
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Field Name
        </Typography>
        <TextField fullWidth size="small" {...register('fieldName')} />
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Placeholder
        </Typography>
        <TextField fullWidth size="small" {...register('placeholder')} />
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Required
        </Typography>
        <Controller
          name="required"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <MuiSelect
                value={field.value ? 'true' : 'false'}
                onChange={(e) => field.onChange(e.target.value === 'true')}
              >
                <MenuItem value="false">No</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
              </MuiSelect>
            </FormControl>
          )}
        />
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Rows
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="number"
          {...register('rows', { valueAsNumber: true })}
        />
      </Box>
    </Stack>
  );
}
