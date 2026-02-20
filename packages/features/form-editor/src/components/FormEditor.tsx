import { splitProps, createSignal, createContext, useContext } from 'solid-js';
import type { Component } from 'solid-js';
import type { FormSchema, FormElement } from '@formanywhere/shared/types';
import { generateId } from '@formanywhere/shared/utils';
import { getElement } from './elements/registry';

// Form editor context
interface FormEditorContextValue {
    schema: () => FormSchema;
    selectedElement: () => string | null;
    setSelectedElement: (id: string | null) => void;
    addElement: (type: FormElement['type'], parentId?: string | null, index?: number, columns?: number) => void;
    updateElement: (id: string, updates: Partial<FormElement>) => void;
    removeElement: (id: string) => void;
    moveElement: (elementId: string, targetParentId: string | null, targetIndex: number) => void;
    moveElementDirection: (direction: 'up' | 'down') => void;
    /** Undo / redo */
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
    /** Clipboard */
    copyElement: (id: string) => void;
    pasteElement: (parentId?: string | null, index?: number) => void;
    duplicateElement: (id: string) => void;
    clipboard: () => FormElement | null;
    /** Active page ID for page ↔ element binding */
    activePageId: () => string;
    /** Elements visible on the current page (root level, filtered by page) */
    pageElements: () => FormElement[];
    /** Multi-select */
    selectedElements: () => Set<string>;
    toggleSelectElement: (id: string, multi?: boolean) => void;
    clearSelection: () => void;
    removeSelected: () => void;
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
    /** Active page ID — elements are filtered by this page */
    activePageId?: string;
    /** All page tabs — used to initialise page↔element bindings */
    pages?: Array<{ id: string; title: string }>;
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

/** Deep-clone a FormElement tree (for clipboard / undo) */
const deepCloneElement = (el: FormElement): FormElement => {
    const clone: FormElement = { ...el, id: generateId() };
    if (el.elements) {
        clone.elements = el.elements.map(deepCloneElement);
    }
    return clone;
};

export const FormEditor: Component<FormEditorProps> = (props) => {
    const [local] = splitProps(props, ['initialSchema', 'onChange', 'activePageId', 'children']);
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
        local.initialSchema ?? createDefaultSchema()
    );
    const [selectedElement, setSelectedElement] = createSignal<string | null>(null);
    const [selectedElements, setSelectedElements] = createSignal<Set<string>>(new Set());
    const [clipboard, setClipboard] = createSignal<FormElement | null>(null);

    // ── Undo / Redo history ──────────────────────────────────────────────
    const MAX_HISTORY = 50;
    const [history, setHistory] = createSignal<FormSchema[]>([]);
    const [historyIndex, setHistoryIndex] = createSignal(-1);
    let skipHistory = false;

    const pushHistory = (s: FormSchema) => {
        if (skipHistory) return;
        setHistory((prev) => {
            const idx = historyIndex();
            const trimmed = idx < prev.length - 1 ? prev.slice(0, idx + 1) : [...prev];
            trimmed.push(s);
            if (trimmed.length > MAX_HISTORY) trimmed.shift();
            return trimmed;
        });
        setHistoryIndex(history().length - 1);
    };

    // Seed initial state into history
    pushHistory(schema());

    const undo = () => {
        const idx = historyIndex();
        if (idx <= 0) return;
        const newIdx = idx - 1;
        skipHistory = true;
        setSchema(history()[newIdx]);
        setHistoryIndex(newIdx);
        skipHistory = false;
        local.onChange?.(schema());
    };

    const redo = () => {
        const idx = historyIndex();
        if (idx >= history().length - 1) return;
        const newIdx = idx + 1;
        skipHistory = true;
        setSchema(history()[newIdx]);
        setHistoryIndex(newIdx);
        skipHistory = false;
        local.onChange?.(schema());
    };

    const canUndo = () => historyIndex() > 0;
    const canRedo = () => historyIndex() < history().length - 1;

    // ── Active page & page→element binding ───────────────────────────────
    const activePageId = () => local.activePageId ?? '';

