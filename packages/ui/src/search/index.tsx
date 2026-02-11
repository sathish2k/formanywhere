/**
 * Material 3 Search Bar Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * CSS class-based styling with M3 design tokens
 */
import { JSX, Component, splitProps, Show } from 'solid-js';
import './styles.scss';

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
