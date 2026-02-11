/**
 * Button Element Definitions and Exports
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ElementDefinition } from '../element.types';

export { NextButton, BackButton } from './Button';
export { ButtonProperties } from './Button.properties';

export const NextButtonDef: ElementDefinition = {
  id: 'nextButton',
  type: 'nextButton',
  label: 'Next Button',
  icon: ChevronRight,
  description: 'Next page button',
  category: 'Actions',
};

export const BackButtonDef: ElementDefinition = {
  id: 'backButton',
  type: 'backButton',
  label: 'Back Button',
  icon: ChevronLeft,
  description: 'Previous page button',
  category: 'Actions',
};
