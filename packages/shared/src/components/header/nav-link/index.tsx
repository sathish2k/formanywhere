/**
 * NavLink Component
 * Navigation link with hover effects for header
 */
import { Component } from 'solid-js';
import { Button } from '@formanywhere/ui/button';

export interface NavLinkProps {
    href: string;
    children: any;
    class?: string;
    variant?: 'default' | 'on-dark';
}

export const NavLink: Component<NavLinkProps> = (props) => {
    return (
        <Button
            href={props.href}
            variant="text"
            class={props.class}
            style={{
                color: props.variant === 'on-dark'
                    ? 'rgba(255, 255, 255, 0.8)'
                    : 'var(--m3-color-on-surface-variant, #49454F)',
                'font-weight': '500',
                'font-size': '15px',
                padding: '8px 12px',
                'min-height': 'auto',
            }}
        >
            {props.children}
        </Button>
    );
};

export default NavLink;
