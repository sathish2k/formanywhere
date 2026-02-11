import { Calendar } from 'lucide-react';
import type { ElementDefinition } from '../../form-builder.configuration';

export const DatePickerSchema: ElementDefinition = {
  type: 'date-picker',
  label: 'Date Picker',
  icon: Calendar,
  category: 'Input Fields',
  color: '#FF5722',
  description: 'Date selection field',
};

export const DatePickerDefaults = {
  label: 'Date',
  placeholder: 'Select date...',
  width: 'full' as const,
  required: false,
};
