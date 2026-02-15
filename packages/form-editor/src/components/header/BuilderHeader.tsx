/**
 * BuilderHeader — Top app bar for the form builder
 * Left: Back arrow, form name
 * Right: Preview, Publish, Settings (dropdown), Theme toggle, User profile
 */
import { createSignal, Show, onMount, onCleanup } from 'solid-js';
import type { Component } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Icon } from '@formanywhere/ui/icon';
import { Avatar } from '@formanywhere/ui/avatar';
import { Menu, MenuItem } from '@formanywhere/ui/menu';
import { Divider } from '@formanywhere/ui/divider';
import { ThemeToggle } from '@formanywhere/shared/header';

export interface BuilderHeaderProps {
    formName: string;
    previewing: boolean;
    saving: boolean;
    hasSchema: boolean;
    onTogglePreview: () => void;
    onSave: () => void;
    onBack: () => void;
    onSettings?: () => void;
    onDashboard?: () => void;
    onViewSchema?: () => void;
    onCustomizeTheme?: () => void;
    onIntegrations?: () => void;
    /** User display name (falls back to "User") */
    userName?: string;
    /** User email (falls back to "user@example.com") */
    userEmail?: string;
    /** URL to user avatar image */
    userAvatar?: string;
    /** Navigate to profile page */
    onProfile?: () => void;
    /** Log the user out */
    onLogout?: () => void;
}

export const BuilderHeader: Component<BuilderHeaderProps> = (props) => {
    const [settingsOpen, setSettingsOpen] = createSignal(false);
    const [profileMenuOpen, setProfileMenuOpen] = createSignal(false);
    let settingsRef: HTMLDivElement | undefined;
    let profileAnchor: HTMLDivElement | undefined;

    const userName = () => props.userName || 'User';
    const userEmail = () => props.userEmail || 'user@example.com';
    const userInitials = () =>
        userName()
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

    /* Close settings menu on outside click */
    const handleClickOutside = (e: MouseEvent) => {
        if (settingsOpen() && settingsRef && !settingsRef.contains(e.target as Node)) {
            setSettingsOpen(false);
        }
    };

    onMount(() => document.addEventListener('click', handleClickOutside));
    onCleanup(() => document.removeEventListener('click', handleClickOutside));

    return (
        <header class="builder-header">
            {/* ── Left: Back · Form name ── */}
            <div class="builder-header__left">
                <IconButton
                    onClick={() => props.onBack()}
                    variant="standard"
                    size="sm"
                    icon={<Icon name="arrow-left" size={18} />}
                    title="Back"
                />
                <Typography variant="title-medium" class="builder-header__form-name">
                    {props.formName}
                </Typography>
            </div>

            {/* ── Right: Preview · Publish · Settings · Theme · Profile ── */}
            <div class="builder-header__right">
                <Button
                    variant="text"
                    size="sm"
                    onClick={() => props.onTogglePreview()}
                    disabled={!props.hasSchema}
                    class="builder-header__btn"
                >
                    <Icon name={props.previewing ? 'pencil' : 'eye'} size={16} />
                    {props.previewing ? 'Edit' : 'Preview'}
                </Button>

                <Button
                    variant="filled"
                    size="sm"
                    onClick={() => props.onSave()}
                    disabled={props.saving || !props.hasSchema}
                    class="builder-header__btn"
                >
                    <Icon name="upload" size={16} />
                    {props.saving ? 'Saving…' : 'Publish'}
                </Button>

                <div class="builder-header__settings-wrapper" ref={settingsRef}>
                    <IconButton
                        variant="standard"
                        size="sm"
                        onClick={() => setSettingsOpen(!settingsOpen())}
                        title="Settings"
                        icon={<Icon name="settings" size={18} />}
                    />
                    <Show when={settingsOpen()}>
                        <div class="builder-header__settings-menu">
                            <button onClick={() => { props.onViewSchema?.(); setSettingsOpen(false); }}>
                                <Icon name="file-text" size={16} />
                                View Schema
                            </button>
                            <button onClick={() => { props.onCustomizeTheme?.(); setSettingsOpen(false); }}>
                                <Icon name="sliders" size={16} />
                                Customize Theme
                            </button>
                            <button onClick={() => { props.onIntegrations?.(); setSettingsOpen(false); }}>
                                <Icon name="link" size={16} />
                                Integrations
                            </button>
                            <button onClick={() => { props.onSettings?.(); setSettingsOpen(false); }}>
                                <Icon name="settings" size={16} />
                                Form Settings
                            </button>
                        </div>
                    </Show>
                </div>

                {/* Theme colour selector */}
                <ThemeToggle />

                {/* User profile */}
                <div ref={profileAnchor}>
                    <Avatar
                        src={props.userAvatar}
                        initials={userInitials()}
                        size="sm"
                        onClick={() => setProfileMenuOpen(true)}
                        style={{ cursor: 'pointer' }}
                    />
                </div>

                <Menu
                    open={profileMenuOpen()}
                    onClose={() => setProfileMenuOpen(false)}
                    anchorEl={profileAnchor}
                    position="bottom-end"
                >
                    <div class="builder-header__profile-header">
                        <Avatar
                            src={props.userAvatar}
                            initials={userInitials()}
                            size="sm"
                        />
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
                        onClick={() => { props.onProfile?.(); setProfileMenuOpen(false); }}
                    />
                    <MenuItem
                        label="Account Settings"
                        leadingIcon={<Icon name="settings" size={20} />}
                        onClick={() => { props.onProfile?.(); setProfileMenuOpen(false); }}
                    />
                    <Divider />
                    <MenuItem
                        label="Logout"
                        leadingIcon={<Icon name="logout" size={20} />}
                        onClick={() => { props.onLogout?.(); setProfileMenuOpen(false); }}
                        style={{ color: 'var(--m3-color-error, #B3261E)' }}
                    />
                </Menu>
            </div>
        </header>
    );
};
