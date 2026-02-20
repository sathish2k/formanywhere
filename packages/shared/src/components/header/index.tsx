/**
 * Header Component - SolidJS implementation
 * Agently.dev-inspired two-layer appbar animation:
 *   Layer 1: Full-width bar (visible at top of page)
 *   Layer 2: Floating pill (slides down on scroll)
 */
import { Component, createSignal, onMount, onCleanup, For, lazy, Suspense } from 'solid-js';
import { Button } from '@formanywhere/ui/button';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Divider } from '@formanywhere/ui/divider';
import MenuHamburgerIcon from '../../icons/svg/menu-hamburger.svg';
import MenuCloseIcon from '../../icons/svg/menu-close.svg';

// Import subcomponents from their folders
import { Logo } from './logo';
import { NavLink } from './nav-link';

// Lazy-load heavy components to reduce initial bundle
// ThemeToggle pulls in Menu → floating-ui (~10KB gzipped)
const ThemeToggle = lazy(() => import('./theme-toggle'));
// Drawer + List only needed when mobile menu opens (~2KB gzipped)
const LazyDrawer = lazy(() => import('@formanywhere/ui/drawer').then(m => ({ default: m.Drawer })));
const LazyList = lazy(() => import('@formanywhere/ui/list').then(m => ({ default: m.List })));
const LazyListItem = lazy(() => import('@formanywhere/ui/list').then(m => ({ default: m.ListItem })));

// Re-export subcomponents for external use if needed
export { Logo } from './logo';
export { NavLink } from './nav-link';
export { ThemeToggle } from './theme-toggle';

// Navigation links configuration
const navLinks = [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Templates', href: '/templates' },
    { label: 'Blog', href: '/blog' },
];

// Smooth spring-like easing for agently-style transitions
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

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

    /** True when the floating pill should be visible */
    const showPill = () => isScrolled() && isDesktop();

    onMount(() => {
        const updateHeader = () => {
            setIsScrolled(window.scrollY > 20);
            setIsDesktop(window.innerWidth >= 900);
        };

        updateHeader();
        window.addEventListener('scroll', updateHeader, { passive: true });
        window.addEventListener('resize', updateHeader);

        onCleanup(() => {
            window.removeEventListener('scroll', updateHeader);
            window.removeEventListener('resize', updateHeader);
        });
    });

    const openMobileMenu = () => setIsMobileMenuOpen(true);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

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
                'pointer-events': 'none',
            }}
        >
            {/* ─── Layer 1: Full-width Bar ─── */}
            {/* Slides up and fades out when user scrolls down (desktop only) */}
            <div
                aria-hidden={showPill()}
                style={{
                    'pointer-events': showPill() ? 'none' : 'auto',
                    opacity: showPill() ? '0' : '1',
                    transform: showPill() ? 'translateY(-100%)' : 'translateY(0)',
                    transition: `opacity 400ms ${EASE}, transform 500ms ${EASE}`,
                    background: 'var(--m3-color-surface)',
                    'border-bottom': '1px solid var(--glass-border-subtle)',
                }}
            >
                <nav
                    style={{
                        display: isDesktop() ? 'grid' : 'flex',
                        ...(isDesktop() ? { 'grid-template-columns': '1fr auto 1fr' } : {}),
                        'justify-content': isDesktop() ? undefined : 'space-between',
                        'align-items': 'center',
                        'max-width': '80rem',
                        margin: '0 auto',
                        padding: '12px 1.5rem',
                    }}
                >
                    {/* Logo */}
                    <Logo showText={true} />

                    {/* Center Navigation */}
                    <div
                        style={{
                            display: isDesktop() ? 'flex' : 'none',
                            'align-items': 'center',
                            'justify-content': 'center',
                            gap: '2rem',
                        }}
                    >
                        <For each={navLinks}>
                            {(link) => <NavLink href={link.href}>{link.label}</NavLink>}
                        </For>
                    </div>

                    {/* Right Actions */}
                    <div
                        style={{
                            display: 'flex',
                            'align-items': 'center',
                            'justify-content': 'flex-end',
                            gap: '1rem',
                        }}
                    >
                        <Button
                            href="/signin"
                            variant="text"
                            style={{
                                display: isDesktop() ? 'inline-flex' : 'none',
                                'font-size': '15px',
                                'white-space': 'nowrap',
                            }}
                        >
                            Sign in
                        </Button>

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

                        {/* Theme Toggle — lazy-loaded to defer floating-ui */}
                        <Suspense>
                            <ThemeToggle />
                        </Suspense>

                        {/* Mobile menu button */}
                        <IconButton
                            aria-label="Open navigation menu"
                            aria-expanded={isMobileMenuOpen()}
                            aria-controls="mobile-menu"
                            icon={<MenuHamburgerIcon width={24} height={24} />}
                            style={{ display: isDesktop() ? 'none' : 'inline-flex' }}
                            onClick={openMobileMenu}
                        />
                    </div>
                </nav>
            </div>

            {/* ─── Layer 2: Floating Pill ─── */}
            {/* Slides down from above when user scrolls (desktop only) */}
            <div
                aria-hidden={!showPill()}
                style={{
                    position: 'absolute',
                    top: '12px',
                    left: '50%',
                    transform: `translateX(-50%) translateY(${showPill() ? '0' : '-30px'})`,
                    opacity: showPill() ? '1' : '0',
                    'pointer-events': showPill() ? 'auto' : 'none',
                    transition: `opacity 400ms ${EASE}, transform 600ms ${EASE}`,
                    'background-color': 'var(--glass-tint-medium)',
                    'backdrop-filter': 'blur(var(--glass-blur-strong))',
                    '-webkit-backdrop-filter': 'blur(var(--glass-blur-strong))',
                    'border-radius': '9999px',
                    'box-shadow': 'var(--glass-shadow-elevated)',
                    border: '1px solid var(--glass-border-light)',
                    padding: '6px 8px 6px 28px',
                }}
            >
                <nav
                    style={{
                        display: 'flex',
                        'align-items': 'center',
                        gap: '1.25rem',
                    }}
                >
                    <For each={navLinks}>
                        {(link) => <NavLink href={link.href}>{link.label}</NavLink>}
                    </For>
                    <Button
                        href="/signup"
                        variant="filled"
                        style={{
                            'font-size': '14px',
                            padding: '8px 20px',
                            'border-radius': '9999px',
                            'white-space': 'nowrap',
                            'margin-left': '4px',
                        }}
                    >
                        Get Started
                    </Button>
                </nav>
            </div>

            {/* Spacer for fixed header */}
            <div class="h-16" />

            {/* Mobile Navigation Drawer — lazy-loaded (only needed on hamburger click) */}
            <Suspense>
                <LazyDrawer
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
                        <Suspense>
                            <LazyList>
                                <For each={navLinks}>
                                    {(link) => (
                                        <LazyListItem
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
                            </LazyList>
                        </Suspense>
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
                </LazyDrawer>
            </Suspense>
        </header>
    );
};

export default Header;
