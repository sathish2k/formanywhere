/**
 * BuilderHeader — Top app bar for the form builder
 * Back button, form title, Preview/Edit toggle, Settings, Publish
 */
import { Show } from 'solid-js';
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
}

export const BuilderHeader: Component<BuilderHeaderProps> = (props) => {
    return (
        <header class="form-builder-page__header">
            <div class="form-builder-page__header-left">
                <IconButton onClick={() => props.onBack()} variant="standard" icon={<Icon name="arrow-left" size={20} />} />
                <Typography variant="title-large">
                    {props.formName}
                </Typography>
            </div>
            <div class="form-builder-page__header-actions">
                <Button
                    variant="outlined"
                    onClick={() => props.onTogglePreview()}
                    disabled={!props.hasSchema}
                >
                    <Icon name={props.previewing ? 'pencil' : 'eye'} size={18} />
                    {props.previewing ? 'Edit' : 'Preview'}
                </Button>
                <IconButton variant="standard" title="Settings" icon={<Icon name="settings" size={20} />} />
                <Button
                    variant="filled"
                    onClick={() => props.onSave()}
                    disabled={props.saving || !props.hasSchema}
                >
                    <Icon name="check" size={18} />
                    {props.saving ? 'Saving...' : 'Publish'}
                </Button>
            </div>
        </header>
    );
};
