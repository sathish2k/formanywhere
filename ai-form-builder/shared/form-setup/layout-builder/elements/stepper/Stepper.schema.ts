/**
 * Stepper Element Properties Schema
 * Zod validation schema for stepper element properties
 */

import { z } from 'zod';

// Step configuration schema with page mapping
export const stepConfigSchema = z.object({
  label: z.string().min(1, 'Step label is required'),
  pageId: z.string().optional(),
  optional: z.boolean().optional(),
  completed: z.boolean().optional(),
  error: z.boolean().optional(),
});

export const stepperPropertiesSchema = z.object({
  orientation: z.enum(['horizontal', 'vertical']),
  stepperVariant: z.enum(['dots', 'numbers', 'progress', 'text']),
  alternativeLabel: z.boolean(),
  nonLinear: z.boolean(),
  connector: z.boolean(),
  activeStep: z.number().min(0).optional(),
  steps: z.array(stepConfigSchema).optional(),
});

export type StepConfig = z.infer<typeof stepConfigSchema>;
export type StepperPropertiesFormData = z.infer<typeof stepperPropertiesSchema>;

export const stepperPropertiesDefaults: Omit<StepperPropertiesFormData, 'activeStep' | 'steps'> = {
  orientation: 'horizontal',
  stepperVariant: 'numbers',
  alternativeLabel: false,
  nonLinear: false,
  connector: true,
};
