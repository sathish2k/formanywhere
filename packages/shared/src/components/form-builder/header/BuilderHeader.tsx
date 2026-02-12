/**
 * BuilderHeader — Top app bar for the form builder
 * Left: Back icon, form name, Dashboard CTA
 * Right: Preview, Settings (dropdown), Publish
 */
import { createSignal, Show, onMount, onCleanup } from 'solid-js';
import type { Component } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Icon } from '@formanywhere/ui/icon';

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
}

export const BuilderHeader: Component<BuilderHeaderProps> = (props) => {
    const [settingsOpen, setSettingsOpen] = createSignal(false);
    let settingsRef: HTMLDivElement | undefined;

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
            {/* ── Left: Back · Form name · Dashboard ── */}
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
                <Button
                    variant="text"
                    size="sm"
                    onClick={() => props.onDashboard?.()}
                    class="builder-header__btn"
                >
                    <Icon name="layout" size={14} />
                    Dashboard
                </Button>
            </div>

            {/* ── Right: Preview · Settings · Publish ── */}
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
            </div>
        </header>
    );
};
