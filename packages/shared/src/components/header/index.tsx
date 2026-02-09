/**
 * Header Component - SolidJS implementation
 * Pill-style sticky navbar with scroll animation
 */
import { Component, createSignal, onMount, onCleanup, Show, For } from 'solid-js';
import { Button } from '@formanywhere/ui/button';
import { Drawer } from '@formanywhere/ui/drawer';
import { IconButton } from '@formanywhere/ui/icon-button';
import { List, ListItem } from '@formanywhere/ui/list';
import { Divider } from '@formanywhere/ui/divider';
import MenuHamburgerIcon from '/icons/menu-hamburger.svg';
import MenuCloseIcon from '/icons/menu-close.svg';

// Import subcomponents from their folders
import { Logo } from './logo';
import { NavLink } from './nav-link';
import { ThemeToggle } from './theme-toggle';

// Re-export subcomponents for external use if needed
export { Logo } from './logo';
export { NavLink } from './nav-link';
export { ThemeToggle, applyTheme, defaultThemes } from './theme-toggle';
export type { ThemeOption } from './theme-toggle';

// Navigation links configuration
const navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Templates', href: '/templates' },
    { label: 'Blog', href: '/blog' },
];

// ============================================================================
// Main Header Component
// ============================================================================

export interface HeaderProps {
    class?: string;
}

