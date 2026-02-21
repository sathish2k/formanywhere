/**
 * Shared props contract for every field component in domain/form/elements/.
 * A single component handles both 'editor' (canvas) and 'runtime' (preview/publish) modes:
 *
 *  - editor:  renders interactive UI, onValue writes element.defaultValue
 *  - runtime: renders interactive UI, onValue writes modular-forms field value;
 *             shows required mark, validation error, and conditional visibility
 */
import type { JSX } from 'solid-js';
import type { FormElement } from '@formanywhere/shared/types';

export type FieldMode = 'editor' | 'runtime';

/** Unified props accepted by every leaf field component */
export interface FieldProps {
    mode: FieldMode;
    element: FormElement;

    /** Reactive getter for the current field value */
    value: () => string;

    /**
     * Setter:
     *  - runtime → setValue(formStore, element.id, v)
     *  - editor  → updateElement(element.id, { defaultValue: v })
     */
    onValue: (v: string) => void;

    // Native input binding props — runtime only, provided by adaptFieldProps()
    ref?: (el: HTMLInputElement | HTMLTextAreaElement) => void;
    name?: string;
    onInput?: JSX.EventHandlerUnion<HTMLInputElement | HTMLTextAreaElement, InputEvent>;
    onChange?: JSX.EventHandlerUnion<HTMLInputElement | HTMLTextAreaElement, Event>;
    onBlur?: JSX.EventHandlerUnion<HTMLInputElement | HTMLTextAreaElement, FocusEvent>;

    /** Validation error message — shown in runtime mode only */
    error?: string;
}

/** Props for structural / layout elements */
export interface LayoutFieldProps {
    element: FormElement;
    /** Recursive renderer for child elements */
    renderChild: (child: FormElement) => JSX.Element | null;
}
