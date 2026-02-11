/**
 * FormEditorLayout — @formanywhere/form-editor
 * Pre-composed 3-column editor layout: Toolbar | Canvas | Properties.
 * Consumers render this inside a <FormEditor> context provider.
 */
import type { Component } from 'solid-js';
import { Canvas } from '../canvas/Canvas';
import { Toolbar } from '../toolbar/Toolbar';
import { PropertiesPanel } from '../panels/PropertiesPanel';
import '../../styles.scss';

export const FormEditorLayout: Component = () => {
    return (
        <div class="form-editor-layout">
            <aside class="form-editor-layout__sidebar form-editor-layout__sidebar--left">
                <Toolbar />
            </aside>
            <main class="form-editor-layout__canvas-area">
                <Canvas />
            </main>
            <aside class="form-editor-layout__sidebar form-editor-layout__sidebar--right">
                <PropertiesPanel />
            </aside>
        </div>
    );
};
