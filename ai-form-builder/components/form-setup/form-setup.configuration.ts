/**
 * Form Setup Configuration
 * Types, constants, and static data for form setup
 */

export interface PageData {
  id: string;
  name: string;
  description: string;
}

// Layout Element Types
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

export interface LayoutElement {
  id: string;
  type: LayoutElementType;
  label?: string;
  config?: Record<string, unknown>;
  // Column children (for twoColumn/threeColumn)
  column1?: LayoutElement[];
  column2?: LayoutElement[];
  column3?: LayoutElement[];
}

export type StepperPosition = 'top' | 'left' | 'none';
export type StepperStyle = 'dots' | 'numbers' | 'progress' | 'arrows';

export interface LayoutConfig {
  id: string;
  name: string;
  description: string;
  headerElements: LayoutElement[];
  footerElements: LayoutElement[];
  stepperPosition: StepperPosition;
  stepperStyle: StepperStyle;
}

export interface FormSetupData {
  name: string;
  description: string;
  pages: PageData[];
  layoutType: 'classic' | 'card';
  layout?: LayoutConfig | null; // Optional, can be null
}

export const defaultPage: PageData = {
  id: 'page-1',
  name: 'Page 1',
  description: 'First page of your form',
};

export const defaultLayout: LayoutConfig = {
  id: 'default-layout',
  name: 'Default Layout',
  description: 'Basic multi-step form layout',
  headerElements: [],
  footerElements: [],
  stepperPosition: 'top',
  stepperStyle: 'dots',
};

export const defaultFormSetup: Partial<FormSetupData> = {
  name: 'Untitled Form',
  description: '',
  pages: [defaultPage],
  layoutType: 'classic',
};
