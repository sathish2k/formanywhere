/**
 * Logo Component
 * Brand logo with optional text for FormAnywhere
 */
import { Component, Show } from 'solid-js';
import { Stack } from '@formanywhere/ui/stack';
import { Typography } from '@formanywhere/ui/typography';
import { Box } from '@formanywhere/ui/box';
import LogoIcon from '../../../icons/svg/logo-icon.svg';

export interface LogoProps {
    showText?: boolean;
    class?: string;
}

export const Logo: Component<LogoProps> = (props) => {
    return (
        <a
            href="/"
            class={props.class || ''}
            style={{
                display: 'inline-flex',
                'align-items': 'center',
                gap: '12px',
                'text-decoration': 'none',
                transition: 'all 300ms ease',
            }}
        >
            <Box
                rounded="md"
                display="flex"
                style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, var(--m3-color-primary, #00A76F), color-mix(in srgb, var(--m3-color-primary, #00A76F) 85%, black))',
                    'align-items': 'center',
                    'justify-content': 'center',
                }}
            >
                <LogoIcon
                    width={20}
                    height={20}
                    style={{ color: 'var(--m3-color-on-primary)' }}
                />
            </Box>
            <Show when={props.showText !== false}>
                <Typography
                    variant="title-medium"
                    color="on-surface"
                    style={{ 'font-weight': '600' }}
                >
                    FormAnywhere
                </Typography>
            </Show>
        </a>
    );
};

export default Logo;
