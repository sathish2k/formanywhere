/**
 * Material 3 Segmented Button Component for SolidJS
 */
import { JSX, Component, For, createMemo } from 'solid-js';
import { Ripple } from '../ripple';

export interface SegmentedButtonOption {
    label?: string;
    value: string | number;
    icon?: JSX.Element;
    disabled?: boolean;
}

export interface SegmentedButtonProps {
    /** Options */
    options: SegmentedButtonOption[];
    /** Selected value(s) */
    value?: string | number | (string | number)[];
    /** Change handler */
    onChange?: (value: string | number | (string | number)[]) => void;
    /** Multi-select mode */
    multi?: boolean;
    /** Custom style */
    style?: JSX.CSSProperties;
}

export const SegmentedButton: Component<SegmentedButtonProps> = (props) => {
    const isSelected = (val: string | number) => {
        if (props.multi && Array.isArray(props.value)) {
            return props.value.includes(val);
        }
        return props.value === val;
    };

    const handleSelect = (val: string | number) => {
        if (props.multi) {
            const current = Array.isArray(props.value) ? [...props.value] : [];
            const idx = current.indexOf(val);
            if (idx >= 0) {
                current.splice(idx, 1);
            } else {
                current.push(val);
            }
            props.onChange?.(current);
        } else {
            props.onChange?.(val);
        }
    };

    const containerStyle: JSX.CSSProperties = {
        display: 'inline-flex',
        border: '1px solid var(--m3-color-outline, #79747e)',
        'border-radius': '20px',
        overflow: 'hidden',
        height: '40px',
        ...props.style
    };

    return (
        <div style={containerStyle} role="group">
            <For each={props.options}>
                {(option, index) => {
                    const selected = isSelected(option.value);
                    const isLast = index() === props.options.length - 1;

                    return (
                        <div
                            style={{
                                display: 'flex',
                                'align-items': 'center',
                                'justify-content': 'center',
                                padding: '0 12px',
                                background: selected ? 'var(--m3-color-secondary-container, #e8def8)' : 'transparent',
                                color: selected ? 'var(--m3-color-on-secondary-container, #1d192b)' : 'var(--m3-color-on-surface, #1d1b20)',
                                'border-right': isLast ? 'none' : '1px solid var(--m3-color-outline, #79747e)',
                                cursor: option.disabled ? 'not-allowed' : 'pointer',
                                opacity: option.disabled ? 0.38 : 1,
                                'font-family': 'var(--m3-font-label, Roboto, sans-serif)',
                                'font-size': '14px',
                                'font-weight': '500',
                                position: 'relative',
                                'min-width': '48px',
                                gap: '8px'
                            }}
                            onClick={() => !option.disabled && handleSelect(option.value)}
                        >
                            {selected && (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                            )}
                            {!selected && option.icon}
                            {option.label}
                            <Ripple disabled={option.disabled} />
                        </div>
                    );
                }}
            </For>
        </div>
    );
};