    /** Get the page→elementIds map from schema.settings.pages */
    const getPageElementIds = (): Map<string, string[]> => {
        const map = new Map<string, string[]>();
        const pages = schema().settings.pages;
        if (pages) {
            for (const p of pages) map.set(p.id, [...p.elements]);
        }
        return map;
    };

    /** Root elements filtered by the active page */
    const pageElements = () => {
        const pgId = activePageId();
        if (!pgId) return schema().elements; // no pages → show all
        const pages = schema().settings.pages;
        if (!pages || pages.length === 0) return schema().elements;
        const page = pages.find((p) => p.id === pgId);
        if (!page) return [];
        const idSet = new Set(page.elements);
        return schema().elements.filter((el) => idSet.has(el.id));
    };

    /** Assign a root element to the active page */
    const assignToPage = (elementId: string) => {
        const pgId = activePageId();
        if (!pgId) return;
        setSchema((prev) => {
            const pages = prev.settings.pages ? [...prev.settings.pages] : [];
            const pageIdx = pages.findIndex((p) => p.id === pgId);
            if (pageIdx >= 0) {
                const pg = { ...pages[pageIdx], elements: [...pages[pageIdx].elements, elementId] };
                pages[pageIdx] = pg;
            }
            return { ...prev, settings: { ...prev.settings, pages } };
        });
    };

    /** Remove an element from all pages */
    const unassignFromPages = (elementId: string) => {
        setSchema((prev) => {
            if (!prev.settings.pages) return prev;
            const pages = prev.settings.pages.map((p) => ({
                ...p,
                elements: p.elements.filter((eid) => eid !== elementId),
            }));
            return { ...prev, settings: { ...prev.settings, pages } };
        });
    };

    const addElement = (type: FormElement['type'], parentId: string | null = null, index: number = -1, columns: number = 2) => {
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

        // Auto-create child columns for grid elements
        if (type === 'grid') {
            const cols = Math.max(1, Math.min(columns, 6));
            const colWidth = Math.floor(12 / cols);
            newElement.elements = Array.from({ length: cols }, (_, i) => ({
                id: generateId(),
                type: 'grid-column' as FormElement['type'],
                label: `Column ${i + 1}`,
                required: false,
                span: colWidth,
                elements: [],
            }));
            (newElement as any).columns = cols;
        }

        setSchema((prev) => ({
            ...prev,
            elements: insertElementAt(prev.elements, parentId, index, newElement),
            updatedAt: new Date(),
        }));

        // If adding at root level, assign to active page
        if (!parentId) assignToPage(newElement.id);

        setSelectedElement(newElement.id);
        pushHistory(schema());
        local.onChange?.(schema());
    };

    const updateElement = (id: string, updates: Partial<FormElement>) => {
        setSchema((prev) => ({
            ...prev,
            elements: updateElementInTree(prev.elements, id, (el) => ({ ...el, ...updates })),
            updatedAt: new Date(),
        }));
        pushHistory(schema());
        local.onChange?.(schema());
    };

    const removeElement = (id: string) => {
        unassignFromPages(id);
        setSchema((prev) => ({
            ...prev,
            elements: removeElementFromTree(prev.elements, id).elements,
            updatedAt: new Date(),
        }));
        if (selectedElement() === id) {
            setSelectedElement(null);
        }
        setSelectedElements((prev) => { const s = new Set(prev); s.delete(id); return s; });
        pushHistory(schema());
        local.onChange?.(schema());
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
        pushHistory(schema());
        local.onChange?.(schema());
    };

