import { Hash } from 'lucide-react';
import type { ElementDefinition } from '../../form-builder.configuration';

export const NumberInputSchema: ElementDefinition = {
  type: 'number-input',
  label: 'Number',
  icon: Hash,
  category: 'Input Fields',
  color: '#9C27B0',
  description: 'Numeric input field',
};

export const NumberInputDefaults = {
  label: 'Number',
  placeholder: 'Enter number...',
  width: 'full' as const,
  required: false,
};
