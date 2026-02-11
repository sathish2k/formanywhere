import { Circle } from 'lucide-react';
import type { ElementDefinition } from '../../form-builder.configuration';

export const RadioSchema: ElementDefinition = {
  type: 'radio',
  label: 'Radio Group',
  icon: Circle,
  category: 'Input Fields',
  color: '#E91E63',
  description: 'Radio button group',
};

export const RadioDefaults = {
  label: 'Radio Group',
  width: 'full' as const,
  required: false,
  options: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ],
};
