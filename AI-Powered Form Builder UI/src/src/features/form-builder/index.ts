/**
 * Form Builder Feature - Public API
 * Main entry point for the form builder module
 */

// Components
export { ElementsSidebar } from './components/ElementsSidebar';
export { FormCanvas } from './components/FormCanvas';
export { FormElementRenderer } from './components/FormElementRenderer';
export { PropertiesPanelNew as PropertiesPanel } from './components/PropertiesPanelNew';

// Configuration
export { FORM_ELEMENTS, ELEMENT_CATEGORIES } from './config';

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
} from './types';

// Engines
export { RulesEngine } from './engines/RulesEngine';
export { FormRenderer } from './engines/FormRenderer';

// Utils
export {
  createDroppedElement,
  validateElement,
  generateFormSchema,
} from './utils';

// Page
export { default as FormBuilderPage } from './pages/FormBuilderPage';
