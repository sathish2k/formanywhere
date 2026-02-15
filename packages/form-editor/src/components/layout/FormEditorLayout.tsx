/**
 * FormEditorLayout — @formanywhere/form-editor
 * Pre-composed 3-column editor layout: Toolbar | Canvas | Properties.
 * Uses native HTML5 drag-and-drop (no third-party DnD library).
 */
import { createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import { Canvas } from '../canvas/Canvas';
import { Toolbar } from '../toolbar/Toolbar';
import { PropertiesPanel } from '../panels/PropertiesPanel';
import { useFormEditor } from '../FormEditor';
import '../../styles.scss';

export const FormEditorLayout: Component = () => {
    const { addElement, moveElement } = useFormEditor();

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
