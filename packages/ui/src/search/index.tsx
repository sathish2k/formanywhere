/**
 * Material 3 Search Bar Component for SolidJS
 */
import { JSX, Component, splitProps } from 'solid-js';
import { Ripple } from '../ripple';

export interface SearchBarProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'style'> {
    /** Leading icon (default: search icon) */
    leadingIcon?: JSX.Element;
    /** Trailing icon (e.g. avatar, mic) */
    trailingIcon?: JSX.Element;
    /** Custom style */
    style?: JSX.CSSProperties;
    /** On search submit handler */
    onSearch?: (value: string) => void;
}

export const SearchBar: Component<SearchBarProps> = (props) => {
    const [local, others] = splitProps(props, ['leadingIcon', 'trailingIcon', 'style', 'onSearch', 'value']);

    const containerStyles: JSX.CSSProperties = {
        display: 'flex',
        'align-items': 'center',
        height: '56px',
        background: 'var(--m3-color-surface-container-high, #ece6f0)',
        'border-radius': '28px',
        padding: '0 16px',
        gap: '12px',
        color: 'var(--m3-color-on-surface, #1d1b20)',
        'max-width': '720px', // Standard max width
        width: '100%',
        'box-shadow': 'var(--m3-elevation-1)',
        position: 'relative',
        ...local.style
    };

    const inputStyles: JSX.CSSProperties = {
        border: 'none',
        background: 'transparent',
        outline: 'none',
        'font-size': '16px',
        'font-family': 'var(--m3-font-body, Roboto, sans-serif)',
        color: 'inherit',
        flex: 1,
        height: '100%',
        'padding': 0,
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && local.onSearch) {
            local.onSearch((e.currentTarget as HTMLInputElement).value);
        }
    };

    return (
        <div style={containerStyles} role="search">
            <div style={{ display: 'flex', 'align-items': 'center', 'justify-content': 'center', color: 'var(--m3-color-on-surface, #1d1b20)' }}>
                {local.leadingIcon || (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                )}
            </div>

            <input
                {...others}
                value={local.value}
                style={inputStyles}
                onKeyDown={handleKeyDown}
            />

            {local.trailingIcon && (
                <div style={{ display: 'flex', 'align-items': 'center', 'justify-content': 'center', color: 'var(--m3-color-on-surface-variant, #49454f)' }}>
                    {local.trailingIcon}
                </div>
            )}
        </div>
    );
};
