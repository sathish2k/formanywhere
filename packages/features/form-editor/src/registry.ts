/**
 * Element Registry — @formanywhere/form-editor
 *
 * Delegates to the domain registry (@formanywhere/domain/form).
 * Casts return types to the form-editor-extended ElementDefinition
 * which adds the optional SolidJS `PropertiesPanel` component slot.
 */
import type { FormElementType } from '@formanywhere/shared/types';
import type { ElementDefinition } from './types';
import {
    getAllElements as _getAllElements,
    getElementsByCategory as _getElementsByCategory,
    getElement as _getElement,
    registerElement as _registerElement,
} from '@formanywhere/domain/form';

/** Get a single element definition by type */
export function getElement(type: FormElementType | string): ElementDefinition | undefined {
    return _getElement(type) as ElementDefinition | undefined;
}

/** Get all registered elements */
export function getAllElements(): ElementDefinition[] {
    return _getAllElements() as ElementDefinition[];
}

/** Get elements grouped by category (for Toolbar) */
export function getElementsByCategory(): Array<{ key: string; title: string; items: ElementDefinition[] }> {
    return _getElementsByCategory() as Array<{ key: string; title: string; items: ElementDefinition[] }>;
}

/** Register a custom element at runtime (for third-party plugins) */
export function registerElement(definition: ElementDefinition): void {
    _registerElement(definition);
}
