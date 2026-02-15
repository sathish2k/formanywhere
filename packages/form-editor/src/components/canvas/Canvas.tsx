/**
 * Canvas — Form canvas with drop zones and real element rendering.
 * Uses native HTML5 drag-and-drop for toolbar→canvas and in-canvas reordering.
 */
import type { Component } from 'solid-js';
import type { Accessor } from 'solid-js';
import { useFormEditor } from '../FormEditor';
import { CanvasRegion } from './CanvasRegion';
import '../../styles.scss';

export const Canvas: Component<{
    onCanvasDragStart?: (id: string) => void;
    onDrop?: (targetIndex?: number) => void;
    onDragEnd?: () => void;
    dragSource: Accessor<'toolbar' | 'canvas' | null>;
}> = (props) => {
    const { pageElements, clearSelection } = useFormEditor();

    return (
        <div class="form-canvas" onClick={() => clearSelection()}>
            <div class="form-canvas__root-region">
                <CanvasRegion
                    elements={pageElements}
                    parentId={null}
                    dragSource={props.dragSource}
                    onCanvasDragStart={props.onCanvasDragStart}
                    onDragEnd={props.onDragEnd}
                    isEmpty={pageElements().length === 0}
                />
            </div>
        </div>
    );
};
