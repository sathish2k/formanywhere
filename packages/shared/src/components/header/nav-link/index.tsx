/**
 * NavLink Component
 * Navigation link with hover effects for header
 */
import { Component } from 'solid-js';

export interface NavLinkProps {
    href: string;
    children: any;
    class?: string;
    variant?: 'default' | 'on-dark';
}

export const NavLink: Component<NavLinkProps> = (props) => {
    const baseColor = () => props.variant === 'on-dark'
        ? 'rgba(255, 255, 255, 0.7)'
        : 'var(--m3-color-on-surface-variant, #49454F)';
    const hoverColor = () => props.variant === 'on-dark'
        ? 'var(--m3-color-on-primary, #FFFFFF)'
        : 'var(--m3-color-on-surface, #1C1B1F)';

    return (
        <a
            href={props.href}
            class={`text-on-surface-variant hover:text-on-surface font-medium text-[15px] transition-colors whitespace-nowrap ${props.class || ''}`}
            style={{
                color: baseColor(),
                'font-weight': '500',
                'text-decoration': 'none',
                'font-size': '15px',
                transition: 'color 150ms ease',
                'white-space': 'nowrap',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = hoverColor(); }}
            onMouseLeave={(e) => { e.currentTarget.style.color = baseColor(); }}
        >
            {props.children}
        </a>
    );
};

export default NavLink;
