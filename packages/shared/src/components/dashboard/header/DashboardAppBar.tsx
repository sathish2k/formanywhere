/**
 * Dashboard App Bar — SolidJS
 * Pill-style sticky navbar with scroll animation (matches site header)
 */
import { Component, createSignal, onMount, onCleanup, Show } from 'solid-js';
import { Button } from '@formanywhere/ui/button';
import { Avatar } from '@formanywhere/ui/avatar';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Icon } from '@formanywhere/ui/icon';
import { Menu, MenuItem } from '@formanywhere/ui/menu';
import { Drawer } from '@formanywhere/ui/drawer';
import { List, ListItem } from '@formanywhere/ui/list';
import { Divider } from '@formanywhere/ui/divider';
import { Typography } from '@formanywhere/ui/typography';
import { Logo } from '../../header/logo';
import { ThemeToggle } from '../../header/theme-toggle';
import MenuHamburgerIcon from '../../../icons/svg/menu-hamburger.svg';
import MenuCloseIcon from '../../../icons/svg/menu-close.svg';
import { go } from '../../../utils/navigate';
import { authClient } from '../../../lib/auth-client';

export interface DashboardAppBarProps {
    userName?: string;
    userEmail?: string;
}

export const DashboardAppBar: Component<DashboardAppBarProps> = (props) => {
    const userName = () => props.userName || 'User';
    const userEmail = () => props.userEmail || 'user@example.com';

    const [profileMenuOpen, setProfileMenuOpen] = createSignal(false);
    const [drawerOpen, setDrawerOpen] = createSignal(false);
    const [isScrolled, setIsScrolled] = createSignal(false);
    const [isDesktop, setIsDesktop] = createSignal(true);

    let profileAnchor: HTMLDivElement | undefined;

    const userInitials = () =>
        userName()
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

    // ── Scroll & resize tracking ────────────────────────────────

    onMount(() => {
        const update = () => {
            setIsScrolled(window.scrollY > 20);
            setIsDesktop(window.innerWidth >= 900);
        };

        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);

        onCleanup(() => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        });
    });

    // ── Dynamic pill styles (matches site header pattern) ───────

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
            background: 'var(--m3-sys-color-surface, var(--m3-color-surface, #fff))',
            'backdrop-filter': 'blur(var(--glass-blur, 20px))',
            '-webkit-backdrop-filter': 'blur(var(--glass-blur, 20px))',
            'border-bottom': '1px solid var(--glass-border-subtle, rgba(255, 255, 255, 0.1))',
            'padding-left': '0',
            'padding-right': '0',
            'padding-top': '0',
        };
    };

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

    const navStyle = () => {
        if (isScrolled() && isDesktop()) {
            return {
                display: 'flex',
                'background-color': 'var(--glass-tint-medium, rgba(255, 255, 255, 0.7))',
                'backdrop-filter': 'blur(var(--glass-blur-strong, 30px))',
                '-webkit-backdrop-filter': 'blur(var(--glass-blur-strong, 30px))',
                'border-radius': '9999px',
                'box-shadow': 'var(--glass-shadow-elevated, 0 8px 32px rgba(0,0,0,0.08))',
                border: '1px solid var(--glass-border-light, rgba(255, 255, 255, 0.2))',
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

    // ── Actions ─────────────────────────────────────────────────

    const handleLogout = async () => {
        setProfileMenuOpen(false);
        try {
            await authClient.signOut();
        } catch {
            // Best effort — clear any leftover state
        }
        localStorage.removeItem('formanywhere-session');
        go('/signin');
    };

    const navigate = (path: string) => {
        setProfileMenuOpen(false);
        setDrawerOpen(false);
        go(path);
    };

    return (
        <>
            <header
                class="dashboard-appbar"
                style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    right: '0',
                    'z-index': '50',
                }}
            >
                <div
                    class="dashboard-appbar__inner transition-all duration-500 ease-out"
                    style={{
                        ...headerInnerStyle(),
                        width: '100%',
                    }}
                >
                    <div
                        class="dashboard-appbar__container transition-all duration-500 ease-out"
                        style={{
                            ...headerContainerStyle(),
                            'margin-left': 'auto',
                            'margin-right': 'auto',
                        }}
                    >
                        <nav
                            class="dashboard-appbar__nav transition-all duration-500 ease-out"
                            style={{
                                ...navStyle(),
                                ...(isDesktop() && !isScrolled()
                                    ? {
                                          display: 'grid',
                                          'grid-template-columns': '1fr auto 1fr',
                                      }
                                    : {}),
                                'align-items': 'center',
                                'flex-wrap': 'nowrap',
                            }}
                        >
                            {/* Logo — hidden when scrolled on desktop */}
                            <Show when={!(isScrolled() && isDesktop())}>
                                <div class="dashboard-appbar__left">
                                    {/* Mobile menu button */}
                                    <div
                                        style={{
                                            display: isDesktop() ? 'none' : 'block',
                                        }}
                                    >
                                        <IconButton
                                            icon={<MenuHamburgerIcon width={24} height={24} />}
                                            variant="standard"
                                            onClick={() => setDrawerOpen(true)}
                                            aria-label="Open menu"
                                        />
                                    </div>
                                    <Logo showText={true} />
                                </div>
                            </Show>

                            {/* Desktop nav links */}
                            <div
                                class="dashboard-appbar__center"
                                style={{
                                    display: isDesktop() ? 'flex' : 'none',
                                    'align-items': 'center',
                                    'justify-content': 'center',
                                    gap: isScrolled() ? '1.5rem' : '2rem',
                                }}
                            >
                                <a
                                    href="/dashboard"
                                    class="dashboard-appbar__nav-link dashboard-appbar__nav-link--active"
                                >
                                    Dashboard
                                </a>
                                <a href="/templates" class="dashboard-appbar__nav-link">
                                    Templates
                                </a>
                                <a href="/about" class="dashboard-appbar__nav-link">
                                    Help
                                </a>
                            </div>

                            {/* Right section */}
                            <div
                                class="dashboard-appbar__right"
                                style={{
                                    display: 'flex',
                                    'align-items': 'center',
                                    'justify-content': 'flex-end',
                                    'margin-left': 'auto',
                                    'flex-shrink': '0',
                                    gap: isScrolled() ? '0.5rem' : '1rem',
                                }}
                            >
                                <Button
                                    href="/app"
                                    variant="filled"
                                    style={{
                                        display: isDesktop() ? 'inline-flex' : 'none',
                                        'font-size': '14px',
                                        padding: '8px 20px',
                                        'border-radius': '12px',
                                        'white-space': 'nowrap',
                                    }}
                                >
                                    New Form
                                </Button>

                                <ThemeToggle />

                                <div ref={profileAnchor}>
                                    <Avatar
                                        initials={userInitials()}
                                        size="sm"
                                        onClick={() => setProfileMenuOpen(true)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>

                                {/* Mobile menu button (shown in pill mode too) */}
                                <IconButton
                                    aria-label="Open menu"
                                    icon={<MenuHamburgerIcon width={24} height={24} />}
                                    style={{
                                        display: isDesktop() ? 'none' : 'inline-flex',
                                    }}
                                    onClick={() => setDrawerOpen(true)}
                                />
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Spacer to offset fixed header */}
            <div style={{ height: '64px' }} />

            {/* Profile Menu */}
            <Menu
                open={profileMenuOpen()}
                onClose={() => setProfileMenuOpen(false)}
                anchorEl={profileAnchor}
                position="bottom-end"
            >
                <div class="profile-menu__header">
                    <Avatar initials={userInitials()} size="sm" />
                    <div>
                        <Typography variant="title-small">{userName()}</Typography>
                        <Typography variant="label-small" color="on-surface-variant">
                            {userEmail()}
                        </Typography>
                    </div>
                </div>
                <Divider />
                <MenuItem
                    label="Profile Settings"
                    leadingIcon={<Icon name="person" size={20} />}
                    onClick={() => navigate('/profile')}
                />
                <MenuItem
                    label="Notifications"
                    leadingIcon={<Icon name="bell" size={20} />}
                />
                <MenuItem
                    label="Account Settings"
                    leadingIcon={<Icon name="settings" size={20} />}
                    onClick={() => navigate('/profile')}
                />
                <Divider />
                <MenuItem
                    label="Logout"
                    leadingIcon={<Icon name="logout" size={20} />}
                    onClick={handleLogout}
                    style={{ color: 'var(--m3-color-error, #B3261E)' }}
                />
            </Menu>

            {/* Mobile Drawer */}
            <Drawer
                open={drawerOpen()}
                onClose={() => setDrawerOpen(false)}
                anchor="right"
                width="320px"
            >
                <div style={{
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'space-between',
                    padding: '16px 16px 16px 24px',
                }}>
                    <Logo showText={true} />
                    <IconButton
                        aria-label="Close menu"
                        onClick={() => setDrawerOpen(false)}
                        icon={<MenuCloseIcon width={24} height={24} />}
                    />
                </div>
                <Divider />

                <div style={{
                    padding: '16px 24px',
                    display: 'flex',
                    'align-items': 'center',
                    gap: '12px',
                    'border-bottom': '1px solid var(--m3-color-outline-variant)',
                }}>
                    <Avatar initials={userInitials()} size="md" />
                    <div>
                        <Typography variant="title-small">{userName()}</Typography>
                        <Typography variant="label-small" color="on-surface-variant">
                            {userEmail()}
                        </Typography>
                    </div>
                </div>

                <nav style={{ flex: '1', 'overflow-y': 'auto' }}>
                    <List>
                        <ListItem
                            headline="Dashboard"
                            start={<Icon name="lightning" size={24} />}
                            interactive
                            onClick={() => navigate('/dashboard')}
                            style={{ 'border-radius': 'var(--m3-shape-medium, 12px)', margin: '4px 12px' }}
                        />
                        <ListItem
                            headline="Templates"
                            start={<Icon name="file-text" size={24} />}
                            interactive
                            onClick={() => navigate('/templates')}
                            style={{ 'border-radius': 'var(--m3-shape-medium, 12px)', margin: '4px 12px' }}
                        />
                        <ListItem
                            headline="Help"
                            start={<Icon name="help-circle" size={24} />}
                            interactive
                            onClick={() => navigate('/about')}
                            style={{ 'border-radius': 'var(--m3-shape-medium, 12px)', margin: '4px 12px' }}
                        />
                    </List>
                </nav>

                <Divider />
                <div style={{ padding: '16px 24px 24px', display: 'flex', 'flex-direction': 'column', gap: '12px' }}>
                    <Button
                        variant="outlined"
                        onClick={handleLogout}
                        style={{ width: '100%', 'justify-content': 'center' }}
                    >
                        Sign Out
                    </Button>
                </div>
            </Drawer>
        </>
    );
};
