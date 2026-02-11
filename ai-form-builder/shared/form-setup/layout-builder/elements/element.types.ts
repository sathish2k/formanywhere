/**
 * Layout Element Types and Base Interface
 * Defines the structure for all layout elements
 */

import type { LucideIcon } from 'lucide-react';

// Element type union
export type LayoutElementType =
  | 'stepper'
  | 'heading'
  | 'nextButton'
  | 'backButton'
  | 'nextArrow'
  | 'backArrow'
  | 'progressBar'
  | 'pageIndicator'
  | 'breadcrumb'
  | 'twoColumn'
  | 'threeColumn';

// Element categories
export type ElementCategory = 'Navigation' | 'Content' | 'Actions';

// Base element interface for drag-and-drop palette
export interface ElementDefinition {
  id: LayoutElementType;
  type: LayoutElementType;
  label: string;
  icon: LucideIcon;
  description: string;
  category: ElementCategory;
}

// Stepper step with page mapping
export interface StepConfig {
  label: string;
  pageId?: string; // Maps step to form page ID
  optional?: boolean;
  completed?: boolean;
  error?: boolean;
}

// Layout element instance (dropped on canvas)
export interface LayoutElement {
  id: string;
  type: LayoutElementType;

  // Common properties
  label?: string;
  position?: 'left' | 'center' | 'right';
  disabled?: boolean;

  // Button properties
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  color?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success'
    | 'textPrimary'
    | 'textSecondary';
  fullWidth?: boolean;
  showLabel?: boolean;

  // Typography/Heading properties
  typographyVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2';
  align?: 'left' | 'center' | 'right' | 'justify';
  gutterBottom?: boolean;
  noWrap?: boolean;

  // Stepper-specific properties
  orientation?: 'horizontal' | 'vertical';
  alternativeLabel?: boolean;
  nonLinear?: boolean;
  stepperVariant?: 'dots' | 'numbers' | 'progress' | 'text';
  connector?: boolean;
  steps?: StepConfig[]; // Step configuration with page mapping
  activeStep?: number;

  // Progress Bar properties
  progressVariant?: 'determinate' | 'indeterminate' | 'buffer' | 'query';
  value?: number; // 0-100
  valueBuffer?: number;

  // Column layout properties
  columnGap?: 'none' | 'small' | 'medium' | 'large';
  columnAlignment?: 'top' | 'center' | 'bottom' | 'stretch';

  // Legacy/misc
  icon?: string;
  config?: Record<string, unknown>;

  // Column children
  children?: {
    column1?: LayoutElement[];
    column2?: LayoutElement[];
    column3?: LayoutElement[];
  };
}

// Element render props
export interface ElementRenderProps {
  element: LayoutElement;
  totalPages: number;
  isSmall?: boolean;
  pages?: Array<{ id: string; name: string }>; // Available pages for mapping
}

// Element properties panel props
export interface ElementPropertiesProps {
  element: LayoutElement;
  onUpdate: (updates: Partial<LayoutElement>) => void;
  pages?: Array<{ id: string; name: string }>; // Available pages for stepper mapping
}
