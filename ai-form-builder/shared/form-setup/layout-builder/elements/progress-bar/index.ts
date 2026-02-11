/**
 * ProgressBar Element Definition and Exports
 */

import { Circle } from 'lucide-react';
import type { ElementDefinition } from '../element.types';

export { ProgressBar } from './ProgressBar';
export { ProgressBarProperties } from './ProgressBar.properties';

export const ProgressBarDef: ElementDefinition = {
  id: 'progressBar',
  type: 'progressBar',
  label: 'Progress Bar',
  icon: Circle,
  description: 'Linear progress',
  category: 'Navigation',
};
