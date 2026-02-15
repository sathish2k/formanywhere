import { createSignal, createContext, useContext } from 'solid-js';
import type { Component } from 'solid-js';
import type { FormSchema, FormElement } from '@formanywhere/shared/types';
import { generateId } from '@formanywhere/shared/utils';
import { getElement } from './elements/registry';

// Form editor context
interface FormEditorContextValue {
    schema: () => FormSchema;
    selectedElement: () => string | null;
    setSelectedElement: (id: string | null) => void;
    addElement: (type: FormElement['type'], parentId?: string | null, index?: number) => void;
    updateElement: (id: string, updates: Partial<FormElement>) => void;
    removeElement: (id: string) => void;
    moveElement: (elementId: string, targetParentId: string | null, targetIndex: number) => void;
}

const FormEditorContext = createContext<FormEditorContextValue>();

export const useFormEditor = () => {
    const context = useContext(FormEditorContext);
    if (!context) {
        throw new Error('useFormEditor must be used within FormEditor');
    }
    return context;
};

export interface FormEditorProps {
    initialSchema?: FormSchema;
    onChange?: (schema: FormSchema) => void;
    children?: any;
}

/** Helper: Find element and its parent in the tree */
const findElementPath = (elements: FormElement[], targetId: string): { parent: FormElement | null; index: number; element: FormElement } | null => {
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].id === targetId) {
            return { parent: null, index: i, element: elements[i] };
        }
        if (elements[i].elements) {
            const found = findElementPath(elements[i].elements!, targetId);
            if (found) {
                return found.parent ? found : { parent: elements[i], index: found.index, element: found.element };
            }
        }
    }
    return null;
};

/** Helper: Recursively update elements */
const updateElementInTree = (elements: FormElement[], targetId: string, updater: (el: FormElement) => FormElement): FormElement[] => {
    return elements.map((el) => {
        if (el.id === targetId) {
            return updater(el);
        }
        if (el.elements) {
            return { ...el, elements: updateElementInTree(el.elements, targetId, updater) };
        }
        return el;
    });
};

/** Helper: Insert element at specific path */
const insertElementAt = (elements: FormElement[], parentId: string | null, index: number, newElement: FormElement): FormElement[] => {
    if (!parentId) {
        const newElements = [...elements];
        const targetIndex = index >= 0 ? index : newElements.length;
        newElements.splice(targetIndex, 0, newElement);
        return newElements;
    }
    return elements.map((el) => {
        if (el.id === parentId) {
            const children = el.elements ? [...el.elements] : [];
            const targetIndex = index >= 0 ? index : children.length;
            children.splice(targetIndex, 0, newElement);
            return { ...el, elements: children };
        }
        if (el.elements) {
            return { ...el, elements: insertElementAt(el.elements, parentId, index, newElement) };
        }
        return el;
    });
};

/** Helper: Remove element from tree */
const removeElementFromTree = (elements: FormElement[], targetId: string): { elements: FormElement[]; removed: FormElement | null } => {
    let removed: FormElement | null = null;

    const filterFn = (list: FormElement[]): FormElement[] => {
        const result: FormElement[] = [];
        for (const el of list) {
            if (el.id === targetId) {
                removed = el;
                continue;
            }
            if (el.elements) {
                const { elements: newChildren, removed: childRemoved } = removeElementFromTree(el.elements, targetId);
                if (childRemoved) removed = childRemoved;
                result.push({ ...el, elements: newChildren });
            } else {
                result.push(el);
            }
        }
        return result;
    };

    return { elements: filterFn(elements), removed };
};

export const FormEditor: Component<FormEditorProps> = (props) => {
    const createDefaultSchema = (): FormSchema => ({
        id: generateId(),
        name: 'Untitled Form',
        elements: [],
        settings: {
            submitButtonText: 'Submit',
            successMessage: 'Thank you for your submission!',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const [schema, setSchema] = createSignal<FormSchema>(
        props.initialSchema ?? createDefaultSchema()
    );
    const [selectedElement, setSelectedElement] = createSignal<string | null>(null);

    const addElement = (type: FormElement['type'], parentId: string | null = null, index: number = -1) => {
        // Look up element definition from the registry for defaults
        const def = getElement(type);
        const defaults = def?.defaults ?? {};

        const newElement: FormElement = {
            id: generateId(),
            type,
            label: defaults.label ?? `New ${type} field`,
            required: false,
            ...defaults,
        };

        setSchema((prev) => ({
            ...prev,
            elements: insertElementAt(prev.elements, parentId, index, newElement),
            updatedAt: new Date(),
        }));

        setSelectedElement(newElement.id);
        props.onChange?.(schema());
    };

    const updateElement = (id: string, updates: Partial<FormElement>) => {
        setSchema((prev) => ({
            ...prev,
            elements: updateElementInTree(prev.elements, id, (el) => ({ ...el, ...updates })),
            updatedAt: new Date(),
        }));
        props.onChange?.(schema());
    };

    const removeElement = (id: string) => {
        setSchema((prev) => ({
            ...prev,
            elements: removeElementFromTree(prev.elements, id).elements,
            updatedAt: new Date(),
        }));
        if (selectedElement() === id) {
            setSelectedElement(null);
        }
        props.onChange?.(schema());
    };

    const moveElement = (elementId: string, targetParentId: string | null, targetIndex: number) => {
        setSchema((prev) => {
            const { elements: elementsWithoutSource, removed } = removeElementFromTree(prev.elements, elementId);

            if (!removed) return prev;

            const finalElements = insertElementAt(elementsWithoutSource, targetParentId, targetIndex, removed);

            return {
                ...prev,
                elements: finalElements,
                updatedAt: new Date(),
            };
        });
        props.onChange?.(schema());
    };

    return (
        <FormEditorContext.Provider
            value={{
                schema,
                selectedElement,
                setSelectedElement,
                addElement,
                updateElement,
                removeElement,
                moveElement,
            }}
        >
            {props.children}
        </FormEditorContext.Provider>
    );
};
