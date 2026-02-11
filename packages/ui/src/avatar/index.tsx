/**
 * Material 3 Avatar Component for SolidJS
 * Based on https://github.com/material-components/material-web
 *
 * CSS class-based styling with M3 design tokens
 */
import { JSX, Component, Show } from 'solid-js';

// ─── Styles (injected once) ─────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
    if (stylesInjected || typeof document === 'undefined') return;
    stylesInjected = true;

    const css = `
/* ═══════════════════════════════════════════════════════════════════════════════
   M3 AVATAR
   ═══════════════════════════════════════════════════════════════════════════════ */

.md-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    overflow: hidden;
    user-select: none;
    font-family: var(--m3-font-body, 'Inter', system-ui, sans-serif);
    background: var(--m3-color-primary-container, rgba(99, 102, 241, 0.12));
    color: var(--m3-color-on-primary-container, #3730a3);
    flex-shrink: 0;
}

/* ─── SIZE MODIFIERS ──────────────────────────────────────────────────────── */

.md-avatar.xs  { width: 24px; height: 24px; font-size: 10px; }
.md-avatar.sm  { width: 32px; height: 32px; font-size: 12px; }
.md-avatar.md  { width: 40px; height: 40px; font-size: 16px; }
.md-avatar.lg  { width: 56px; height: 56px; font-size: 22px; }
.md-avatar.xl  { width: 80px; height: 80px; font-size: 32px; }

/* ─── SHAPE MODIFIERS ─────────────────────────────────────────────────────── */

.md-avatar.circular { border-radius: var(--m3-shape-full, 9999px); }
.md-avatar.rounded  { border-radius: var(--m3-shape-small, 8px); }
.md-avatar.square   { border-radius: 0; }

/* ─── CLICKABLE ───────────────────────────────────────────────────────────── */

.md-avatar.clickable {
    cursor: pointer;
    transition: opacity var(--m3-motion-duration-short, 150ms) var(--m3-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
}

.md-avatar.clickable:hover {
    opacity: 0.88;
}

/* ─── IMAGE ───────────────────────────────────────────────────────────────── */

.md-avatar__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ─── LIQUID GLASS VARIANT ────────────────────────────────────────────────── */

.md-avatar.glass {
    background: var(--glass-tint-medium, rgba(255, 255, 255, 0.5));
    backdrop-filter: blur(var(--glass-blur-subtle, 12px));
    -webkit-backdrop-filter: blur(var(--glass-blur-subtle, 12px));
    border: 1px solid var(--glass-border-subtle, rgba(255, 255, 255, 0.2));
    color: var(--m3-color-on-surface, #1D1B20);
}

/* ─── AVATAR GROUP ────────────────────────────────────────────────────────── */

.md-avatar-group {
    display: flex;
    flex-direction: row-reverse;
}

.md-avatar-group > .md-avatar {
    margin-left: -8px;
    border: 2px solid var(--m3-color-surface, #FDF8FD);
}

.md-avatar-group > .md-avatar:last-child {
    margin-left: 0;
}
`;

    const style = document.createElement('style');
    style.setAttribute('data-md-avatar', '');
    style.textContent = css;
    document.head.appendChild(style);
}

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
    injectStyles();

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
    injectStyles();

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
