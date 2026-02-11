import { Heading1 } from 'lucide-react';
import type { ElementDefinition } from '../../form-builder.configuration';

export const HeadingSchema: ElementDefinition = {
  type: 'heading',
  label: 'Heading',
  icon: Heading1,
  category: 'Decorators',
  color: '#673AB7',
  description: 'Heading text',
};

export const HeadingDefaults = {
  label: 'Heading',
  heading: 'Heading Text',
  size: 'medium' as const,
  align: 'left' as const,
};
