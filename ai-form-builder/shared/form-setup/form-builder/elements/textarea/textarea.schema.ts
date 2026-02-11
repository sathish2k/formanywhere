import { AlignLeft } from 'lucide-react';
import type { ElementDefinition } from '../../form-builder.configuration';

export const TextareaSchema: ElementDefinition = {
  type: 'textarea',
  label: 'Text Area',
  icon: AlignLeft,
  category: 'Input Fields',
  color: '#00BCD4',
  description: 'Multi-line text input',
};

export const TextareaDefaults = {
  label: 'Text Area',
  placeholder: 'Enter text...',
  width: 'full' as const,
  rows: 4,
  required: false,
};
