/**
 * Material 3 Segmented Button Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * CSS class-based styling with M3 design tokens
 */
import { JSX, Component, For, splitProps } from 'solid-js';

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 SEGMENTED BUTTON
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-segmented-button {
    display: inline-flex;
    border: 1px solid var(--m3-color-outline, rgba(120, 117, 121, 0.4));
    border-radius: var(--m3-shape-full, 9999px);
    overflow: hidden;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
}

/* ─── SEGMENT ─────────────────────────────────────────────────────────────── */

.md-segmented-button__segment {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex: 1;
    padding: 10px 24px;
    min-height: 40px;
    border: none;
    border-right: 1px solid var(--m3-color-outline, rgba(120, 117, 121, 0.4));
    background: transparent;
    color: var(--m3-color-on-surface, #1D1B20);
    font-size: var(--m3-label-large-size, 14px);
    font-weight: 500;
    cursor: pointer;
    transition: background var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
                color var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
    font-family: inherit;
}

.md-segmented-button__segment:last-child {
    border-right: none;
}

.md-segmented-button__segment:hover {
    background: color-mix(in srgb, var(--m3-color-on-surface) 8%, transparent);
}

.md-segmented-button__segment.selected {
    background: var(--m3-color-secondary-container, rgba(232, 222, 248, 0.38));
    color: var(--m3-color-on-secondary-container, #1D192B);
}

.md-segmented-button__segment.selected:hover {
    background: color-mix(in srgb, var(--m3-color-on-secondary-container) 8%, var(--m3-color-secondary-container, rgba(232, 222, 248, 0.38)));
}

.md-segmented-button__segment:disabled {
    opacity: 0.38;
    cursor: default;
    pointer-events: none;
}

/* ─── CHECKMARK in selected ───────────────────────────────────────────────── */

.md-segmented-button__check {
    display: none;
    width: 18px;
    height: 18px;
}

.md-segmented-button__segment.selected .md-segmented-button__check {
    display: inline-flex;
}

/* ─── ICON SLOT ───────────────────────────────────────────────────────────── */

.md-segmented-button__icon {
    display: inline-flex;
    width: 18px;
    height: 18px;
}

/* ─── LIQUID GLASS VARIANT ────────────────────────────────────────────────── */

.md-segmented-button.glass {
    border-color: var(--glass-border-medium, rgba(255, 255, 255, 0.4));
    background: var(--glass-tint-subtle, rgba(255, 255, 255, 0.3));
    backdrop-filter: blur(var(--glass-blur-subtle, 12px));
    -webkit-backdrop-filter: blur(var(--glass-blur-subtle, 12px));
}

.md-segmented-button.glass .md-segmented-button__segment {
    border-color: var(--glass-border-subtle, rgba(255, 255, 255, 0.2));
}

.md-segmented-button.glass .md-segmented-button__segment.selected {
    background: var(--glass-tint-light, rgba(255, 255, 255, 0.7));
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-segmented-button', '');
    style.textContent = css;
    document.head.appendChild(style);
}

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

    injectStyles();

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
