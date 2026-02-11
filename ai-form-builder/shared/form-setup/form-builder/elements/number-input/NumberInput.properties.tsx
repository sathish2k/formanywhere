/**
 * Number Input Properties
 * Similar to TextInput but with number-specific validation
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

const numberInputPropertiesSchema = z.object({
  label: z.string().min(1),
  fieldName: z.string().min(1),
  placeholder: z.string().optional(),
  helperText: z.string().optional(),
  required: z.boolean(),
  width: z.enum(['full', 'half', 'third']),
  min: z.number().optional(),
  max: z.number().optional(),
});

type NumberInputPropertiesFormData = z.infer<typeof numberInputPropertiesSchema>;

interface NumberInputPropertiesProps {
  element: DroppedElement;
  onUpdate: (updates: Partial<DroppedElement>) => void;
}

export function NumberInputProperties({ element, onUpdate }: NumberInputPropertiesProps) {
  const { control, watch, reset, register } = useForm<NumberInputPropertiesFormData>({
    resolver: zodResolver(numberInputPropertiesSchema),
    defaultValues: {
      label: element.label || '',
      fieldName: element.fieldName || '',
      placeholder: element.placeholder || '',
      helperText: element.helperText || '',
      required: element.required || false,
      width: element.width || 'full',
      min: element.validation?.min,
      max: element.validation?.max,
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
        validation: {
          ...element.validation,
          min: values.min,
          max: values.max,
          rules: element.validation?.rules || [],
        },
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
      min: element.validation?.min,
      max: element.validation?.max,
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
          Width
        </Typography>
        <Controller
          name="width"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <MuiSelect {...field}>
                <MenuItem value="full">Full Width</MenuItem>
                <MenuItem value="half">Half Width</MenuItem>
                <MenuItem value="third">Third Width</MenuItem>
              </MuiSelect>
            </FormControl>
          )}
        />
      </Box>
      <Divider />
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Validation
      </Typography>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Min Value
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="number"
          {...register('min', { valueAsNumber: true })}
        />
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Max Value
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="number"
          {...register('max', { valueAsNumber: true })}
        />
      </Box>
    </Stack>
  );
}
