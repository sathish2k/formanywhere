/**
 * Material 3 Avatar Component for SolidJS
 * Based on https://github.com/material-components/material-web
 */
import { JSX, Component, Show } from 'solid-js';

export interface AvatarProps {
    /** Image source */
    src?: string;
    /** Alt text */
    alt?: string;
    /** Initials to show when no image */
    initials?: string;
    /** Size */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    /** Custom icon when no image/initials */
    icon?: JSX.Element;
    /** Variant */
    variant?: 'circular' | 'rounded' | 'square';
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Click handler */
    onClick?: (e: MouseEvent) => void;
}

const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
};

const fontSizeMap = {
    xs: 10,
    sm: 12,
    md: 16,
    lg: 22,
    xl: 32,
};

const avatarStyles = (size: keyof typeof sizeMap, variant: string, clickable: boolean): JSX.CSSProperties => ({
    display: 'inline-flex',
    'align-items': 'center',
    'justify-content': 'center',
    width: `${sizeMap[size]}px`,
    height: `${sizeMap[size]}px`,
    'font-size': `${fontSizeMap[size]}px`,
    'font-weight': '500',
    'border-radius': variant === 'circular' ? '50%' : variant === 'rounded' ? '8px' : '0',
    background: 'var(--m3-color-primary-container, rgba(99, 102, 241, 0.12))',
    color: 'var(--m3-color-on-primary-container, #3730a3)',
    overflow: 'hidden',
    cursor: clickable ? 'pointer' : 'default',
    'user-select': 'none',
});

const defaultIcon = (
    <svg viewBox="0 0 24 24" fill="currentColor" width="60%" height="60%">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
);

export const Avatar: Component<AvatarProps> = (props) => {
    const size = props.size ?? 'md';
    const variant = props.variant ?? 'circular';

    return (
        <div
            style={{ ...avatarStyles(size, variant, !!props.onClick), ...props.style }}
            onClick={props.onClick}
        >
            <Show when={props.src} fallback={
                <Show when={props.initials} fallback={props.icon || defaultIcon}>
                    <span>{props.initials}</span>
                </Show>
            }>
                <img
                    src={props.src}
                    alt={props.alt || ''}
                    style={{ width: '100%', height: '100%', 'object-fit': 'cover' }}
                />
            </Show>
        </div>
    );
};

// Avatar Group
export interface AvatarGroupProps {
    /** Maximum avatars to show */
    max?: number;
    /** Avatar size */
    size?: AvatarProps['size'];
    /** Children avatars */
    children: JSX.Element;
    /** Custom style */
    style?: JSX.CSSProperties;
}

export const AvatarGroup: Component<AvatarGroupProps> = (props) => {
    return (
        <div style={{
            display: 'flex',
            'flex-direction': 'row-reverse',
            ...props.style,
        }}>
            {props.children}
        </div>
    );
};

export default Avatar;
