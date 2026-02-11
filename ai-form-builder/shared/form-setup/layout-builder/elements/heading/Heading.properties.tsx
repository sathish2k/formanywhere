/**
 * Heading Element Properties Panel
 * Comprehensive typography customization with MUI properties
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
import { type HeadingPropertiesFormData, headingPropertiesSchema } from './Heading.schema';

export function HeadingProperties({ element, onUpdate }: ElementPropertiesProps) {
  const {
    control,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm<HeadingPropertiesFormData>({
    resolver: zodResolver(headingPropertiesSchema),
    defaultValues: {
      label: element.label || '',
      typographyVariant: element.typographyVariant || 'h4',
      align: element.align || 'center',
      color: element.color || 'textPrimary',
      gutterBottom: element.gutterBottom !== false,
      noWrap: element.noWrap || false,
    },
  });

  // Watch all form values and update parent on change
  useEffect(() => {
    const subscription = watch((values) => {
      onUpdate({
        label: values.label,
        typographyVariant: values.typographyVariant,
        align: values.align,
        color: values.color,
        gutterBottom: values.gutterBottom,
        noWrap: values.noWrap,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  // Reset form when element changes
  useEffect(() => {
    reset({
      label: element.label || '',
      typographyVariant: element.typographyVariant || 'h4',
      align: element.align || 'center',
      color: element.color || 'textPrimary',
      gutterBottom: element.gutterBottom !== false,
      noWrap: element.noWrap || false,
    });
  }, [element.id, reset]);

  return (
    <Stack spacing={3}>
      <Divider />

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Text
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Enter heading text"
          error={!!errors.label}
          helperText={errors.label?.message}
          {...register('label')}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Typography Variant
        </Typography>
        <Controller
          name="typographyVariant"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select {...field}>
                <MenuItem value="h1">Heading 1 (Largest)</MenuItem>
                <MenuItem value="h2">Heading 2</MenuItem>
                <MenuItem value="h3">Heading 3</MenuItem>
                <MenuItem value="h4">Heading 4</MenuItem>
                <MenuItem value="h5">Heading 5</MenuItem>
                <MenuItem value="h6">Heading 6 (Smallest)</MenuItem>
                <MenuItem value="subtitle1">Subtitle 1</MenuItem>
                <MenuItem value="subtitle2">Subtitle 2</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Text Alignment
        </Typography>
        <Controller
          name="align"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select {...field}>
                <MenuItem value="left">Left</MenuItem>
                <MenuItem value="center">Center</MenuItem>
                <MenuItem value="right">Right</MenuItem>
                <MenuItem value="justify">Justify</MenuItem>
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
                <MenuItem value="textPrimary">Text Primary</MenuItem>
                <MenuItem value="textSecondary">Text Secondary</MenuItem>
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
          Gutter Bottom
        </Typography>
        <Controller
          name="gutterBottom"
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
          Add margin below heading
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          No Wrap
        </Typography>
        <Controller
          name="noWrap"
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
          Prevent text from wrapping to next line
        </Typography>
      </Box>
    </Stack>
  );
}
