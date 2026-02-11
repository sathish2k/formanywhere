/**
 * Button Element Properties Schema
 * Zod validation schema for button element properties
 */

import { z } from 'zod';

export const buttonPropertiesSchema = z.object({
  label: z.string().min(1, 'Button label is required'),
  variant: z.enum(['contained', 'outlined', 'text']),
  size: z.enum(['small', 'medium', 'large']),
  color: z.enum(['primary', 'secondary', 'error', 'warning', 'info', 'success']),
  position: z.enum(['left', 'center', 'right']),
  disabled: z.boolean(),
  fullWidth: z.boolean(),
  showLabel: z.boolean(),
});

export type ButtonPropertiesFormData = z.infer<typeof buttonPropertiesSchema>;

export const buttonPropertiesDefaults: ButtonPropertiesFormData = {
  label: '',
  variant: 'contained',
  size: 'medium',
  color: 'primary',
  position: 'center',
  disabled: false,
  fullWidth: false,
  showLabel: true,
};
