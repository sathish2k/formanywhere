import { splitProps } from 'solid-js';
import { For, createSignal, type Accessor, Show, Index } from 'solid-js';
import type { Component } from 'solid-js';
import { useFormEditor } from '../FormEditor';
import { CanvasFieldRow } from './CanvasFieldRow';
import type { FormElement } from '@formanywhere/shared/types';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { GridLayoutPicker } from '../grid-layout-picker';
import './styles.scss';

/** Layout types that can be dropped at root level */
const LAYOUT_TYPES = new Set([
    'container', 'grid', 'section', 'card', 'grid-column',
    'divider', 'spacer', 'heading', 'logo', 'text-block',
]);

interface CanvasRegionProps {
    elements: Accessor<FormElement[]>;
    parentId: string | null;
    dragSource: Accessor<'toolbar' | 'canvas' | null>;
    onCanvasDragStart?: (id: string) => void;
    onDragEnd?: () => void;
    placeholder?: string;
    isEmpty?: boolean;
}

export const CanvasRegion: Component<CanvasRegionProps> = (props) => {
    const [local] = splitProps(props, ['elements', 'parentId', 'dragSource', 'onCanvasDragStart', 'onDragEnd', 'isEmpty', 'placeholder']);
    const { addElement, moveElement, selectedElement, setSelectedElement, removeElement, toggleSelectElement, selectedElements } = useFormEditor();
    const [isDragOver, setIsDragOver] = createSignal(false);
    const [showGridPicker, setShowGridPicker] = createSignal(false);

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const hasType = e.dataTransfer?.types.includes('application/x-form-type');
        const hasId = e.dataTransfer?.types.includes('application/x-form-id');

        if (hasType || hasId) {
            const effect = local.dragSource() === 'toolbar' ? 'copy' : 'move';
            e.dataTransfer!.dropEffect = effect;
            setIsDragOver(true);
        }
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const newType = e.dataTransfer?.getData('application/x-form-type');
        const existingId = e.dataTransfer?.getData('application/x-form-id');

        if (newType) {
            // At root level (parentId === null), only allow layout elements
            if (!local.parentId && !LAYOUT_TYPES.has(newType)) {
                return; // Block non-layout elements at root — must drop inside a grid column
            }
            addElement(newType as any, local.parentId);
        } else if (existingId) {
            moveElement(existingId, local.parentId, local.elements().length);
        }
    };

    const handleGridSelect = (cols: number) => {
        addElement('grid', local.parentId, -1, cols);
        setShowGridPicker(false);
    };

    const handleRowDrop = (targetIndex: number) => {
        // This is called when dropping ON a row (insert before)
        // We rely on global drag state or we need to access dataTransfer but dataTransfer is gone by now...
        // Wait, 'CanvasFieldRow' calls this prop. 
        // We can't easily get dataTransfer data in `handleRowDrop` without it being passed.
        // `CanvasFieldRow` handles the drop event and calls `onDrop`.
        // To fix this, `CanvasFieldRow` needs to pass the data or we need a global store for "current drag".
        // `FormEditorLayout` has `dragType` and `dragIndex`.
        // But `dragIndex` is only valid for root list.
        // We really should use `dataTransfer` everywhere.

        // Actually, `CanvasFieldRow` should handle the drop logic itself (calling context methods)
        // OR pass the event to us.
        // Let's make `CanvasFieldRow` handle the drop event using `dataTransfer` and call context directly?
        // Or callback with type/id.
        // The `CanvasFieldRow` in this file is just deferring to `local.onDrop`.
    };

    return (
        <div
            class="canvas-region"
            classList={{
                'canvas-region--drag-over': isDragOver(),
                'canvas-region--empty': local.elements().length === 0 && !local.isEmpty
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ 'min-height': '50px', 'height': '100%' }} // Ensure drop target has size
        >
            <Show
                when={local.elements().length > 0}
                fallback={
                    <div class="canvas-region__empty-placeholder">
                        <Show when={local.isEmpty}>
                            {/* Empty state for root canvas */}
                            <Show
                                when={showGridPicker()}
                                fallback={
                                    <>
                                        <div class="form-canvas__empty-illustration">
                                            <Icon name="layout" size={48} />
                                        </div>
                                        <Typography variant="title-medium">Start building your form</Typography>
                                        <Typography variant="body-medium" color="on-surface-variant">
                                            Add a grid layout to begin, then drag elements into columns
                                        </Typography>
                                        <div class="form-canvas__empty-actions">
                                            <Button variant="filled" onClick={() => setShowGridPicker(true)}>
                                                <Icon name="grid-3x3" size={16} />
                                                Create Grid Layout
                                            </Button>
                                        </div>
                                        <Typography variant="body-small" color="on-surface-variant" style={{ 'margin-top': '8px', opacity: '0.6' }}>
                                            Or drag a layout element from the sidebar
                                        </Typography>
                                    </>
                                }
                            >
                                <GridLayoutPicker onSelectColumns={handleGridSelect} />
                            </Show>
                        </Show>
                        <Show when={!local.isEmpty && local.placeholder}>
                            <div class="canvas-region__drop-cta">
                                <Icon name="plus" size={16} />
                                <Typography variant="body-small" color="on-surface-variant">{local.placeholder}</Typography>
                            </div>
                        </Show>
                    </div>
                }
            >
                <Index each={local.elements()}>
                    {(element, index) => (
                        <CanvasFieldRow
                            element={element()}
                            index={index}
                            parentId={local.parentId}
                            isSelected={selectedElement() === element().id || selectedElements().has(element().id)}
                            onSelect={(multi) => toggleSelectElement(element().id, multi)}
                            onRemove={() => {
                                removeElement(element().id);
                            }}
                            onCanvasDragStart={local.onCanvasDragStart}
                            onDragEnd={local.onDragEnd}
                            dragSource={local.dragSource}
                        />
                    )}
                </Index>
            </Show>
        </div>
    )
}
