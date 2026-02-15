/**
 * ConfirmationDialog — Reusable M3 confirmation prompt
 *
 * Wraps the Dialog from @formanywhere/ui with a title, descriptive
 * body, and confirm / cancel action buttons.  Used when a destructive
 * or irreversible action (e.g. delete page) requires explicit user consent.
 */
import { Component, splitProps } from 'solid-js';
import type { JSX } from 'solid-js';
import { Dialog } from '@formanywhere/ui/dialog';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import './styles.scss';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ConfirmationDialogProps {
    /** Dialog open state */
    open: boolean;
    /** Close handler (cancel / backdrop / escape) */
    onClose: () => void;
    /** Fired when the user clicks "Confirm" */
    onConfirm: () => void;
    /** Dialog headline */
    title?: string;
    /** Body text or JSX content */
    description?: JSX.Element;
    /** Label for the confirm button (default "Delete") */
    confirmLabel?: string;
    /** Label for the cancel button (default "Cancel") */
    cancelLabel?: string;
    /** Visual variant — destructive uses error colour */
    variant?: 'default' | 'destructive';
    /** Optional icon shown above the title */
    icon?: JSX.Element;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export const ConfirmationDialog: Component<ConfirmationDialogProps> = (rawProps) => {
    const [props] = splitProps(rawProps, [
        'open', 'onClose', 'onConfirm',
        'title', 'description',
        'confirmLabel', 'cancelLabel',
        'variant', 'icon',
    ]);

    const isDestructive = () => (props.variant ?? 'default') === 'destructive';
    const confirmText = () => props.confirmLabel ?? (isDestructive() ? 'Delete' : 'Confirm');
    const cancelText = () => props.cancelLabel ?? 'Cancel';

    const defaultIcon = () =>
        isDestructive()
            ? <Icon name="alert-triangle" size={24} />
            : undefined;

    const handleConfirm = () => {
        props.onConfirm();
        props.onClose();
    };

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            title={props.title}
            icon={props.icon ?? defaultIcon()}
            class={`confirmation-dialog ${isDestructive() ? 'confirmation-dialog--destructive' : ''}`}
            actions={
                <div class="confirmation-dialog__actions">
                    <Button
                        variant="text"
                        onClick={props.onClose}
                    >
                        {cancelText()}
                    </Button>
                    <Button
                        variant={isDestructive() ? 'filled' : 'filled'}
                        class={isDestructive() ? 'confirmation-dialog__confirm--danger' : ''}
                        onClick={handleConfirm}
                    >
                        {confirmText()}
                    </Button>
                </div>
            }
        >
            {props.description}
        </Dialog>
    );
};

export default ConfirmationDialog;
