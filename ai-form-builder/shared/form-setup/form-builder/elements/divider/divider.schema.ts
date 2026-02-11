import { Minus } from 'lucide-react';
import type { ElementDefinition } from '../../form-builder.configuration';

export const DividerSchema: ElementDefinition = {
  type: 'divider',
  label: 'Divider',
  icon: Minus,
  category: 'Decorators',
  color: '#757575',
  description: 'Horizontal divider',
};

export const DividerDefaults = {
  label: 'Divider',
};
