import { Square } from 'lucide-react';
import type { ElementDefinition } from '../../form-builder.configuration';

export const SectionSchema: ElementDefinition = {
  type: 'section',
  label: 'Section',
  icon: Square,
  category: 'Layout',
  color: '#607D8B',
  description: 'Container with title',
};

export const SectionDefaults = {
  label: 'Section',
  heading: 'Section Title',
  children: [],
};
