/**
 * Form Card Component — SolidJS
 * Individual form card with context menu actions
 */
import { Component, createSignal } from 'solid-js';
import { Avatar } from '@formanywhere/ui/avatar';
import { IconButton } from '@formanywhere/ui/icon-button';
import { Icon } from '@formanywhere/ui/icon';
import { Menu, MenuItem } from '@formanywhere/ui/menu';
import { Typography } from '@formanywhere/ui/typography';
import { Divider } from '@formanywhere/ui/divider';
import type { FormCardData } from '../../config/dashboard-types';

export interface FormCardProps {
    form: FormCardData;
    onEdit?: (formId: string) => void;
    onDuplicate?: (formId: string) => void;
    onDelete?: (formId: string) => void;
    onView?: (formId: string) => void;
}

export const FormCard: Component<FormCardProps> = (props) => {
    const [menuOpen, setMenuOpen] = createSignal(false);
    let menuAnchor: HTMLButtonElement | undefined;

    const handleMenuClick = (e: MouseEvent) => {
        e.stopPropagation();
        setMenuOpen(true);
    };

    const handleAction = (action?: (id: string) => void) => {
        setMenuOpen(false);
        action?.(props.form.id);
    };

    return (
        <div class="form-card" onClick={() => props.onEdit?.(props.form.id)}>
            {/* Card Preview */}
            <div class="form-card__preview" style={{ background: props.form.color }}>
                <div class="form-card__preview-paper">
                    <Typography variant="label-small" color="on-surface-variant">
                        {props.form.name}
                    </Typography>
                </div>
            </div>

            {/* Card Content */}
            <div class="form-card__content">
                <div class="form-card__header">
                    <Typography variant="title-small">
                        {props.form.responses} Responses
                    </Typography>
                    <IconButton
                        ref={menuAnchor}
                        icon={<Icon name="more-vert" size={20} />}
                        size="sm"
                        variant="standard"
                        onClick={handleMenuClick}
                    />
                </div>

                <div class="form-card__footer">
                    <div class="form-card__creator-info">
                        <Avatar
                            initials={props.form.creator.charAt(0)}
                            size="xs"
                        />
                        <Typography variant="label-small" color="on-surface-variant">
                            {props.form.creator}
                        </Typography>
                    </div>
                    <IconButton
                        icon={<Icon name="info" size={16} />}
                        size="sm"
                        variant="standard"
                    />
                </div>
            </div>

            {/* Actions Menu */}
            <Menu
                open={menuOpen()}
                onClose={() => setMenuOpen(false)}
                anchorEl={menuAnchor}
                position="bottom-end"
            >
                <MenuItem
                    label="Edit"
                    leadingIcon={<Icon name="edit" size={20} />}
                    onClick={() => handleAction(props.onEdit)}
                />
                <MenuItem
                    label="Preview"
                    leadingIcon={<Icon name="eye" size={20} />}
                    onClick={() => handleAction(props.onView)}
                />
                <MenuItem
                    label="Duplicate"
                    leadingIcon={<Icon name="copy" size={20} />}
                    onClick={() => handleAction(props.onDuplicate)}
                />
                <MenuItem
                    label="Share"
                    leadingIcon={<Icon name="share" size={20} />}
                />
                <Divider />
                <MenuItem
                    label="Delete"
                    leadingIcon={<Icon name="trash" size={20} />}
                    onClick={() => handleAction(props.onDelete)}
                />
            </Menu>
        </div>
    );
};
