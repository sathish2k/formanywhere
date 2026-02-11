/**
 * Column Element Properties Panel
 * Configure gap spacing and vertical alignment
 */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Divider, FormControl, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { ElementPropertiesProps } from '../element.types';
import { type ColumnPropertiesFormData, columnPropertiesSchema } from './Column.schema';

export function ColumnProperties({ element, onUpdate }: ElementPropertiesProps) {
  const { control, watch, reset } = useForm<ColumnPropertiesFormData>({
    resolver: zodResolver(columnPropertiesSchema),
    defaultValues: {
      columnGap: element.columnGap || 'medium',
      columnAlignment: element.columnAlignment || 'stretch',
    },
  });

  // Watch all form values and update parent on change
  useEffect(() => {
    const subscription = watch((values) => {
      onUpdate({
        columnGap: values.columnGap,
        columnAlignment: values.columnAlignment,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  // Reset form when element changes
  useEffect(() => {
    reset({
      columnGap: element.columnGap || 'medium',
      columnAlignment: element.columnAlignment || 'stretch',
    });
  }, [element.id, reset]);

  return (
    <Stack spacing={3}>
      <Divider />

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Column Gap
        </Typography>
        <Controller
          name="columnGap"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select {...field}>
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="small">Small (8px)</MenuItem>
                <MenuItem value="medium">Medium (16px)</MenuItem>
                <MenuItem value="large">Large (24px)</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Spacing between columns
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Vertical Alignment
        </Typography>
        <Controller
          name="columnAlignment"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select {...field}>
                <MenuItem value="top">Top</MenuItem>
                <MenuItem value="center">Center</MenuItem>
                <MenuItem value="bottom">Bottom</MenuItem>
                <MenuItem value="stretch">Stretch (Fill)</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          How content aligns vertically in columns
        </Typography>
      </Box>
    </Stack>
  );
}
