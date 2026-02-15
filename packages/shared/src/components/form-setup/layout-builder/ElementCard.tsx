/**
 * Layout Builder — Element Card
 * Wrapper around a placed element with selection / delete controls
 */
import { Component, Show, JSX } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Icon } from '@formanywhere/ui/icon';
import { Chip } from '@formanywhere/ui/chip';

export interface ElementCardProps {
    isSelected: boolean;
    label?: string;
    align?: 'left' | 'center' | 'right';
    onSelect: (e?: MouseEvent) => void;
    onRemove: (e?: MouseEvent) => void;
    children: JSX.Element;
}

export const ElementCard: Component<ElementCardProps> = (props) => {
    return (
        <div
            class="lb-element-card"
            classList={{ 'lb-element-card--selected': props.isSelected }}
            onClick={(e) => {
                e.stopPropagation();
                props.onSelect(e);
            }}
        >
            <Show when={props.label}>
                <div class="lb-element-card__badge">
                    <Chip variant="label" label={props.label!} size="sm" />
                </div>
            </Show>

            <div
                class="lb-element-card__controls"
                classList={{ 'lb-element-card__controls--visible': props.isSelected }}
            >
                <IconButton
                    variant="standard"
                    icon={<Icon name="grip-vertical" size={14} />}
                    aria-label="Drag"
                    class="lb-element-card__control-btn"
                />
                <IconButton
                    variant="standard"
                    icon={<Icon name="trash" size={14} />}
                    aria-label="Remove"
                    class="lb-element-card__control-btn lb-element-card__control-btn--delete"
                    onClick={(e) => {
                        e.stopPropagation();
                        props.onRemove(e);
                    }}
                />
            </div>

            <div
                class="lb-element-card__content"
                style={{
                    display: 'flex',
                    "justify-content": props.align === 'left' ? 'flex-start' : props.align === 'right' ? 'flex-end' : 'center',
                    "align-items": 'center',
                }}
            >
                {props.children}
            </div>
        </div>
    );
};
