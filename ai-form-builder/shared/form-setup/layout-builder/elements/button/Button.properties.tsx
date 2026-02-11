/**
 * Button Element Properties Panel
 * Comprehensive button customization with MUI properties
 */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Divider,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { ElementPropertiesProps } from '../element.types';
import { type ButtonPropertiesFormData, buttonPropertiesSchema } from './Button.schema';

export function ButtonProperties({ element, onUpdate }: ElementPropertiesProps) {
  // Helper to filter out text colors (for headings only)
  const getButtonColor = (
    color?: string
  ): 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
    if (color === 'textPrimary' || color === 'textSecondary' || !color) {
      return 'primary';
    }
    return color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  };

  const {
    control,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm<ButtonPropertiesFormData>({
    resolver: zodResolver(buttonPropertiesSchema),
    defaultValues: {
      label: element.label || '',
      variant: element.variant || 'contained',
      size: element.size || 'medium',
      color: getButtonColor(element.color),
      position: element.position || 'center',
      disabled: element.disabled || false,
      fullWidth: element.fullWidth || false,
      showLabel: element.showLabel !== false,
    },
  });

  //Watch all form values and update parent on change
  useEffect(() => {
    const subscription = watch((values) => {
      onUpdate({
        label: values.label,
        variant: values.variant,
        size: values.size,
        color: values.color,
        position: values.position,
        disabled: values.disabled,
        fullWidth: values.fullWidth,
        showLabel: values.showLabel,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  // Reset form when element changes
  useEffect(() => {
    reset({
      label: element.label || '',
      variant: element.variant || 'contained',
      size: element.size || 'medium',
      color: getButtonColor(element.color),
      position: element.position || 'center',
      disabled: element.disabled || false,
      fullWidth: element.fullWidth || false,
      showLabel: element.showLabel !== false,
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
          placeholder="Enter button text"
          error={!!errors.label}
          helperText={errors.label?.message}
          {...register('label')}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Variant
        </Typography>
        <Controller
          name="variant"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select {...field}>
                <MenuItem value="contained">Contained</MenuItem>
                <MenuItem value="outlined">Outlined</MenuItem>
                <MenuItem value="text">Text</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Size
        </Typography>
        <Controller
          name="size"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select {...field}>
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Color
        </Typography>
        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select {...field}>
                <MenuItem value="primary">Primary</MenuItem>
                <MenuItem value="secondary">Secondary</MenuItem>
                <MenuItem value="error">Error</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="success">Success</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Position
        </Typography>
        <Controller
          name="position"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select {...field}>
                <MenuItem value="left">Left</MenuItem>
                <MenuItem value="center">Center</MenuItem>
                <MenuItem value="right">Right</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Disabled
        </Typography>
        <Controller
          name="disabled"
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
          Full Width
        </Typography>
        <Controller
          name="fullWidth"
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
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Make button span full container width
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Show Label
        </Typography>
        <Controller
          name="showLabel"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select
                value={field.value ? 'true' : 'false'}
                onChange={(e) => field.onChange(e.target.value === 'true')}
              >
                <MenuItem value="false">Hidden</MenuItem>
                <MenuItem value="true">Visible</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>
    </Stack>
  );
}
