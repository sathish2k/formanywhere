import { CheckSquare } from 'lucide-react';
import type { ElementDefinition } from '../../form-builder.configuration';

export const CheckboxSchema: ElementDefinition = {
  type: 'checkbox',
  label: 'Checkbox',
  icon: CheckSquare,
  category: 'Input Fields',
  color: '#3F51B5',
  description: 'Checkbox input',
};

export const CheckboxDefaults = {
  label: 'Checkbox',
  width: 'full' as const,
  required: false,
  defaultValue: false,
};
