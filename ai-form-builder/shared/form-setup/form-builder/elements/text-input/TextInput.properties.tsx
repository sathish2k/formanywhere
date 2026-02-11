/**
 * Text Input Properties Panel
 */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { DroppedElement } from '../../form-builder.configuration';
import { type TextInputPropertiesFormData, textInputPropertiesSchema } from './TextInput.schema';

interface TextInputPropertiesProps {
  element: DroppedElement;
  onUpdate: (updates: Partial<DroppedElement>) => void;
}

export function TextInputProperties({ element, onUpdate }: TextInputPropertiesProps) {
  const {
    control,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm<TextInputPropertiesFormData>({
    resolver: zodResolver(textInputPropertiesSchema),
    defaultValues: {
      label: element.label || '',
      fieldName: element.fieldName || '',
      placeholder: element.placeholder || '',
      helperText: element.helperText || '',
      required: element.required || false,
      width: element.width || 'full',
      minLength: element.validation?.minLength,
      maxLength: element.validation?.maxLength,
      pattern: element.validation?.pattern,
    },
  });

  // Watch all form values and update parent on change
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
          minLength: values.minLength,
          maxLength: values.maxLength,
          pattern: values.pattern,
          rules: element.validation?.rules || [],
        },
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  // Reset form when element changes
  useEffect(() => {
    reset({
      label: element.label || '',
      fieldName: element.fieldName || '',
      placeholder: element.placeholder || '',
      helperText: element.helperText || '',
      required: element.required || false,
      width: element.width || 'full',
      minLength: element.validation?.minLength,
      maxLength: element.validation?.maxLength,
      pattern: element.validation?.pattern,
    });
  }, [element.id, reset]);

  return (
    <Stack spacing={3}>
      <Divider />

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Label
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Enter field label"
          error={!!errors.label}
          helperText={errors.label?.message}
          {...register('label')}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Field Name
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="field_name"
          error={!!errors.fieldName}
          helperText={errors.fieldName?.message || 'Unique identifier for this field'}
          {...register('fieldName')}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Placeholder
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Enter placeholder text"
          {...register('placeholder')}
        />
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
              <Select
                value={field.value ? 'true' : 'false'}
                onChange={(e) => field.onChange(e.target.value === 'true')}
              >
                <MenuItem value="false">No</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
              </Select>
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
              <Select {...field}>
                <MenuItem value="full">Full Width</MenuItem>
                <MenuItem value="half">Half Width</MenuItem>
                <MenuItem value="third">Third Width</MenuItem>
              </Select>
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
          Min Length
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="number"
          {...register('minLength', { valueAsNumber: true })}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Max Length
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="number"
          {...register('maxLength', { valueAsNumber: true })}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Pattern (Regex)
        </Typography>
        <TextField fullWidth size="small" placeholder="^[A-Za-z]+$" {...register('pattern')} />
      </Box>
    </Stack>
  );
}
