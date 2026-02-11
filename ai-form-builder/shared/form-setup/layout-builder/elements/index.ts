/**
 * Elements Barrel Export
 * Exports all element definitions, renders, and properties from subfolders
 */

// Types
export * from './element.types';

// Heading
export { Heading, HeadingProperties, HeadingDef } from './heading';

// Stepper
export { Stepper, StepperProperties, StepperDef } from './stepper';

// Button
export { NextButton, BackButton, ButtonProperties, NextButtonDef, BackButtonDef } from './button';

// Arrow
export { NextArrow, BackArrow, ArrowProperties, NextArrowDef, BackArrowDef } from './arrow';

// ProgressBar
export { ProgressBar, ProgressBarProperties, ProgressBarDef } from './progress-bar';

// Breadcrumb
export { Breadcrumb, BreadcrumbProperties, BreadcrumbDef } from './breadcrumb';

// PageIndicator
export { PageIndicator, PageIndicatorProperties, PageIndicatorDef } from './page-indicator';

// Column
export { TwoColumn, ThreeColumn, ColumnProperties, TwoColumnDef, ThreeColumnDef } from './column';

import { BackArrowDef, NextArrowDef } from './arrow';
import { BreadcrumbDef } from './breadcrumb';
import { BackButtonDef, NextButtonDef } from './button';
import { ThreeColumnDef, TwoColumnDef } from './column';
import type { ElementCategory, ElementDefinition } from './element.types';
// Collected element definitions for palette
import { HeadingDef } from './heading';
import { PageIndicatorDef } from './page-indicator';
import { ProgressBarDef } from './progress-bar';
import { StepperDef } from './stepper';

// All element definitions for the palette
export const LAYOUT_ELEMENTS: ElementDefinition[] = [
  // Navigation
  StepperDef,
  ProgressBarDef,
  BreadcrumbDef,
  PageIndicatorDef,
  // Content
  HeadingDef,
  TwoColumnDef,
  ThreeColumnDef,
  // Actions
  NextButtonDef,
  BackButtonDef,
  NextArrowDef,
  BackArrowDef,
];

// Element categories
export const ELEMENT_CATEGORIES: ElementCategory[] = ['Navigation', 'Content', 'Actions'];

// Get elements by category
export function getElementsByCategory(category: ElementCategory): ElementDefinition[] {
  return LAYOUT_ELEMENTS.filter((el) => el.category === category);
}