    /** Move the currently selected element up or down within its parent list. */
    const moveElementDirection = (direction: 'up' | 'down') => {
        const id = selectedElement();
        if (!id) return;

        // Find parent and index
        const findParentAndIndex = (
            elements: FormElement[],
            targetId: string,
        ): { parent: FormElement[] | null; index: number } => {
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].id === targetId) return { parent: elements, index: i };
                if (elements[i].elements) {
                    const result = findParentAndIndex(elements[i].elements!, targetId);
                    if (result.parent) return result;
                }
            }
            return { parent: null, index: -1 };
        };

        const { parent, index } = findParentAndIndex(schema().elements, id);
        if (!parent) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= parent.length) return;

        // Swap in-place
        setSchema((prev) => {
            const swap = (elements: FormElement[]): FormElement[] => {
                for (let i = 0; i < elements.length; i++) {
                    if (elements[i].id === id) {
                        const copy = [...elements];
                        [copy[i], copy[newIndex]] = [copy[newIndex], copy[i]];
                        return copy;
                    }
                    if (elements[i].elements) {
                        const newChildren = swap(elements[i].elements!);
                        if (newChildren !== elements[i].elements) {
                            const copy = [...elements];
                            copy[i] = { ...copy[i], elements: newChildren };
                            return copy;
                        }
                    }
                }
                return elements;
            };
            return { ...prev, elements: swap(prev.elements), updatedAt: new Date() };
        });
        pushHistory(schema());
        local.onChange?.(schema());
    };

    // ── Clipboard: Copy / Paste / Duplicate ───────────────────────────────

    const findEl = (elements: FormElement[], id: string): FormElement | null => {
        for (const el of elements) {
            if (el.id === id) return el;
            if (el.elements) {
                const found = findEl(el.elements, id);
                if (found) return found;
            }
        }
        return null;
    };

    const copyElement = (id: string) => {
        const el = findEl(schema().elements, id);
        if (el) setClipboard(JSON.parse(JSON.stringify(el)));
    };

    const pasteElement = (parentId: string | null = null, index: number = -1) => {
        const src = clipboard();
        if (!src) return;
        const clone = deepCloneElement(src);
        setSchema((prev) => ({
            ...prev,
            elements: insertElementAt(prev.elements, parentId, index, clone),
            updatedAt: new Date(),
        }));
        if (!parentId) assignToPage(clone.id);
        setSelectedElement(clone.id);
        pushHistory(schema());
        local.onChange?.(schema());
    };

    const duplicateElement = (id: string) => {
        const path = findElementPath(schema().elements, id);
        if (!path) return;
        const el = findEl(schema().elements, id);
        if (!el) return;
        const clone = deepCloneElement(el);
        const parentId = path.parent?.id ?? null;
        const insertIdx = path.index + 1;
        setSchema((prev) => ({
            ...prev,
            elements: insertElementAt(prev.elements, parentId, insertIdx, clone),
            updatedAt: new Date(),
        }));
        if (!parentId) assignToPage(clone.id);
        setSelectedElement(clone.id);
        pushHistory(schema());
        local.onChange?.(schema());
    };

    // ── Multi-select ─────────────────────────────────────────────────────

    const toggleSelectElement = (id: string, multi = false) => {
        if (multi) {
            setSelectedElements((prev) => {
                const s = new Set(prev);
                if (s.has(id)) s.delete(id); else s.add(id);
                return s;
            });
            // Primary selection follows last click
            setSelectedElement(id);
        } else {
            setSelectedElements(new Set([id]));
            setSelectedElement(id);
        }
    };

    const clearSelection = () => {
        setSelectedElements(new Set<string>());
        setSelectedElement(null);
    };

    const removeSelected = () => {
        const ids = selectedElements();
        if (ids.size === 0) return;
        ids.forEach((id) => {
            unassignFromPages(id);
            setSchema((prev) => ({
                ...prev,
                elements: removeElementFromTree(prev.elements, id).elements,
                updatedAt: new Date(),
            }));
        });
        setSelectedElements(new Set<string>());
        setSelectedElement(null);
        pushHistory(schema());
        local.onChange?.(schema());
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
                moveElementDirection,
                undo,
                redo,
                canUndo,
                canRedo,
                copyElement,
                pasteElement,
                duplicateElement,
                clipboard,
                activePageId,
                pageElements,
                selectedElements,
                toggleSelectElement,
                clearSelection,
                removeSelected,
            }}
        >
            {local.children}
        </FormEditorContext.Provider>
    );
};
