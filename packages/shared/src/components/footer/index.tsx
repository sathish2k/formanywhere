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
import { HStack, VStack } from '@formanywhere/ui/stack';
import SparkleIcon from '../../icons/svg/sparkle.svg';
import TwitterIcon from '../../icons/svg/twitter.svg';
import GithubIcon from '../../icons/svg/github.svg';

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
            class={`relative overflow-hidden ${props.class || ''}`}
            role="contentinfo"
            style={{
                'background-color': 'var(--color-on-surface, #1C1B1F)',
                color: 'white',
            }}
        >
            {/* Subtle glass texture overlay */}
            <div
                class="absolute inset-0 opacity-30"
                style="background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%);"
            />

            <Box
                maxWidth="7xl"
                marginX="auto"
                paddingX="lg"
                paddingY="xl"
                style={{ position: 'relative' }}
            >
                {/* Top Section */}
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                    {/* Brand */}
                    <VStack gap="md" class="col-span-1 sm:col-span-2 md:col-span-1">
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
                                style={{ color: 'white', 'font-weight': '700' }}
                            >
                                FormAnywhere
                            </Typography>
                        </a>
                        <Typography
                            variant="body-small"
                            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                            Build powerful forms that work offline. Collect data anywhere, sync
                            when connected.
                        </Typography>
                    </VStack>

                    {/* Links */}
                    <For each={sections}>
                        {(section) => (
                            <nav aria-label={section.title}>
                                <Typography
                                    variant="label-large"
                                    style={{
                                        color: 'white',
                                        'font-weight': '600',
                                        'margin-bottom': '16px',
                                        display: 'block',
                                    }}
                                >
                                    {section.title}
                                </Typography>
                                <VStack gap="xs">
                                    <For each={section.links}>
                                        {(link) => (
                                            <Button
                                                href={link.href}
                                                variant="text"
                                                style={{
                                                    color: 'rgba(255, 255, 255, 0.7)',
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
                                </VStack>
                            </nav>
                        )}
                    </For>
                </div>

                {/* Bottom Section */}
                <Divider style={{ background: 'rgba(255, 255, 255, 0.15)' }} />
                <HStack
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
                        style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    >
                        © {currentYear} FormAnywhere. All rights reserved.
                    </Typography>
                    <HStack gap="sm" align="center">
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
                            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
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
                            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        />
                    </HStack>
                </HStack>
            </Box>
        </footer>
    );
};

export default Footer;

