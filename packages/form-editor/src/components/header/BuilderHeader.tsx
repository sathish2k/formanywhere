/**
 * BuilderHeader — Top app bar for the form builder
 * Left: Back arrow, form name
 * Right: Preview, Publish, Settings (dropdown), Theme toggle, User profile
 */
import { splitProps, createSignal, Show, onMount, onCleanup } from 'solid-js';
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
    /** Open the Layout Builder overlay */
    onLayoutBuilder?: () => void;
    /** Callback when user renames the form inline */
    onFormNameChange?: (name: string) => void;
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
    const [local] = splitProps(props, ['formName', 'hasSchema', 'previewing', 'saving', 'userName', 'userEmail', 'userAvatar', 'onBack', 'onSave', 'onTogglePreview', 'onViewSchema', 'onSettings', 'onLogout', 'onProfile', 'onIntegrations', 'onCustomizeTheme', 'onLayoutBuilder', 'onFormNameChange']);
    const [settingsOpen, setSettingsOpen] = createSignal(false);
    const [profileMenuOpen, setProfileMenuOpen] = createSignal(false);
    const [editingName, setEditingName] = createSignal(false);
    const [nameInput, setNameInput] = createSignal('');
    let settingsRef: HTMLDivElement | undefined;
    let profileAnchor: HTMLDivElement | undefined;
    let nameInputRef: HTMLInputElement | undefined;

    const userName = () => local.userName || 'User';
    const userEmail = () => local.userEmail || 'user@example.com';
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

    const startEditingName = () => {
        if (!local.onFormNameChange) return;
        setNameInput(local.formName);
        setEditingName(true);
        setTimeout(() => nameInputRef?.select(), 0);
    };

    const commitName = () => {
        const trimmed = nameInput().trim();
        if (trimmed && trimmed !== local.formName) {
            local.onFormNameChange?.(trimmed);
        }
        setEditingName(false);
    };

    const cancelEditingName = () => {
        setEditingName(false);
    };

    return (
        <header class="builder-header">
            {/* ── Left: Back · Form name ── */}
            <div class="builder-header__left">
                <IconButton
                    onClick={() => local.onBack()}
                    variant="standard"
                    size="sm"
                    icon={<Icon name="arrow-left" size={18} />}
                    title="Back"
                />
                <Show when={editingName()} fallback={
                    <span
                        class="builder-header__form-name"
                        onClick={startEditingName}
                        style={{ cursor: local.onFormNameChange ? 'pointer' : 'default' }}
                        title={local.onFormNameChange ? 'Click to rename' : undefined}
                    >
                        <Typography variant="title-medium">
                            {local.formName}
                        </Typography>
                    </span>
                }>
                    <input
                        ref={nameInputRef}
                        class="builder-header__name-input"
                        value={nameInput()}
                        onInput={(e) => setNameInput(e.currentTarget.value)}
                        onBlur={commitName}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') commitName();
                            if (e.key === 'Escape') cancelEditingName();
                        }}
                    />
                </Show>
            </div>

            {/* ── Right: Preview · Publish · Settings · Theme · Profile ── */}
            <div class="builder-header__right">
                <Button
                    variant="text"
                    size="sm"
                    onClick={() => local.onTogglePreview()}
                    disabled={!local.hasSchema}
                    class="builder-header__btn"
                >
                    <Icon name={local.previewing ? 'pencil' : 'eye'} size={16} />
                    {local.previewing ? 'Edit' : 'Preview'}
                </Button>

                <Button
                    variant="filled"
                    size="sm"
                    onClick={() => local.onSave()}
                    disabled={local.saving || !local.hasSchema}
                    class="builder-header__btn"
                >
                    <Icon name="upload" size={16} />
                    {local.saving ? 'Saving…' : 'Publish'}
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
                            <button onClick={() => { local.onLayoutBuilder?.(); setSettingsOpen(false); }}>
                                <Icon name="layout" size={16} />
                                Layout Builder
                            </button>
                            <button onClick={() => { local.onViewSchema?.(); setSettingsOpen(false); }}>
                                <Icon name="file-text" size={16} />
                                View Schema
                            </button>
                            <button onClick={() => { local.onCustomizeTheme?.(); setSettingsOpen(false); }}>
                                <Icon name="sliders" size={16} />
                                Customize Theme
                            </button>
                            <button onClick={() => { local.onIntegrations?.(); setSettingsOpen(false); }}>
                                <Icon name="link" size={16} />
                                Integrations
                            </button>
                            <button onClick={() => { local.onSettings?.(); setSettingsOpen(false); }}>
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
                        src={local.userAvatar}
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
                            src={local.userAvatar}
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
                        onClick={() => { local.onProfile?.(); setProfileMenuOpen(false); }}
                    />
                    <MenuItem
                        label="Account Settings"
                        leadingIcon={<Icon name="settings" size={20} />}
                        onClick={() => { local.onProfile?.(); setProfileMenuOpen(false); }}
                    />
                    <Divider />
                    <MenuItem
                        label="Logout"
                        leadingIcon={<Icon name="logout" size={20} />}
                        onClick={() => { local.onLogout?.(); setProfileMenuOpen(false); }}
                        style={{ color: 'var(--m3-color-error, #B3261E)' }}
                    />
                </Menu>
            </div>
        </header>
    );
};
