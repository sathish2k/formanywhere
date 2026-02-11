/**
 * Select Properties - Using common TextInput properties + options
 */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Select as MuiSelect,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Plus, X } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import type { DroppedElement } from '../../form-builder.configuration';

const selectPropertiesSchema = z.object({
  label: z.string().min(1),
  fieldName: z.string().min(1),
  placeholder: z.string().optional(),
  helperText: z.string().optional(),
  required: z.boolean(),
  width: z.enum(['full', 'half', 'third']),
});

type SelectPropertiesFormData = z.infer<typeof selectPropertiesSchema>;

interface SelectPropertiesProps {
  element: DroppedElement;
  onUpdate: (updates: Partial<DroppedElement>) => void;
}

export function SelectProperties({ element, onUpdate }: SelectPropertiesProps) {
  const { control, watch, reset, register } = useForm<SelectPropertiesFormData>({
    resolver: zodResolver(selectPropertiesSchema),
    defaultValues: {
      label: element.label || '',
      fieldName: element.fieldName || '',
      placeholder: element.placeholder || '',
      helperText: element.helperText || '',
      required: element.required || false,
      width: element.width || 'full',
    },
  });

  const options = element.options || [];

  useEffect(() => {
    const subscription = watch((values) => {
      onUpdate({
        label: values.label,
        fieldName: values.fieldName,
        placeholder: values.placeholder,
        helperText: values.helperText,
        required: values.required,
        width: values.width,
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
    });
  }, [element.id, reset]);

  const handleAddOption = () => {
    onUpdate({
      options: [
        ...options,
        { label: `Option ${options.length + 1}`, value: `option${options.length + 1}` },
      ],
    });
  };

  const handleRemoveOption = (index: number) => {
    onUpdate({
      options: options.filter((_, i) => i !== index),
    });
  };

  const handleUpdateOption = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...options];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ options: updated });
  };

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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Options
        </Typography>
        <Button size="small" startIcon={<Plus size={16} />} onClick={handleAddOption}>
          Add
        </Button>
      </Box>

      <Stack spacing={2}>
        {options.map((option, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="Label"
              value={option.label}
              onChange={(e) => handleUpdateOption(index, 'label', e.target.value)}
            />
            <TextField
              fullWidth
              size="small"
              label="Value"
              value={option.value}
              onChange={(e) => handleUpdateOption(index, 'value', e.target.value)}
            />
            <IconButton size="small" onClick={() => handleRemoveOption(index)}>
              <X size={16} />
            </IconButton>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
