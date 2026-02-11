/**
 * Phone Input Properties Schema
 */

import { z } from 'zod';

export const phoneInputPropertiesSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  fieldName: z.string().min(1, 'Field name is required'),
  placeholder: z.string().optional(),
  helperText: z.string().optional(),
  required: z.boolean(),
});

export type PhoneInputPropertiesFormData = z.infer<typeof phoneInputPropertiesSchema>;
