/**
 * Slider Properties
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
import { type SliderPropertiesFormData, sliderPropertiesSchema } from './slider.schema';

interface SliderPropertiesProps {
  element: DroppedElement;
  onUpdate: (updates: Partial<DroppedElement>) => void;
}

export function SliderProperties({ element, onUpdate }: SliderPropertiesProps) {
  const {
    control,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm<SliderPropertiesFormData>({
    resolver: zodResolver(sliderPropertiesSchema),
    defaultValues: {
      label: element.label || '',
      fieldName: element.fieldName || '',
      helperText: element.helperText || '',
      required: element.required || false,
      min: element.min ?? 0,
      max: element.max ?? 10,
      step: element.step ?? 1,
      defaultValue: typeof element.defaultValue === 'number' ? element.defaultValue : undefined,
    },
  });

  useEffect(() => {
    const subscription = watch((values) => {
      onUpdate({
        label: values.label,
        fieldName: values.fieldName,
        helperText: values.helperText,
        required: values.required,
        min: values.min,
        max: values.max,
        step: values.step,
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
      min: element.min ?? 0,
      max: element.max ?? 10,
      step: element.step ?? 1,
      defaultValue: typeof element.defaultValue === 'number' ? element.defaultValue : undefined,
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
          Minimum Value
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="number"
          {...register('min', { valueAsNumber: true })}
          error={!!errors.min}
          helperText={errors.min?.message}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Maximum Value
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="number"
          {...register('max', { valueAsNumber: true })}
          error={!!errors.max}
          helperText={errors.max?.message}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Step
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="number"
          {...register('step', { valueAsNumber: true })}
          error={!!errors.step}
          helperText={errors.step?.message}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Default Value
        </Typography>
        <TextField
          fullWidth
          size="small"
          type="number"
          {...register('defaultValue', { valueAsNumber: true })}
          error={!!errors.defaultValue}
          helperText={errors.defaultValue?.message}
        />
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
