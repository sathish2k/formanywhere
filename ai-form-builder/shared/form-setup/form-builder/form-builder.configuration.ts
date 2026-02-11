/**
 * Form Builder Configuration
 * Types, interfaces, and constants for the form builder
 */

import type { LucideIcon } from 'lucide-react';

// ============================================================================
// Form Element Types
// ============================================================================

export type FormElementType =
  // Input Fields
  | 'text-input'
  | 'email-input'
  | 'number-input'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date-picker'
  | 'file-upload'
  | 'phone-input'
  | 'url-input'
  | 'rating'
  | 'slider'
  | 'time-picker'
  | 'multi-select'
  | 'matrix'
  // Layout Containers
  | 'section'
  | 'card'
  | 'grid-layout'
  // Decorators
  | 'heading'
  | 'text-block'
  | 'divider'
  | 'spacer';

export type FormElementCategory = 'Input Fields' | 'Layout' | 'Decorators';

export type ValidationRule =
  | 'required'
  | 'email'
  | 'url'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'
  | 'pattern';

// ============================================================================
// Conditional Logic & Rules
// ============================================================================

export type ConditionOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'isChecked'
  | 'isNotChecked';

export interface Condition {
  fieldId: string;
  operator: ConditionOperator;
  value: any;
}

export interface ConditionalLogic {
  conditions: Condition[];
  operator: 'AND' | 'OR';
  action: 'show' | 'hide';
}

export interface RuleAction {
  type: 'show' | 'hide' | 'enable' | 'disable' | 'require' | 'setValue';
  targetId: string;
  value?: any;
}

export interface Rule {
  id: string;
  name: string;
  enabled: boolean;
  conditions: Condition[];
  operator: 'AND' | 'OR';
  actions: RuleAction[];
}

// ============================================================================
// Grid Layout Configuration
// ============================================================================

export interface GridItemConfig {
  id: string;
  size: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  children: DroppedElement[];
}

// ============================================================================
// Dropped Element (Element on Canvas)
// ============================================================================

export interface DroppedElement {
  id: string;
  type: FormElementType;
  label: string;
  icon: LucideIcon;
  color: string;

  // Common properties
  fieldName?: string;
  placeholder?: string;
  helperText?: string;
  defaultValue?: string | number | boolean;
  required?: boolean;
  hidden?: boolean; // Initial visibility state - true means element starts hidden

  // Validation
  validation?: {
    rules: ValidationRule[];
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customMessage?: string;
    customRule?: (value: any) => boolean;
  };

  // Input-specific properties
  options?: Array<{ label: string; value: string }>; // For select, radio, checkbox, multi-select
  multiple?: boolean; // For select
  rows?: number | Array<{ id: string; label: string }>; // For textarea or matrix rows
  accept?: string; // For file-upload
  maxFiles?: number; // For file-upload

  // Rating-specific
  maxStars?: number; // For rating

  // Slider-specific
  min?: number; // For slider
  max?: number; // For slider
  step?: number; // For slider

  // Matrix-specific
  columns?: Array<{ id: string; label: string }>; // For matrix

  // Layout properties
  width?: 'full' | 'half' | 'third';
  spacing?: number;

  // Container-specific (for section, card)
  children?: DroppedElement[];

  // Grid layout specific
  gridItems?: GridItemConfig[];

  // Decorator properties
  heading?: string;
  content?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large';

  // Conditional logic
  conditionalLogic?: ConditionalLogic;
  conditions?: {
    show?: { fieldId: string; operator: string; value: any }[];
    required?: { fieldId: string; operator: string; value: any }[];
  };
}

// ============================================================================
// Element Definition (For Palette)
// ============================================================================

export interface ElementDefinition {
  type: FormElementType;
  label: string;
  icon: LucideIcon;
  category: FormElementCategory;
  color: string;
  description: string;
}

// ============================================================================
// Form Builder State
// ============================================================================

export interface FormBuilderState {
  formId: string;
  formName: string;
  formDescription: string;
  pages: PageData[];
  currentPageIndex: number;
  pageElements: Record<string, DroppedElement[]>;
  selectedElementId: string | null;
}

export interface PageData {
  id: string;
  name: string;
  description: string;
}

// ============================================================================
// Validation Schema
// ============================================================================

export interface ValidationSchema {
  rules: ValidationRule[];
  messages?: Partial<Record<ValidationRule, string>>;
}

// ============================================================================
// Default Values
// ============================================================================

export const defaultValidation: ValidationSchema = {
  rules: [],
};

export const elementDefaults: Record<FormElementType, Partial<DroppedElement>> = {
  'text-input': {
    label: 'Text Input',
    placeholder: 'Enter text...',
    width: 'full',
  },
  'email-input': {
    label: 'Email',
    placeholder: 'Enter email...',
    width: 'full',
    validation: {
      rules: ['email'],
    },
  },
  'number-input': {
    label: 'Number',
    placeholder: 'Enter number...',
    width: 'full',
  },
  textarea: {
    label: 'Text Area',
    placeholder: 'Enter text...',
    rows: 4,
    width: 'full',
  },
  select: {
    label: 'Select',
    placeholder: 'Choose option...',
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ],
    width: 'full',
  },
  checkbox: {
    label: 'Checkbox',
    defaultValue: false,
    width: 'full',
  },
  radio: {
    label: 'Radio Group',
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ],
    width: 'full',
  },
  'date-picker': {
    label: 'Date',
    placeholder: 'Select date...',
    width: 'full',
  },
  'file-upload': {
    label: 'File Upload',
    accept: '*/*',
    maxFiles: 1,
    width: 'full',
  },
  'phone-input': {
    label: 'Phone Number',
    placeholder: '+1 (555) 000-0000',
    width: 'full',
  },
  'url-input': {
    label: 'Website URL',
    placeholder: 'https://example.com',
    width: 'full',
  },
  rating: {
    label: 'Rating',
    maxStars: 5,
    defaultValue: 0,
    width: 'full',
  },
  slider: {
    label: 'Slider',
    min: 0,
    max: 10,
    step: 1,
    defaultValue: 5,
    width: 'full',
  },
  'time-picker': {
    label: 'Time',
    width: 'full',
  },
  'multi-select': {
    label: 'Multi-Select',
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ],
    width: 'full',
  },
  matrix: {
    label: 'Matrix Question',
    rows: [
      { id: 'row1', label: 'Question 1' },
      { id: 'row2', label: 'Question 2' },
    ],
    columns: [
      { id: 'col1', label: 'Option 1' },
      { id: 'col2', label: 'Option 2' },
    ],
    width: 'full',
  },
  section: {
    label: 'Section',
    heading: 'Section Title',
    children: [],
  },
  card: {
    label: 'Card',
    heading: 'Card Title',
    children: [],
  },
  'grid-layout': {
    label: 'Grid Layout',
    spacing: 2,
    gridItems: [
      { id: 'grid-item-1', size: 6, children: [] },
      { id: 'grid-item-2', size: 6, children: [] },
    ],
  },
  heading: {
    label: 'Heading',
    heading: 'Heading Text',
    size: 'medium',
    align: 'left',
  },
  'text-block': {
    label: 'Text Block',
    content: 'Enter your text here...',
    align: 'left',
  },
  divider: {
    label: 'Divider',
  },
  spacer: {
    label: 'Spacer',
    size: 'medium',
  },
};
