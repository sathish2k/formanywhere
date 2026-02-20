/**
 * Footer Component - SolidJS implementation
 * Using UI library components from packages/ui
 */
import { Component, For } from 'solid-js';
import { Box } from '@formanywhere/ui/box';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Divider } from '@formanywhere/ui/divider';
import { Stack } from '@formanywhere/ui/stack';
import SparkleIcon from '../../icons/svg/sparkle.svg';
import TwitterIcon from '../../icons/svg/twitter.svg';

// Inline GitHub SVG to avoid a separate JS chunk
const GithubIcon = (props: Record<string, any>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        width={props.width}
        height={props.height}
        style={props.style}
        aria-hidden="true"
    >
        <path
            fill-rule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clip-rule="evenodd"
        />
    </svg>
);

interface FooterSection {
    title: string;
    links: { label: string; href: string }[];
}

const sections: FooterSection[] = [
    {
        title: 'Product',
        links: [
            { label: 'Features', href: '#features' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'Templates', href: '/templates' },
            { label: 'Integrations', href: '#integrations' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About', href: '/about' },
            { label: 'Blog', href: '/blog' },
            { label: 'Careers', href: '/careers' },
            { label: 'Contact', href: '/contact' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { label: 'Documentation', href: '/docs' },
            { label: 'Help Center', href: '/help' },
            { label: 'API Reference', href: '/api' },
            { label: 'Status', href: '/status' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
            { label: 'Security', href: '/security' },
        ],
    },
];

export interface FooterProps {
    class?: string;
}

export const Footer: Component<FooterProps> = (props) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            role="contentinfo"
            style={{
                position: 'relative',
                overflow: 'hidden',
                'background-color': 'var(--grey-900, #141A21)',
                color: 'var(--grey-100, #F9FAFB)',
            }}
            class={props.class || ''}
        >
            {/* Subtle glass texture overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: '0',
                    opacity: '0.3',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
                }}
            />

            <Box
                maxWidth="7xl"
                marginX="auto"
                paddingX="lg"
                paddingY="xl"
                style={{ position: 'relative' }}
            >
                {/* Top Section */}
                <div style={{
                    display: 'grid',
                    'grid-template-columns': 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '32px',
                    'margin-bottom': '48px',
                }}>
                    {/* Brand */}
                    <Stack direction="column" gap="md">
                        <a
                            href="/"
                            style={{
                                display: 'inline-flex',
                                'align-items': 'center',
                                gap: '8px',
                                'text-decoration': 'none',
                            }}
                        >
                            <Box
                                rounded="md"
                                display="flex"
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    background: 'linear-gradient(to right, var(--m3-color-primary), var(--m3-color-secondary))',
                                    'align-items': 'center',
                                    'justify-content': 'center',
                                }}
                            >
                                <SparkleIcon
                                    width={20}
                                    height={20}
                                    style={{ filter: 'brightness(0) invert(1)' }}
                                    aria-hidden="true"
                                />
                            </Box>
                            <Typography
                                variant="title-medium"
                                as="span"
                                style={{ color: 'var(--grey-100, #F9FAFB)', 'font-weight': '700' }}
                            >
                                FormAnywhere
                            </Typography>
                        </a>
                        <Typography
                            variant="body-small"
                            style={{ color: 'color-mix(in srgb, var(--grey-100, #F9FAFB) 70%, transparent)' }}
                        >
                            Build powerful forms that work offline. Collect data anywhere, sync
                            when connected.
                        </Typography>
                    </Stack>

                    {/* Links */}
                    <For each={sections}>
                        {(section) => (
                            <nav aria-label={section.title}>
                                <Typography
                                    variant="label-large"
                                    style={{
                                        color: 'var(--grey-100, #F9FAFB)',
                                        'font-weight': '600',
                                        'margin-bottom': '16px',
                                        display: 'block',
                                    }}
                                >
                                    {section.title}
                                </Typography>
                                <Stack direction="column" gap="xs">
                                    <For each={section.links}>
                                        {(link) => (
                                            <Button
                                                href={link.href}
                                                variant="text"
                                                style={{
                                                    color: 'color-mix(in srgb, var(--grey-100, #F9FAFB) 70%, transparent)',
                                                    'font-size': '14px',
                                                    padding: '4px 0',
                                                    'min-height': 'auto',
                                                    'justify-content': 'flex-start',
                                                }}
                                            >
                                                {link.label}
                                            </Button>
                                        )}
                                    </For>
                                </Stack>
                            </nav>
                        )}
                    </For>
                </div>

                {/* Bottom Section */}
                <Divider style={{ background: 'color-mix(in srgb, var(--grey-100, #F9FAFB) 15%, transparent)' }} />
                <Stack
                    direction="row"
                    justify="between"
                    align="center"
                    gap="md"
                    style={{
                        'padding-top': '24px',
                        'flex-wrap': 'wrap',
                    }}
                >
                    <Typography
                        variant="body-small"
                        style={{ color: 'color-mix(in srgb, var(--grey-100, #F9FAFB) 70%, transparent)' }}
                    >
                        © {currentYear} FormAnywhere. All rights reserved.
                    </Typography>
                    <Stack direction="row" gap="sm" align="center">
                        <IconButton
                            href="https://twitter.com"
                            aria-label="Twitter"
                            icon={
                                <TwitterIcon
                                    width={20}
                                    height={20}
                                    style={{ filter: 'brightness(0) invert(0.7)' }}
                                />
                            }
                            style={{ color: 'color-mix(in srgb, var(--grey-100, #F9FAFB) 70%, transparent)' }}
                        />
                        <IconButton
                            href="https://github.com"
                            aria-label="GitHub"
                            icon={
                                <GithubIcon
                                    width={20}
                                    height={20}
                                    style={{ filter: 'brightness(0) invert(0.7)' }}
                                />
                            }
                            style={{ color: 'color-mix(in srgb, var(--grey-100, #F9FAFB) 70%, transparent)' }}
                        />
                    </Stack>
                </Stack>
            </Box>
        </footer>
    );
};

export default Footer;

