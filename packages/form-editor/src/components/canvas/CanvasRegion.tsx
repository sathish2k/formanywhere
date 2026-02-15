import { For, createSignal, type Accessor, Show, Index } from 'solid-js';
import type { Component } from 'solid-js';
import { useFormEditor } from '../FormEditor';
import { CanvasFieldRow } from './CanvasFieldRow';
import type { FormElement } from '@formanywhere/shared/types';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { GridLayoutPicker } from '../grid-layout-picker';
import '../../styles.scss';

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
    const { addElement, moveElement, selectedElement, setSelectedElement, removeElement } = useFormEditor();
    const [isDragOver, setIsDragOver] = createSignal(false);
    const [showGridPicker, setShowGridPicker] = createSignal(false);

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Only allow drop if we are dragging something valid
        const hasType = e.dataTransfer?.types.includes('application/x-form-type');
        const hasId = e.dataTransfer?.types.includes('application/x-form-id');

        if (hasType || hasId) {
            const effect = props.dragSource() === 'toolbar' ? 'copy' : 'move';
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
            // Add new element to the end of this region
            addElement(newType as any, props.parentId);
        } else if (existingId) {
            // Move existing element to the end of this region
            moveElement(existingId, props.parentId, props.elements().length);
        }
    };

    const handleGridSelect = (cols: number) => {
        addElement('grid', props.parentId); // We might need to handle cols config here later
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
        // The `CanvasFieldRow` in this file is just deferring to `props.onDrop`.
    };

    return (
        <div
            class="canvas-region"
            classList={{
                'canvas-region--drag-over': isDragOver(),
                'canvas-region--empty': props.elements().length === 0 && !props.isEmpty
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ 'min-height': '50px', 'height': '100%' }} // Ensure drop target has size
        >
            <Show
                when={props.elements().length > 0}
                fallback={
                    <div class="canvas-region__empty-placeholder">
                        <Show when={props.isEmpty}>
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
                                            Drag elements from the left panel or click below
                                        </Typography>
                                        <div class="form-canvas__empty-actions">
                                            <Button variant="filled" onClick={() => setShowGridPicker(true)}>
                                                <Icon name="grid-3x3" size={16} />
                                                Create Grid Layout
                                            </Button>
                                            <Button variant="outlined" onClick={() => addElement('text', props.parentId)}>
                                                <Icon name="type" size={16} />
                                                Add Text Field
                                            </Button>
                                        </div>
                                    </>
                                }
                            >
                                <GridLayoutPicker onSelectColumns={handleGridSelect} />
                            </Show>
                        </Show>
                        <Show when={!props.isEmpty && props.placeholder}>
                            <Typography variant="body-small" color="on-surface-variant">{props.placeholder}</Typography>
                        </Show>
                    </div>
                }
            >
                <Index each={props.elements()}>
                    {(element, index) => (
                        <CanvasFieldRow
                            element={element()}
                            index={index}
                            parentId={props.parentId}
                            isSelected={selectedElement() === element().id}
                            onSelect={() => setSelectedElement(element().id)}
                            onRemove={() => {
                                removeElement(element().id);
                                setSelectedElement(null);
                            }}
                            onCanvasDragStart={props.onCanvasDragStart}
                            onDragEnd={props.onDragEnd}
                            dragSource={props.dragSource}
                        />
                    )}
                </Index>
            </Show>
        </div>
    )
}
