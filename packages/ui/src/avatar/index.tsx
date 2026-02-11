/**
 * Material 3 Avatar Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * CSS class-based styling with M3 design tokens
 */
import { JSX, Component, Show } from 'solid-js';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

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
    /** Shape variant */
    variant?: 'circular' | 'rounded' | 'square' | 'glass';
    /** Custom style */
    style?: JSX.CSSProperties;
    /** Custom class */
    class?: string;
    /** Click handler */
    onClick?: (e: MouseEvent) => void;
}

// ─── Component ──────────────────────────────────────────────────────────────────

const defaultIcon = (
    <svg viewBox="0 0 24 24" fill="currentColor" width="60%" height="60%">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
);

export const Avatar: Component<AvatarProps> = (props) => {

    const rootClass = () => {
        const classes = ['md-avatar'];
        classes.push(props.size ?? 'md');
        // Glass variant is circular by default
        if (props.variant === 'glass') {
            classes.push('circular', 'glass');
        } else {
            classes.push(props.variant ?? 'circular');
        }
        if (props.onClick) classes.push('clickable');
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <div
            class={rootClass()}
            style={props.style}
            onClick={props.onClick}
        >
            <Show when={props.src} fallback={
                <Show when={props.initials} fallback={props.icon || defaultIcon}>
                    <span>{props.initials}</span>
                </Show>
            }>
                <img
                    class="md-avatar__image"
                    src={props.src}
                    alt={props.alt || ''}
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
    /** Custom class */
    class?: string;
}

export const AvatarGroup: Component<AvatarGroupProps> = (props) => {

    const rootClass = () => {
        const classes = ['md-avatar-group'];
        if (props.class) classes.push(props.class);
        return classes.join(' ');
    };

    return (
        <div class={rootClass()} style={props.style}>
            {props.children}
        </div>
    );
};

export default Avatar;
