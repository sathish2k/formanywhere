/**
 * Column Element Definitions and Exports
 */

import { Columns2, Columns3 } from 'lucide-react';
import type { ElementDefinition } from '../element.types';

export { TwoColumn, ThreeColumn } from './Column';
export { ColumnProperties } from './Column.properties';

export const TwoColumnDef: ElementDefinition = {
  id: 'twoColumn',
  type: 'twoColumn',
  label: 'Two Columns',
  icon: Columns2,
  description: 'Two-column layout',
  category: 'Content',
};

export const ThreeColumnDef: ElementDefinition = {
  id: 'threeColumn',
  type: 'threeColumn',
  label: 'Three Columns',
  icon: Columns3,
  description: 'Three-column layout',
  category: 'Content',
};
