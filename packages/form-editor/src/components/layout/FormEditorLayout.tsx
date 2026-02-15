/**
 * FormEditorLayout — @formanywhere/form-editor
 * Pre-composed 3-column editor layout: Toolbar | Canvas | Properties.
 * Uses native HTML5 drag-and-drop (no third-party DnD library).
 */
import { createSignal, onMount, onCleanup } from 'solid-js';
import type { Component } from 'solid-js';
import { Canvas } from '../canvas/Canvas';
import { Toolbar } from '../toolbar/Toolbar';
import { PropertiesPanel } from '../panels/PropertiesPanel';
import { useFormEditor } from '../FormEditor';
import '../../styles.scss';

export const FormEditorLayout: Component = () => {
    const {
        addElement, moveElement, moveElementDirection, undo, redo,
        copyElement, pasteElement, duplicateElement,
        selectedElement, removeElement, removeSelected,
        selectedElements,
    } = useFormEditor();

    // Shared drag state so Canvas knows what's being dragged
    const [dragType, setDragType] = createSignal<string | null>(null);
    const [dragSource, setDragSource] = createSignal<'toolbar' | 'canvas' | null>(null);

    const handleToolbarDragStart = (elementType: string) => {
        setDragType(elementType);
        setDragSource('toolbar');
    };

    const handleCanvasDragStart = (id: string) => {
        setDragSource('canvas');
        setDragType(null);
    };

    const handleDragEnd = () => {
        setDragType(null);
        setDragSource(null);
    };

    // ── Keyboard shortcuts ────────────────────────────────────────────────────
    const handleKeyDown = (e: KeyboardEvent) => {
        // Ignore when typing in input fields
        const tag = (e.target as HTMLElement).tagName;
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;

        const isMeta = e.metaKey || e.ctrlKey;

        // Ctrl+Z — Undo
        if (isMeta && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undo();
            return;
        }
        // Ctrl+Shift+Z or Ctrl+Y — Redo
        if ((isMeta && e.key === 'z' && e.shiftKey) || (isMeta && e.key === 'y')) {
            e.preventDefault();
            redo();
            return;
        }
        // Ctrl+C — Copy
        if (isMeta && e.key === 'c') {
            const sel = selectedElement();
            if (sel) { e.preventDefault(); copyElement(sel); }
            return;
        }
        // Ctrl+V — Paste
        if (isMeta && e.key === 'v') {
            e.preventDefault();
            pasteElement();
            return;
        }
        // Ctrl+D — Duplicate
        if (isMeta && e.key === 'd') {
            const sel = selectedElement();
            if (sel) { e.preventDefault(); duplicateElement(sel); }
            return;
        }
        // Delete / Backspace — Remove selected
        if (e.key === 'Delete' || e.key === 'Backspace') {
            if (selectedElements().size > 1) {
                e.preventDefault();
                removeSelected();
            } else {
                const sel = selectedElement();
                if (sel) { e.preventDefault(); removeElement(sel); }
            }
            return;
        }
        // ArrowUp / ArrowDown — Reorder selected element
        if (e.key === 'ArrowUp' && isMeta) {
            e.preventDefault();
            moveElementDirection('up');
            return;
        }
        if (e.key === 'ArrowDown' && isMeta) {
            e.preventDefault();
            moveElementDirection('down');
            return;
        }
    };

    onMount(() => document.addEventListener('keydown', handleKeyDown));
    onCleanup(() => document.removeEventListener('keydown', handleKeyDown));

    return (
        <div class="form-editor-layout">
            <aside class="form-editor-layout__sidebar form-editor-layout__sidebar--left">
                <Toolbar onDragStart={handleToolbarDragStart} />
            </aside>
            <main class="form-editor-layout__canvas-area">
                <Canvas
                    onCanvasDragStart={handleCanvasDragStart}
                    onDragEnd={handleDragEnd}
                    dragSource={dragSource}
                />
            </main>
            <aside class="form-editor-layout__sidebar form-editor-layout__sidebar--right">
                <PropertiesPanel />
            </aside>
        </div>
    );
};
