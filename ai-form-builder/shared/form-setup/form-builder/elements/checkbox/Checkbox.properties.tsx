/**
 * Checkbox Properties
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

const checkboxPropertiesSchema = z.object({
  label: z.string().min(1),
  fieldName: z.string().min(1),
  helperText: z.string().optional(),
  required: z.boolean(),
  defaultValue: z.boolean(),
});

type CheckboxPropertiesFormData = z.infer<typeof checkboxPropertiesSchema>;

interface CheckboxPropertiesProps {
  element: DroppedElement;
  onUpdate: (updates: Partial<DroppedElement>) => void;
}

export function CheckboxProperties({ element, onUpdate }: CheckboxPropertiesProps) {
  const { control, watch, reset, register } = useForm<CheckboxPropertiesFormData>({
    resolver: zodResolver(checkboxPropertiesSchema),
    defaultValues: {
      label: element.label || '',
      fieldName: element.fieldName || '',
      helperText: element.helperText || '',
      required: element.required || false,
      defaultValue: typeof element.defaultValue === 'boolean' ? element.defaultValue : false,
    },
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onUpdate({
        label: values.label,
        fieldName: values.fieldName,
        helperText: values.helperText,
        required: values.required,
        defaultValue: values.defaultValue,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  useEffect(() => {
    reset({
      label: element.label || '',
      fieldName: element.fieldName || '',
      helperText: element.helperText || '',
      required: element.required || false,
      defaultValue: typeof element.defaultValue === 'boolean' ? element.defaultValue : false,
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
          Helper Text
        </Typography>
        <TextField fullWidth size="small" multiline rows={2} {...register('helperText')} />
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
          Default Checked
        </Typography>
        <Controller
          name="defaultValue"
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
    </Stack>
  );
}
