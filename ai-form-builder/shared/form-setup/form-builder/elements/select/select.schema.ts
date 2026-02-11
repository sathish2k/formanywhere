/**
 * Select Element
 * Schema definition and component for select dropdown
 */

import { ChevronDown } from 'lucide-react';
import type { ElementDefinition } from '../../form-builder.configuration';

export const SelectSchema: ElementDefinition = {
  type: 'select',
  label: 'Select',
  icon: ChevronDown,
  category: 'Input Fields',
  color: '#4CAF50',
  description: 'Dropdown selection',
};

export const SelectDefaults = {
  label: 'Select',
  placeholder: 'Choose option...',
  width: 'full' as const,
  required: false,
  options: [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ],
};
