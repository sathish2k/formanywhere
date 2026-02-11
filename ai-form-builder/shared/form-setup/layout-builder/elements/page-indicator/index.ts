/**
 * PageIndicator Element Definition and Exports
 */

import { Circle } from 'lucide-react';
import type { ElementDefinition } from '../element.types';

export { PageIndicator } from './PageIndicator';
export { PageIndicatorProperties } from './PageIndicator.properties';

export const PageIndicatorDef: ElementDefinition = {
  id: 'pageIndicator',
  type: 'pageIndicator',
  label: 'Page Counter',
  icon: Circle,
  description: 'Current page number',
  category: 'Navigation',
};
