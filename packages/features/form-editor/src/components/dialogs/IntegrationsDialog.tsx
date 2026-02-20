/**
 * IntegrationsDialog — Connect form to external services
 * Migrated from AI-Powered Form Builder UI → SolidJS + M3
 */
import { For, splitProps } from 'solid-js';
import type { Component } from 'solid-js';
import { Dialog } from '@formanywhere/ui/dialog';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import './dialogs.scss';

export interface IntegrationsDialogProps {
    open: boolean;
    onClose: () => void;
}

interface Integration {
    id: string;
    name: string;
    description: string;
    icon: string;
    connected: boolean;
}

const INTEGRATIONS: Integration[] = [
    { id: 'webhook', name: 'Webhooks', description: 'Send form data to any URL endpoint', icon: 'link', connected: false },
    { id: 'email', name: 'Email Notifications', description: 'Get notified on new submissions', icon: 'at-sign', connected: true },
    { id: 'sheets', name: 'Google Sheets', description: 'Sync submissions to a spreadsheet', icon: 'grid-3x3', connected: false },
    { id: 'slack', name: 'Slack', description: 'Post submissions to a Slack channel', icon: 'message-square', connected: false },
];

export const IntegrationsDialog: Component<IntegrationsDialogProps> = (props) => {
    const [local] = splitProps(props, ['open', 'onClose']);
    return (
        <Dialog
            open={local.open}
            onClose={local.onClose}
            title="Integrations"
            icon={<Icon name="link" size={20} />}
            class="integrations-dialog"
            actions={<Button variant="text" size="sm" onClick={local.onClose}>Close</Button>}
        >
            <div class="integrations-dialog__content">
                <p class="integrations-dialog__desc">Connect your form to external services.</p>
                <div class="integrations-dialog__list">
                    <For each={INTEGRATIONS}>
                        {(int) => (
                            <div class="integrations-dialog__item">
                                <div class="integrations-dialog__item-icon">
                                    <Icon name={int.icon} size={20} />
                                </div>
                                <div class="integrations-dialog__item-info">
                                    <span class="integrations-dialog__item-name">{int.name}</span>
                                    <span class="integrations-dialog__item-desc">{int.description}</span>
                                </div>
                                <Button
                                    variant={int.connected ? 'outlined' : 'filled'}
                                    size="sm"
                                >
                                    {int.connected ? 'Connected' : 'Connect'}
                                </Button>
                            </div>
                        )}
                    </For>
                </div>
            </div>
        </Dialog>
    );
};
