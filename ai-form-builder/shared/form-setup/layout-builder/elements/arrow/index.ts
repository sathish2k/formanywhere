/**
 * Arrow Element Definitions and Exports
 */

import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { ElementDefinition } from '../element.types';

export { NextArrow, BackArrow } from './Arrow';
export { ArrowProperties } from './Arrow.properties';

export const NextArrowDef: ElementDefinition = {
  id: 'nextArrow',
  type: 'nextArrow',
  label: 'Next Arrow',
  icon: ArrowRight,
  description: 'Icon-only next',
  category: 'Actions',
};

export const BackArrowDef: ElementDefinition = {
  id: 'backArrow',
  type: 'backArrow',
  label: 'Back Arrow',
  icon: ArrowLeft,
  description: 'Icon-only back',
  category: 'Actions',
};
