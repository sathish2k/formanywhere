/**
 * Text Input Element
 * Schema definition and component for text input field
 */

import { Type } from 'lucide-react';
import type { ElementDefinition } from '../../form-builder.configuration';

export const TextInputSchema: ElementDefinition = {
  type: 'text-input',
  label: 'Text Input',
  icon: Type,
  category: 'Input Fields',
  color: '#2196F3',
  description: 'Single line text input',
};

export const TextInputDefaults = {
  label: 'Text Input',
  placeholder: 'Enter text...',
  width: 'full' as const,
  required: false,
  validation: {
    rules: [],
  },
};
