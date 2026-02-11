/**
 * Stepper Element Properties Panel
 * Includes step configuration with page ID mapping
 */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/material';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import type { ElementPropertiesProps } from '../element.types';
import {
  type StepConfig,
  type StepperPropertiesFormData,
  stepperPropertiesSchema,
} from './Stepper.schema';

export function StepperProperties({ element, onUpdate, pages = [] }: ElementPropertiesProps) {
  const { control, watch, reset } = useForm<StepperPropertiesFormData>({
    resolver: zodResolver(stepperPropertiesSchema),
    defaultValues: {
      orientation: element.orientation || 'horizontal',
      stepperVariant: element.stepperVariant || 'numbers',
      alternativeLabel: element.alternativeLabel || false,
      nonLinear: element.nonLinear || false,
      connector: element.connector !== false,
      activeStep: element.activeStep || 0,
      steps: element.steps || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'steps',
  });

  // Watch all form values and update parent on change
  useEffect(() => {
    const subscription = watch((values) => {
      onUpdate({
        orientation: values.orientation,
        stepperVariant: values.stepperVariant,
        alternativeLabel: values.alternativeLabel,
        nonLinear: values.nonLinear,
        connector: values.connector,
        activeStep: values.activeStep,
        steps: values.steps as StepConfig[] | undefined,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  // Reset form when element changes
  useEffect(() => {
    reset({
      orientation: element.orientation || 'horizontal',
      stepperVariant: element.stepperVariant || 'numbers',
      alternativeLabel: element.alternativeLabel || false,
      nonLinear: element.nonLinear || false,
      connector: element.connector !== false,
      activeStep: element.activeStep || 0,
      steps: element.steps || [],
    });
  }, [element.id, reset]);

  const handleAddStep = () => {
    append({
      label: `Step ${fields.length + 1}`,
      pageId: pages[fields.length]?.id || undefined,
      optional: false,
      completed: false,
      error: false,
    });
  };

  return (
    <Stack spacing={3}>
      <Divider />

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Orientation
        </Typography>
        <Controller
          name="orientation"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select {...field}>
                <MenuItem value="horizontal">Horizontal</MenuItem>
                <MenuItem value="vertical">Vertical</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Style
        </Typography>
        <Controller
          name="stepperVariant"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select {...field}>
                <MenuItem value="dots">Dots</MenuItem>
                <MenuItem value="numbers">Numbers</MenuItem>
                <MenuItem value="progress">Progress Bar</MenuItem>
                <MenuItem value="text">Text Labels</MenuItem>
              </Select>
            </FormControl>
          )}
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Connector
        </Typography>
        <Controller
          name="connector"
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
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Show lines connecting steps
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Alternative Label
        </Typography>
        <Controller
          name="alternativeLabel"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select
                value={field.value ? 'true' : 'false'}
                onChange={(e) => field.onChange(e.target.value === 'true')}
              >
                <MenuItem value="false">Disabled</MenuItem>
                <MenuItem value="true">Enabled</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Show labels below step icons
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, fontSize: '0.875rem' }}>
          Non-linear
        </Typography>
        <Controller
          name="nonLinear"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth size="small">
              <Select
                value={field.value ? 'true' : 'false'}
                onChange={(e) => field.onChange(e.target.value === 'true')}
              >
                <MenuItem value="false">Disabled</MenuItem>
                <MenuItem value="true">Enabled</MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Allow users to navigate to any step
        </Typography>
      </Box>

      <Divider />

      {/* Step Configuration Section */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
            Step Configuration
          </Typography>
          <Button
            size="small"
            startIcon={<Plus size={14} />}
            onClick={handleAddStep}
            variant="outlined"
            sx={{ fontSize: '0.75rem' }}
          >
            Add Step
          </Button>
        </Box>

        {fields.length === 0 ? (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', py: 2 }}
          >
            No steps configured. Add steps to map pages.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {fields.map((field, index) => (
              <Box
                key={field.id}
                sx={{
                  p: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <GripVertical size={16} style={{ color: '#999' }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, flex: 1 }}>
                    Step {index + 1}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => remove(index)}
                    sx={{ color: 'error.main' }}
                  >
                    <Trash2 size={14} />
                  </IconButton>
                </Box>

                <Stack spacing={1.5}>
                  <Controller
                    name={`steps.${index}.label`}
                    control={control}
                    render={({ field: labelField }) => (
                      <TextField
                        {...labelField}
                        size="small"
                        label="Step Label"
                        fullWidth
                        placeholder="Enter step label"
                      />
                    )}
                  />

                  <Controller
                    name={`steps.${index}.pageId`}
                    control={control}
                    render={({ field: pageField }) => (
                      <FormControl fullWidth size="small">
                        <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 500 }}>
                          Linked Page
                        </Typography>
                        <Select {...pageField} value={pageField.value || ''} displayEmpty>
                          <MenuItem value="">
                            <em>No page linked</em>
                          </MenuItem>
                          {pages.map((page) => (
                            <MenuItem key={page.id} value={page.id}>
                              {page.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Controller
                      name={`steps.${index}.optional`}
                      control={control}
                      render={({ field: optField }) => (
                        <FormControl size="small" sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 500 }}>
                            Optional
                          </Typography>
                          <Select
                            value={optField.value ? 'true' : 'false'}
                            onChange={(e) => optField.onChange(e.target.value === 'true')}
                          >
                            <MenuItem value="false">No</MenuItem>
                            <MenuItem value="true">Yes</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
