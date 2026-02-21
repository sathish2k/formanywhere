/**
 * Form-Editor Element Types
 *
 * Extends the framework-agnostic ElementDefinition from @formanywhere/domain/form
 * with an optional SolidJS PropertiesPanel component.
 */
import type { Component } from 'solid-js';
import type { FormElement } from '@formanywhere/shared/types';
import type { ElementDefinition as BaseElementDefinition } from '@formanywhere/domain/form';

// Re-export framework-agnostic PropertyField from domain
export type { PropertyField } from '@formanywhere/domain/form';

/**
 * ElementDefinition extends the domain base with an optional SolidJS
 * PropertiesPanel component for use inside the form-editor UI.
 */
export interface ElementDefinition extends BaseElementDefinition {
    /** Optional: custom SolidJS properties panel component (overrides declarative `properties`) */
    PropertiesPanel?: Component<{ element: FormElement; onChange: (updates: Partial<FormElement>) => void }>;
}
