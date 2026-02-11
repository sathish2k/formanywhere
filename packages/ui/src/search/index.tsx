/**
 * Material 3 Search Bar Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * CSS class-based styling with M3 design tokens
 */
import { JSX, Component, splitProps, Show } from 'solid-js';

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 SEARCH BAR
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-search-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    height: 56px;
    padding: 0 16px;
    border-radius: var(--m3-shape-full, 9999px);
    background: var(--m3-color-surface-container-high, rgba(236, 230, 240, 0.38));
    box-sizing: border-box;
    transition: background var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)),
                box-shadow var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-search-bar:focus-within {
    box-shadow: var(--m3-elevation-2, 0 2px 4px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.1));
}

/* ─── ICON SLOTS ──────────────────────────────────────────────────────────── */

.md-search-bar__leading,
.md-search-bar__trailing {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--m3-color-on-surface-variant, #49454F);
}

/* ─── INPUT ───────────────────────────────────────────────────────────────── */

.md-search-bar__input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: var(--m3-body-large-size, 16px);
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    color: var(--m3-color-on-surface, #1D1B20);
    padding: 0;
    min-width: 0;
}

.md-search-bar__input::placeholder {
    color: var(--m3-color-on-surface-variant, #49454F);
}

/* ─── LIQUID GLASS VARIANT ────────────────────────────────────────────────── */

.md-search-bar.glass {
    background: var(--glass-tint-medium, rgba(255, 255, 255, 0.5));
    backdrop-filter: blur(var(--glass-blur, 20px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 20px));
    border: 1px solid var(--glass-border-subtle, rgba(255, 255, 255, 0.2));
}

.md-search-bar.glass:focus-within {
    background: var(--glass-tint-light, rgba(255, 255, 255, 0.7));
    border-color: var(--glass-border-medium, rgba(255, 255, 255, 0.4));
    box-shadow: var(--glass-shadow, 0 8px 32px rgba(0, 0, 0, 0.08));
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-search', '');
    style.textContent = css;
    document.head.appendChild(style);
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface SearchBarProps {
    /** Current value */
    value?: string;
    /** Placeholder text */
    placeholder?: string;
    /** Leading icon slot */
    leadingIcon?: JSX.Element;
    /** Trailing icon slot */
    trailingIcon?: JSX.Element;
    /** Change handler */
    onChange?: (value: string) => void;
    /** Search handler (alias for onChange) */
    onSearch?: (value: string) => void;
    /** Disabled */
    disabled?: boolean;
    /** Visual variant */
    variant?: 'standard' | 'glass';
    /** HTML id */
    id?: string;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────────

const defaultSearchIcon = (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
);

export const SearchBar: Component<SearchBarProps> = (props) => {
    const [local, others] = splitProps(props, [
        'value', 'placeholder', 'leadingIcon', 'trailingIcon',
        'onChange', 'onSearch', 'disabled', 'variant', 'id', 'style', 'class'
    ]);

    injectStyles();

    const handleChange = (value: string) => {
        local.onChange?.(value);
        local.onSearch?.(value);
    };

    const rootClass = () => {
        const classes = ['md-search-bar'];
        if (local.variant === 'glass') classes.push('glass');
        if (local.class) classes.push(local.class);
        return classes.join(' ');
    };

    return (
        <div class={rootClass()} style={local.style} id={local.id}>
            <div class="md-search-bar__leading">
                {local.leadingIcon || defaultSearchIcon}
            </div>
            <input
                type="search"
                class="md-search-bar__input"
                value={local.value ?? ''}
                placeholder={local.placeholder ?? 'Search'}
                disabled={local.disabled}
                onInput={(e) => handleChange(e.currentTarget.value)}
            />
            <Show when={local.trailingIcon}>
                <div class="md-search-bar__trailing">
                    {local.trailingIcon}
                </div>
            </Show>
        </div>
    );
};

export default SearchBar;
