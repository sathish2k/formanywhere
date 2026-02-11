/**
 * Form Element Definitions
 * Defines all available form elements for the palette
 */

import {
  AlignLeft,
  Calendar,
  CheckCheck,
  CheckSquare,
  ChevronDown,
  Circle,
  Clock,
  CreditCard,
  FileText,
  Grid3x3,
  Hash,
  Heading1,
  LayoutGrid,
  Link,
  Mail,
  Minus,
  Phone,
  SlidersHorizontal,
  Space,
  Square,
  Star,
  Type,
  Upload,
} from 'lucide-react';
import type { ElementDefinition } from '../form-builder.configuration';

// ============================================================================
// Input Field Elements
// ============================================================================

export const TextInputDef: ElementDefinition = {
  type: 'text-input',
  label: 'Text Input',
  icon: Type,
  category: 'Input Fields',
  color: '#2196F3',
  description: 'Single line text input',
};

export const EmailInputDef: ElementDefinition = {
  type: 'email-input',
  label: 'Email',
  icon: Mail,
  category: 'Input Fields',
  color: '#FF9800',
  description: 'Email address input with validation',
};

export const NumberInputDef: ElementDefinition = {
  type: 'number-input',
  label: 'Number',
  icon: Hash,
  category: 'Input Fields',
  color: '#9C27B0',
  description: 'Numeric input field',
};

export const TextareaDef: ElementDefinition = {
  type: 'textarea',
  label: 'Text Area',
  icon: AlignLeft,
  category: 'Input Fields',
  color: '#00BCD4',
  description: 'Multi-line text input',
};

export const SelectDef: ElementDefinition = {
  type: 'select',
  label: 'Select',
  icon: ChevronDown,
  category: 'Input Fields',
  color: '#4CAF50',
  description: 'Dropdown selection',
};

export const CheckboxDef: ElementDefinition = {
  type: 'checkbox',
  label: 'Checkbox',
  icon: CheckSquare,
  category: 'Input Fields',
  color: '#3F51B5',
  description: 'Checkbox input',
};

export const RadioDef: ElementDefinition = {
  type: 'radio',
  label: 'Radio Group',
  icon: Circle,
  category: 'Input Fields',
  color: '#E91E63',
  description: 'Radio button group',
};

export const DatePickerDef: ElementDefinition = {
  type: 'date-picker',
  label: 'Date Picker',
  icon: Calendar,
  category: 'Input Fields',
  color: '#FF5722',
  description: 'Date selection field',
};

export const FileUploadDef: ElementDefinition = {
  type: 'file-upload',
  label: 'File Upload',
  icon: Upload,
  category: 'Input Fields',
  color: '#795548',
  description: 'File upload field',
};

export const PhoneInputDef: ElementDefinition = {
  type: 'phone-input',
  label: 'Phone',
  icon: Phone,
  category: 'Input Fields',
  color: '#00ACC1',
  description: 'Phone number input',
};

export const UrlInputDef: ElementDefinition = {
  type: 'url-input',
  label: 'URL',
  icon: Link,
  category: 'Input Fields',
  color: '#0097A7',
  description: 'Website URL input',
};

export const RatingDef: ElementDefinition = {
  type: 'rating',
  label: 'Rating',
  icon: Star,
  category: 'Input Fields',
  color: '#FFA726',
  description: 'Star rating input',
};

export const SliderDef: ElementDefinition = {
  type: 'slider',
  label: 'Slider',
  icon: SlidersHorizontal,
  category: 'Input Fields',
  color: '#66BB6A',
  description: 'Numeric slider input',
};

export const TimePickerDef: ElementDefinition = {
  type: 'time-picker',
  label: 'Time',
  icon: Clock,
  category: 'Input Fields',
  color: '#EF5350',
  description: 'Time selection field',
};

export const MultiSelectDef: ElementDefinition = {
  type: 'multi-select',
  label: 'Multi-Select',
  icon: CheckCheck,
  category: 'Input Fields',
  color: '#AB47BC',
  description: 'Multiple choice selection',
};

export const MatrixDef: ElementDefinition = {
  type: 'matrix',
  label: 'Matrix/Grid',
  icon: Grid3x3,
  category: 'Input Fields',
  color: '#5C6BC0',
  description: 'Matrix/grid question',
};

// ============================================================================
// Layout Container Elements
// ============================================================================

export const SectionDef: ElementDefinition = {
  type: 'section',
  label: 'Section',
  icon: Square,
  category: 'Layout',
  color: '#607D8B',
  description: 'Container with title',
};

export const CardDef: ElementDefinition = {
  type: 'card',
  label: 'Card',
  icon: CreditCard,
  category: 'Layout',
  color: '#009688',
  description: 'Elevated card container',
};

export const GridLayoutDef: ElementDefinition = {
  type: 'grid-layout',
  label: 'Grid Layout',
  icon: LayoutGrid,
  category: 'Layout',
  color: '#00897B',
  description: 'Flexible responsive grid layout',
};

// ============================================================================
// Decorator Elements
// ============================================================================

export const HeadingDef: ElementDefinition = {
  type: 'heading',
  label: 'Heading',
  icon: Heading1,
  category: 'Decorators',
  color: '#673AB7',
  description: 'Heading text',
};

export const TextBlockDef: ElementDefinition = {
  type: 'text-block',
  label: 'Text Block',
  icon: FileText,
  category: 'Decorators',
  color: '#9E9E9E',
  description: 'Rich text content',
};

export const DividerDef: ElementDefinition = {
  type: 'divider',
  label: 'Divider',
  icon: Minus,
  category: 'Decorators',
  color: '#757575',
  description: 'Horizontal divider',
};

export const SpacerDef: ElementDefinition = {
  type: 'spacer',
  label: 'Spacer',
  icon: Space,
  category: 'Decorators',
  color: '#BDBDBD',
  description: 'Vertical spacing',
};

// ============================================================================
// Exported Collections
// ============================================================================

export const FORM_ELEMENTS: ElementDefinition[] = [
  // Input Fields
  TextInputDef,
  EmailInputDef,
  NumberInputDef,
  TextareaDef,
  SelectDef,
  CheckboxDef,
  RadioDef,
  DatePickerDef,
  FileUploadDef,
  PhoneInputDef,
  UrlInputDef,
  RatingDef,
  SliderDef,
  TimePickerDef,
  MultiSelectDef,
  MatrixDef,
  // Layout
  SectionDef,
  CardDef,
  GridLayoutDef,
  // Decorators
  HeadingDef,
  TextBlockDef,
  DividerDef,
  SpacerDef,
];

export const ELEMENT_CATEGORIES: string[] = ['Input Fields', 'Layout', 'Decorators'];

export function getElementsByCategory(category: string): ElementDefinition[] {
  return FORM_ELEMENTS.filter((el) => el.category === category);
}
