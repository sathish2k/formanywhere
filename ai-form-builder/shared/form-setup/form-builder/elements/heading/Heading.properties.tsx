/**
 * Heading Properties
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

const headingPropertiesSchema = z.object({
  heading: z.string().min(1),
  size: z.enum(['small', 'medium', 'large']),
  align: z.enum(['left', 'center', 'right']),
});

type HeadingPropertiesFormData = z.infer<typeof headingPropertiesSchema>;

interface HeadingPropertiesProps {
  element: DroppedElement;
  onUpdate: (updates: Partial<DroppedElement>) => void;
}

export function HeadingProperties({ element, onUpdate }: HeadingPropertiesProps) {
  const { control, watch, reset, register } = useForm<HeadingPropertiesFormData>({
    resolver: zodResolver(headingPropertiesSchema),
    defaultValues: {
      heading: element.heading || '',
      size: element.size || 'medium',
      align: element.align || 'left',
    },
  });

  useEffect(() => {
    const subscription = watch((values) => onUpdate(values as any));
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  useEffect(() => {
    reset({
      heading: element.heading || '',
      size: element.size || 'medium',
      align: element.align || 'left',
    });
  }, [element.id, reset]);

  return (
    <Stack spacing={3}>
      <Divider />
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Text
        </Typography>
        <TextField fullWidth size="small" {...register('heading')} />
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
              <MuiSelect {...field}>
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </MuiSelect>
            </FormControl>
          )}
        />
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Alignment
        </Typography>
        <Controller
          name="align"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <MuiSelect {...field}>
                <MenuItem value="left">Left</MenuItem>
                <MenuItem value="center">Center</MenuItem>
                <MenuItem value="right">Right</MenuItem>
              </MuiSelect>
            </FormControl>
          )}
        />
      </Box>
    </Stack>
  );
}
