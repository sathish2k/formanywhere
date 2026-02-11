/**
 * Heading Element Definition and Exports
 */

import { Heading as HeadingIcon } from 'lucide-react';
import type { ElementDefinition } from '../element.types';

export { Heading } from './Heading';
export { HeadingProperties } from './Heading.properties';

export const HeadingDef: ElementDefinition = {
  id: 'heading',
  type: 'heading',
  label: 'Heading',
  icon: HeadingIcon,
  description: 'Page title/heading',
  category: 'Content',
};
