/**
 * Stepper Element Definition and Exports
 */

import { LayoutGrid } from 'lucide-react';
import type { ElementDefinition } from '../element.types';

export { Stepper } from './Stepper';
export { StepperProperties } from './Stepper.properties';

export const StepperDef: ElementDefinition = {
  id: 'stepper',
  type: 'stepper',
  label: 'Step Indicator',
  icon: LayoutGrid,
  description: 'Visual step progress',
  category: 'Navigation',
};
