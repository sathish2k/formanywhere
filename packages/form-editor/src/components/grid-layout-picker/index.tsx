/**
 * GridLayoutPicker — Inline column selection
 * Matches the InlineGridSelector from the AI-Powered Form Builder reference.
 *
 * Shows 3 cards (1/2/3 columns) with:
 *   - Staggered fade-in + scale animation on mount
 *   - Hover: scale 1.05, primary border, elevated shadow
 *   - Visual bar preview showing column proportions
 */
import { splitProps, For, createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import { Icon } from '@formanywhere/ui/icon';
import { Typography } from '@formanywhere/ui/typography';
import './grid-layout-picker.scss';

const LAYOUT_OPTIONS = [
    {
        columns: 1,
        icon: 'square' as const,
        label: '1 Column',
        description: 'Full width',
        preview: [12],
    },
    {
        columns: 2,
        icon: 'columns' as const,
        label: '2 Columns',
        description: 'Equal split',
        preview: [6, 6],
    },
    {
        columns: 3,
        icon: 'grid-3x3' as const,
        label: '3 Columns',
        description: 'Equal split',
        preview: [4, 4, 4],
    },
];

export interface GridLayoutPickerProps {
    onSelectColumns: (columns: number) => void;
}

export const GridLayoutPicker: Component<GridLayoutPickerProps> = (props) => {
    const [local] = splitProps(props, ['onSelectColumns']);
    const [hoveredId, setHoveredId] = createSignal<number | null>(null);

    return (
        <div class="grid-layout-picker">
            <Typography variant="title-medium" class="grid-layout-picker__heading">
                Choose your layout
            </Typography>

            <div class="grid-layout-picker__options">
                <For each={LAYOUT_OPTIONS}>
                    {(option, index) => (
                        <div
                            class="grid-layout-picker__card"
                            classList={{
                                'grid-layout-picker__card--hovered': hoveredId() === option.columns,
                            }}
                            style={{ 'animation-delay': `${index() * 0.1}s` }}
                            onMouseEnter={() => setHoveredId(option.columns)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => local.onSelectColumns(option.columns)}
                        >
                            {/* Icon box */}
                            <div class="grid-layout-picker__icon-box">
                                <Icon name={option.icon} size={28} />
                            </div>

                            {/* Label */}
                            <Typography variant="title-small" class="grid-layout-picker__label">
                                {option.label}
                            </Typography>

                            {/* Description */}
                            <Typography variant="body-small" color="on-surface-variant" class="grid-layout-picker__desc">
                                {option.description}
                            </Typography>

                            {/* Visual bar preview */}
                            <div class="grid-layout-picker__preview">
                                <For each={option.preview}>
                                    {(width) => (
                                        <div
                                            class="grid-layout-picker__bar"
                                            style={{ flex: width }}
                                        />
                                    )}
                                </For>
                            </div>
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
};
