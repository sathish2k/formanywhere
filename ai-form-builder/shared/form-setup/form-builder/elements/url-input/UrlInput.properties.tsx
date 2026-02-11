/**
 * URL Input Properties
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
import type { DroppedElement } from '../../form-builder.configuration';
import { type UrlInputPropertiesFormData, urlInputPropertiesSchema } from './url-input.schema';

interface UrlInputPropertiesProps {
  element: DroppedElement;
  onUpdate: (updates: Partial<DroppedElement>) => void;
}

export function UrlInputProperties({ element, onUpdate }: UrlInputPropertiesProps) {
  const { control, watch, reset, register } = useForm<UrlInputPropertiesFormData>({
    resolver: zodResolver(urlInputPropertiesSchema),
    defaultValues: {
      label: element.label || '',
      fieldName: element.fieldName || '',
      placeholder: element.placeholder || '',
      helperText: element.helperText || '',
      required: element.required || false,
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
          Helper Text
        </Typography>
        <TextField fullWidth size="small" {...register('helperText')} multiline rows={2} />
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
    </Stack>
  );
}
