/**
 * Header Component - SolidJS implementation
 * Pill-style sticky navbar with scroll animation
 */
import { Component, createSignal, onMount, onCleanup, Show, For } from 'solid-js';
import { Button } from '@formanywhere/ui/button';

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

// Remove TopAppBar import
// import { TopAppBar } from '@formanywhere/ui';

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

    const openMobileMenu = () => {
        setIsMobileMenuOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = '';
    };

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
                                <a
                                    href="/signin"
                                    class="hidden md:inline-flex text-on-surface-variant hover:text-on-surface font-medium text-[15px] transition-colors whitespace-nowrap"
                                >
                                    Sign in
                                </a>
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
                            <button
                                id="mobile-menu-btn"
                                aria-label="Open navigation menu"
                                aria-expanded={isMobileMenuOpen()}
                                aria-controls="mobile-menu"
                                style={{
                                    display: isDesktop() ? 'none' : 'block',
                                    padding: '8px',
                                    color: 'var(--m3-color-on-surface-variant, #49454F)',
                                }}
                                onClick={openMobileMenu}
                            >
                                <svg
                                    class="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </nav>
                </div>
            </div>

            {/* Spacer for fixed header */}
            <div class="h-16" />

            {/* Mobile Menu Overlay */}
            <div
                id="mobile-menu"
                class="fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300"
                classList={{
                    'opacity-0 pointer-events-none': !isMobileMenuOpen(),
                    'opacity-100 pointer-events-auto': isMobileMenuOpen(),
                }}
                onClick={(e) => { if (e.target === e.currentTarget) closeMobileMenu(); }}
            >
                <div
                    id="mobile-menu-panel"
                    class="absolute right-0 top-0 bottom-0 w-80 lg-glass-subtle shadow-2xl border-l border-outline-variant transition-transform duration-300"
                    classList={{
                        'translate-x-full': !isMobileMenuOpen(),
                        'translate-x-0': isMobileMenuOpen(),
                    }}
                >
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-8">
                            <span class="text-lg font-semibold text-on-surface">Menu</span>
                            <button
                                id="close-menu-btn"
                                class="p-2 text-on-surface-variant hover:text-on-surface"
                                aria-label="Close navigation menu"
                                onClick={closeMobileMenu}
                            >
                                <svg
                                    class="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <nav class="flex flex-col gap-4">
                            <For each={navLinks}>
                                {(link) => (
                                    <a
                                        href={link.href}
                                        class="text-on-surface hover:text-primary font-medium py-2 border-b border-outline-variant"
                                        onClick={closeMobileMenu}
                                    >
                                        {link.label}
                                    </a>
                                )}
                            </For>
                            <div class="pt-4 flex flex-col gap-3">
                                <a
                                    href="/signin"
                                    class="text-center text-on-surface font-medium py-2.5 border border-outline-variant rounded-xl hover:bg-surface-container-low"
                                >
                                    Sign in
                                </a>
                                <a
                                    href="/signup"
                                    class="text-center bg-gradient-to-r from-primary to-primary-dark text-white font-medium py-2.5 rounded-xl"
                                >
                                    Get Started Free
                                </a>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
