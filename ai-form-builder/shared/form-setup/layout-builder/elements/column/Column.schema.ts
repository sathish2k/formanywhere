/**
 * Column Layout Properties Schema
 * Validation for column gap and alignment settings
 */

import { z } from 'zod';

export const columnPropertiesSchema = z.object({
  columnGap: z.enum(['none', 'small', 'medium', 'large']),
  columnAlignment: z.enum(['top', 'center', 'bottom', 'stretch']),
});

export type ColumnPropertiesFormData = z.infer<typeof columnPropertiesSchema>;

export const columnPropertiesDefaults: ColumnPropertiesFormData = {
  columnGap: 'medium',
  columnAlignment: 'stretch',
};
