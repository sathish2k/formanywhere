/**
 * Layout Builder — Drop Zone
 * Header/Footer drop zone for element placement
 */
import { Component, For, Show, JSX } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Chip } from '@formanywhere/ui/chip';
import { Icon } from '@formanywhere/ui/icon';
import type { LayoutElement } from './types';

export interface DropZoneProps {
    zone: 'header' | 'footer';
    elements: LayoutElement[];
    onDragOver: (e: DragEvent) => void;
    onDrop: (e: DragEvent, target: 'header' | 'footer') => void;
    renderElement: (element: LayoutElement) => JSX.Element;
}

export const DropZone: Component<DropZoneProps> = (props) => {
    return (
        <div
            class="lb-dropzone"
            classList={{ 'lb-dropzone--has-elements': props.elements.length > 0 }}
            onDragOver={(e) => props.onDragOver(e)}
            onDrop={(e) => props.onDrop(e, props.zone)}
        >
            <div class="lb-dropzone__header">
                <Chip
                    variant="label"
                    label={props.zone.toUpperCase()}
                    size="sm"
                    color="primary"
                />
                <Typography variant="label-small" color="secondary">
                    Drag elements here for {props.zone} section
                </Typography>
            </div>

            <Show
                when={props.elements.length > 0}
                fallback={
                    <div class="lb-dropzone__empty">
                        <Icon name="move" size={48} color="var(--m3-color-outline)" style={{ opacity: 0.3 }} />
                        <Typography variant="body-small" color="secondary" align="center">
                            Drag elements from the left sidebar
                            <br />
                            to add them to the {props.zone}
                        </Typography>
                    </div>
                }
            >
                <For each={props.elements}>
                    {(element) => props.renderElement(element)}
                </For>
            </Show>
        </div>
    );
};
