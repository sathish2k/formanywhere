/**
 * Element Plugin Types — @formanywhere/domain
 *
 * Framework-agnostic definitions for form element plugins.
 * UI-specific extensions (e.g. SolidJS PropertiesPanel component) live
 * in the consuming feature package (e.g. @formanywhere/form-editor).
 */
import type { FormElementType, FormElement } from '@formanywhere/shared/types';

/** Property field definition for auto-generating simple property panels */
export interface PropertyField {
    key: string;
    label: string;
    type: 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'color' | 'range';
    /** Min value for 'range' type */
    min?: number;
    /** Max value for 'range' type */
    max?: number;
    /** Step for 'range' type */
    step?: number;
    /** Options for 'select' type */
    options?: Array<{ label: string; value: string }>;
    /** Default value */
    defaultValue?: string | number | boolean;
    /** Help text shown below the field */
    helpText?: string;
    /** Group heading (for visual grouping in properties panel) */
    group?: string;
}

/** Full element definition — the plugin contract (no UI / framework deps) */
export interface ElementDefinition {
    /** Element type identifier (must match FormElementType) */
    type: FormElementType;
    /** Display label in toolbar */
    label: string;
    /** Icon name (from @formanywhere/ui Icon set) */
    icon: string;
    /** Category for grouping in toolbar */
    category: 'layout' | 'text-inputs' | 'choice' | 'date-time' | 'advanced';
    /** Accent color for the toolbar tile */
    color: string;
    /** Default values when element is first created */
    defaults: Partial<FormElement>;
    /** Declarative property fields — auto-renders a properties panel */
    properties: PropertyField[];
}
