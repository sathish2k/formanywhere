/**
 * Layout Builder Configuration
 * Zod validation schema and form defaults
 */

import { z } from 'zod';

// Layout settings form schema
export const layoutSettingsSchema = z.object({
  layoutName: z.string().min(1, 'Layout name is required'),
  layoutDescription: z.string().optional(),
  stepperPosition: z.enum(['top', 'left', 'none']),
  stepperStyle: z.enum(['dots', 'numbers', 'progress', 'arrows']),
});

export type LayoutSettingsFormData = z.infer<typeof layoutSettingsSchema>;

export const layoutSettingsDefaults: LayoutSettingsFormData = {
  layoutName: 'Default Layout',
  layoutDescription: '',
  stepperPosition: 'none',
  stepperStyle: 'numbers',
};

// Element Property Schemas
export const baseElementSchema = z.object({
  id: z.string(),
  type: z.string(),
});

export const headingSchema = baseElementSchema.extend({
  label: z.string().min(1, 'Label is required'),
  position: z.enum(['left', 'center', 'right']),
});

export const buttonSchema = baseElementSchema.extend({
  label: z.string().min(1, 'Label is required'),
  variant: z.enum(['contained', 'outlined', 'text']),
  showLabel: z.boolean().optional(),
  position: z.enum(['left', 'center', 'right']),
});

export const stepperElementSchema = baseElementSchema.extend({
  stepperVariant: z.enum(['dots', 'numbers', 'progress', 'text']),
  orientation: z.enum(['horizontal', 'vertical']),
  alternativeLabel: z.boolean().optional(),
  nonLinear: z.boolean().optional(),
});

export type HeadingFormData = z.infer<typeof headingSchema>;
export type ButtonFormData = z.infer<typeof buttonSchema>;
export type StepperFormData = z.infer<typeof stepperElementSchema>;
