import { createSignal, createContext, useContext } from 'solid-js';
import type { Component } from 'solid-js';
import type { FormSchema, FormElement } from '@formanywhere/shared/types';
import { generateId } from '@formanywhere/shared/utils';

// Form editor context
interface FormEditorContextValue {
    schema: () => FormSchema;
    selectedElement: () => string | null;
    setSelectedElement: (id: string | null) => void;
    addElement: (type: FormElement['type']) => void;
    updateElement: (id: string, updates: Partial<FormElement>) => void;
    removeElement: (id: string) => void;
    moveElement: (fromIndex: number, toIndex: number) => void;
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

    const addElement = (type: FormElement['type']) => {
        const newElement: FormElement = {
            id: generateId(),
            type,
            label: `New ${type} field`,
            required: false,
        };

        setSchema((prev) => ({
            ...prev,
            elements: [...prev.elements, newElement],
            updatedAt: new Date(),
        }));

        setSelectedElement(newElement.id);
        props.onChange?.(schema());
    };

    const updateElement = (id: string, updates: Partial<FormElement>) => {
        setSchema((prev) => ({
            ...prev,
            elements: prev.elements.map((el) =>
                el.id === id ? { ...el, ...updates } : el
            ),
            updatedAt: new Date(),
        }));
        props.onChange?.(schema());
    };

    const removeElement = (id: string) => {
        setSchema((prev) => ({
            ...prev,
            elements: prev.elements.filter((el) => el.id !== id),
            updatedAt: new Date(),
        }));
        if (selectedElement() === id) {
            setSelectedElement(null);
        }
        props.onChange?.(schema());
    };

    const moveElement = (fromIndex: number, toIndex: number) => {
        setSchema((prev) => {
            const elements = [...prev.elements];
            const [removed] = elements.splice(fromIndex, 1);
            elements.splice(toIndex, 0, removed);
            return { ...prev, elements, updatedAt: new Date() };
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
