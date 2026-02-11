/**
 * Form Builder Configuration
 * Types, constants, and static data for form builder flow
 */

import type { LucideIcon } from 'lucide-react';
import { FileText, Layers } from 'lucide-react';

// Layout Types
export type FormLayoutType = 'classic' | 'card';

export interface LayoutOption {
  id: FormLayoutType;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const layoutOptions: LayoutOption[] = [
  {
    id: 'classic',
    title: 'Classic Form',
    description: 'Show all questions as per pages',
    icon: FileText,
  },
  {
    id: 'card',
    title: 'Card Form',
    description: 'Show single question per page',
    icon: Layers,
  },
];

// Page Data
export interface PageData {
  id: string;
  name: string;
  description: string;
}

export interface FormSetupData {
  name: string;
  description: string;
  pages: PageData[];
  layoutType: FormLayoutType;
}

// Default values
export const defaultPage: PageData = {
  id: 'page-1',
  name: 'Page 1',
  description: 'First page of your form',
};

export const defaultFormSetup: Partial<FormSetupData> = {
  name: 'Untitled Form',
  description: '',
  pages: [defaultPage],
  layoutType: 'classic',
};
