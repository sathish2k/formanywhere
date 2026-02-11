/**
 * Material 3 Segmented Button Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * CSS class-based styling with M3 design tokens
 */
import { JSX, Component, For, splitProps } from 'solid-js';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface Segment {
    value: string;
    label: string;
    icon?: JSX.Element;
    disabled?: boolean;
}

export interface SegmentedButtonProps {
    /** Segments to display */
    segments?: Segment[];
    /** Alias for segments (backward compat) */
    options?: Segment[];
    /** Currently selected value(s) */
    value: string | string[];
    /** Selection changed handler */
    onChange: (value: string) => void;
    /** Allow multiple selection */
    multiSelect?: boolean;
    /** Show checkmark on selected segment */
    showCheckmark?: boolean;
    /** Visual variant */
    variant?: 'standard' | 'glass';
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────────

const checkmarkIcon = (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
);

export const SegmentedButton: Component<SegmentedButtonProps> = (props) => {
    const [local, others] = splitProps(props, [
        'segments', 'options', 'value', 'onChange', 'multiSelect',
        'showCheckmark', 'variant', 'style', 'class'
    ]);

    const resolvedSegments = () => local.segments ?? local.options ?? [];

    const isSelected = (value: string): boolean => {
        if (Array.isArray(local.value)) return local.value.includes(value);
        return local.value === value;
    };

    const rootClass = () => {
        const classes = ['md-segmented-button'];
        if (local.variant === 'glass') classes.push('glass');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    return (
        <div role="group" class={rootClass()} style={local.style}>
            <For each={resolvedSegments()}>
                {(seg) => {
                    const selected = () => isSelected(seg.value);
                    const segClass = () => {
                        const classes = ['md-segmented-button__segment'];
                        if (selected()) classes.push('selected');
                        return classes.join(' ');
                    };

                    return (
                        <button
                            class={segClass()}
                            disabled={seg.disabled}
                            aria-pressed={selected()}
                            onClick={() => local.onChange(seg.value)}
                            type="button"
                        >
                            {local.showCheckmark !== false && selected() && (
                                <span class="md-segmented-button__check">{checkmarkIcon}</span>
                            )}
                            {seg.icon && <span class="md-segmented-button__icon">{seg.icon}</span>}
                            {seg.label}
                        </button>
                    );
                }}
            </For>
        </div>
    );
};

export default SegmentedButton;
