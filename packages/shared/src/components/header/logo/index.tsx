/**
 * Logo Component
 * Brand logo with optional text for FormAnywhere
 */
import { Component, Show } from 'solid-js';
import { HStack } from '@formanywhere/ui/stack';
import { Typography } from '@formanywhere/ui/typography';
import { Box } from '@formanywhere/ui/box';

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
                    background: 'linear-gradient(135deg, var(--m3-color-primary, #00A76F), var(--m3-color-primary-dark, #007867))',
                    'align-items': 'center',
                    'justify-content': 'center',
                }}
            >
                <img
                    src="/icons/logo-icon.svg"
                    alt="FormAnywhere Logo"
                    style={{ width: '20px', height: '20px', color: 'white' }}
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
