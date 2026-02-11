/**
 * Breadcrumb Element Definition and Exports
 */

import { ChevronRight } from 'lucide-react';
import type { ElementDefinition } from '../element.types';

export { Breadcrumb } from './Breadcrumb';
export { BreadcrumbProperties } from './Breadcrumb.properties';

export const BreadcrumbDef: ElementDefinition = {
  id: 'breadcrumb',
  type: 'breadcrumb',
  label: 'Breadcrumb',
  icon: ChevronRight,
  description: 'Page breadcrumb',
  category: 'Navigation',
};
