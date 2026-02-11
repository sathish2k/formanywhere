/**
 * Text Input Properties Schema
 */

import { z } from 'zod';

export const textInputPropertiesSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  fieldName: z.string().min(1, 'Field name is required'),
  placeholder: z.string().optional(),
  helperText: z.string().optional(),
  required: z.boolean(),
  width: z.enum(['full', 'half', 'third']),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
});

export type TextInputPropertiesFormData = z.infer<typeof textInputPropertiesSchema>;
