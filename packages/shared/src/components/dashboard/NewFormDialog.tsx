/**
 * New Form Dialog — Quick name capture before entering the builder
 * Shows a simple modal with form name + optional description fields.
 */
import { Component, createSignal } from 'solid-js';
import { Dialog } from '@formanywhere/ui/dialog';
import { Button } from '@formanywhere/ui/button';
import { TextField } from '@formanywhere/ui/input';
import { Typography } from '@formanywhere/ui/typography';
import { Icon } from '@formanywhere/ui/icon';

export interface NewFormDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (name: string, description: string) => void;
}

export const NewFormDialog: Component<NewFormDialogProps> = (props) => {
    const [name, setName] = createSignal('Untitled Form');
    const [description, setDescription] = createSignal('');

    const handleConfirm = () => {
        const formName = name().trim() || 'Untitled Form';
        props.onConfirm(formName, description().trim());
        // Reset for next open
        setName('Untitled Form');
        setDescription('');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleConfirm();
        }
    };

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            title="Create New Form"
            icon={<Icon name="file-plus" size={24} />}
            actions={
                <div style={{ display: 'flex', gap: '8px', "justify-content": 'flex-end' }}>
                    <Button variant="text" onClick={props.onClose}>Cancel</Button>
                    <Button variant="filled" onClick={handleConfirm}>
                        <Icon name="arrow-right" size={16} />
                        Create
                    </Button>
                </div>
            }
        >
            <div style={{ display: 'flex', "flex-direction": 'column', gap: '16px', "min-width": '360px' }}>
                <div onKeyDown={handleKeyDown}>
                    <TextField
                        label="Form Name"
                        value={name()}
                        onInput={(e) => setName((e.target as HTMLInputElement).value)}
                    />
                </div>
                <TextField
                    label="Description (optional)"
                    value={description()}
                    onInput={(e) => setDescription((e.target as HTMLInputElement).value)}
                    type="textarea"
                    rows={2}
                />
                <Typography variant="body-small" color="on-surface-variant" style={{ opacity: 0.7 }}>
                    You can rename your form anytime from the builder header.
                </Typography>
            </div>
        </Dialog>
    );
};