export const Header: Component<HeaderProps> = (props) => {
    const [isScrolled, setIsScrolled] = createSignal(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = createSignal(false);
    const [isDesktop, setIsDesktop] = createSignal(true);

    onMount(() => {
        const updateHeader = () => {
            setIsScrolled(window.scrollY > 20);
            setIsDesktop(window.innerWidth >= 900);
        };

        updateHeader();
        window.addEventListener('scroll', updateHeader);
        window.addEventListener('resize', updateHeader);

        onCleanup(() => {
            window.removeEventListener('scroll', updateHeader);
            window.removeEventListener('resize', updateHeader);
        });
    });

    const openMobileMenu = () => setIsMobileMenuOpen(true);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    // Header inner styles based on scroll state
    const headerInnerStyle = () => {
        if (isScrolled() && isDesktop()) {
            return {
                background: 'transparent',
                'backdrop-filter': 'none',
                '-webkit-backdrop-filter': 'none',
                'border-bottom': 'none',
                'padding-left': '24px',
                'padding-right': '24px',
                'padding-top': '16px',
            };
        }
        return {
            background: 'var(--glass-tint-light)',
            'backdrop-filter': 'blur(var(--glass-blur))',
            '-webkit-backdrop-filter': 'blur(var(--glass-blur))',
            'border-bottom': '1px solid var(--glass-border-subtle)',
            'padding-left': '0',
            'padding-right': '0',
            'padding-top': '0',
        };
    };

    // Header container styles
    const headerContainerStyle = () => {
        if (isScrolled() && isDesktop()) {
            return {
                'max-width': 'fit-content',
                width: 'auto',
                'padding-left': '0',
                'padding-right': '0',
            };
        }
        return {
            'max-width': '80rem',
            width: '',
            'padding-left': '1.5rem',
            'padding-right': '1.5rem',
        };
    };

    // Nav styles
    const navStyle = () => {
        if (isScrolled() && isDesktop()) {
            return {
                display: 'flex',
                'background-color': 'var(--glass-tint-light)',
                'backdrop-filter': 'blur(var(--glass-blur-strong))',
                '-webkit-backdrop-filter': 'blur(var(--glass-blur-strong))',
                'border-radius': '9999px',
                'box-shadow': 'var(--glass-shadow-elevated)',
                border: '1px solid var(--glass-border-light)',
                padding: '8px 32px',
                'justify-content': 'center',
                gap: '24px',
            };
        }
        return {
            display: isDesktop() ? 'grid' : 'flex',
            'background-color': 'transparent',
            'backdrop-filter': 'none',
            '-webkit-backdrop-filter': 'none',
            'border-radius': '0',
            'box-shadow': 'none',
            border: 'none',
            padding: '12px 0',
            'justify-content': isDesktop() ? '' : 'space-between',
            gap: '',
        };
    };

    return (
        <header
            id="header"
            class={props.class || ''}
            style={{
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                'z-index': '50',
            }}
        >
            <div
                id="header-inner"
                class="w-full transition-all duration-500 ease-out"
                style={{
                    ...headerInnerStyle(),
                    'border-bottom': '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <div
                    id="header-container"
                    class="transition-all duration-500 ease-out"
                    style={{
                        ...headerContainerStyle(),
                        'margin-left': 'auto',
                        'margin-right': 'auto',
                    }}
                >
                    <nav
                        id="header-nav"
                        class="transition-all duration-500 ease-out"
                        style={{
                            ...navStyle(),
                            ...(isDesktop() && !isScrolled() ? {
                                display: 'grid',
                                'grid-template-columns': '1fr auto 1fr',
                            } : {}),
                            'align-items': 'center',
                            'flex-wrap': 'nowrap',
                        }}
                    >
                        {/* Logo - hidden when scrolled on desktop */}
                        <Show when={!(isScrolled() && isDesktop())}>
                            <Logo showText={true} />
                        </Show>

                        {/* Center Navigation */}
                        <div
                            id="nav-links"
                            class="transition-all duration-300"
                            style={{
                                display: isDesktop() ? 'flex' : 'none',
                                'align-items': 'center',
                                'justify-content': 'center',
                                gap: isScrolled() ? '1.5rem' : '2rem',
                            }}
                        >
                            <For each={navLinks}>
                                {(link) => <NavLink href={link.href}>{link.label}</NavLink>}
                            </For>
                        </div>

                        {/* Right Actions */}
                        <div
                            id="auth-buttons"
                            class="transition-all duration-300"
                            style={{
                                display: 'flex',
                                'align-items': 'center',
                                'justify-content': 'flex-end',
                                'margin-left': 'auto',
                                'flex-shrink': '0',
                                gap: isScrolled() ? '0.5rem' : '1rem',
                            }}
                        >
                            {/* Sign in - hidden when scrolled */}
                            <Show when={!(isScrolled() && isDesktop())}>
                                <Button
                                    href="/signin"
                                    variant="text"
                                    style={{
                                        display: 'none',
                                        'font-size': '15px',
                                        'white-space': 'nowrap',
                                    }}
                                    class="md:inline-flex"
                                >
                                    Sign in
                                </Button>
                            </Show>

                            <Button
                                href="/signup"
                                variant="filled"
                                style={{
                                    display: isDesktop() ? 'inline-flex' : 'none',
                                    'font-size': '15px',
                                    padding: '10px 24px',
                                    'border-radius': '12px',
                                    'white-space': 'nowrap',
                                }}
                            >
                                Get Started Free
                            </Button>

                            {/* Theme Toggle */}
                            <ThemeToggle />

                            {/* Mobile menu button */}
                            <IconButton
                                aria-label="Open navigation menu"
                                aria-expanded={isMobileMenuOpen()}
                                aria-controls="mobile-menu"
                                icon={
                                    <MenuHamburgerIcon
                                        width={24}
                                        height={24}
                                    />
                                }
                                style={{
                                    display: isDesktop() ? 'none' : 'inline-flex',
                                }}
                                onClick={openMobileMenu}
                            />
                        </div>
                    </nav>
                </div>
            </div>

            {/* Spacer for fixed header */}
            <div class="h-16" />

            {/* Mobile Navigation Drawer */}
            <Drawer
                open={isMobileMenuOpen()}
                onClose={closeMobileMenu}
                anchor="right"
                width="320px"
            >
                {/* Drawer Header with Logo and Close */}
                <div
                    style={{
                        display: 'flex',
                        'align-items': 'center',
                        'justify-content': 'space-between',
                        padding: '16px 16px 16px 24px',
                    }}
                >
                    <Logo showText={true} />
                    <IconButton
                        aria-label="Close navigation menu"
                        onClick={closeMobileMenu}
                        icon={
                            <MenuCloseIcon
                                width={24}
                                height={24}
                            />
                        }
                    />
                </div>
                <Divider />

                {/* Navigation Links */}
                <nav
                    style={{
                        flex: '1',
                        'overflow-y': 'auto',
                    }}
                >
                    <List>
                        <For each={navLinks}>
                            {(link) => (
                                <ListItem
                                    headline={link.label}
                                    href={link.href}
                                    interactive
                                    onClick={closeMobileMenu}
                                    style={{
                                        'border-radius': 'var(--m3-shape-medium, 12px)',
                                        margin: '4px 12px',
                                    }}
                                />
                            )}
                        </For>
                    </List>
                </nav>

                <Divider />
                {/* Auth Actions Footer */}
                <div
                    style={{
                        padding: '16px 24px 24px',
                        display: 'flex',
                        'flex-direction': 'column',
                        gap: '12px',
                    }}
                >
                    <Button
                        href="/signin"
                        variant="outlined"
                        style={{
                            width: '100%',
                            'justify-content': 'center',
                        }}
                    >
                        Sign in
                    </Button>
                    <Button
                        href="/signup"
                        variant="filled"
                        style={{
                            width: '100%',
                            'justify-content': 'center',
                        }}
                    >
                        Get Started Free
                    </Button>
                </div>
            </Drawer>
        </header>
    );
};

export default Header;
