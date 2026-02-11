/**
 * Form Builder Module - Main Entry Point
 * 
 * This module provides a complete form building system with:
 * - Drag-and-drop interface
 * - Rule engine for conditional logic
 * - Dynamic form rendering
 * - Multi-step form support
 */

// Components
export { ElementsSidebar } from './components/ElementsSidebar';
export { FormCanvas } from './components/FormCanvas';
export { PropertiesPanelNew as PropertiesPanel } from './components/PropertiesPanelNew';
export { FormElementRenderer } from './components/FormElementRenderer';

// Engines
export { RulesEngine } from './engines/RulesEngine';
export { FormRenderer } from './engines/FormRenderer';
export type { RuleEvaluationResult, ValidationResult } from './engines/RulesEngine';
export type { FormRendererProps } from './engines/FormRenderer';

// Types
export type {
  FormElement,
  DroppedElement,
  ValidationRule,
  ConditionalLogic,
  Condition,
  LayoutConfig,
  PageData,
  FormData,
  ThemeConfig,
  FormSettings,
  FormSubmission,
  RuleAction,
  Rule,
  ElementCategory,
} from './types/form.types';

// Configuration
export { FORM_ELEMENTS, ELEMENT_CATEGORIES } from './config/elements.config';

// Utils
export {
  createDroppedElement,
  duplicateElement,
  generateFormSchema,
  exportFormToJSON,
  importFormFromJSON,
  groupElementsByCategory,
  filterElements,
  calculateFormCompletion,
  getElementById,
  reorderElements,
  validateElementConfig,
  generateElementId,
  cloneElement,
} from './utils/form.utils';