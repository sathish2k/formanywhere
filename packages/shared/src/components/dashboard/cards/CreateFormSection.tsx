/**
 * Create Form Section — SolidJS
 * 4 cards for creating new forms
 */
import { Component, For } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Icon } from '@formanywhere/ui/icon';
import { createFormOptions } from '../dashboard.types';
import type { CreateFormOption } from '../dashboard.types';

export interface CreateFormSectionProps {
    onSelectOption: (optionId: string) => void;
}

export const CreateFormSection: Component<CreateFormSectionProps> = (props) => {
    const getIconBoxClass = (variant: CreateFormOption['variant']) => {
        switch (variant) {
            case 'dashed':
                return 'create-form-card__icon-box create-form-card__icon-box--dashed';
            case 'gradient':
                return 'create-form-card__icon-box create-form-card__icon-box--gradient';
            case 'outlined':
                return 'create-form-card__icon-box create-form-card__icon-box--outlined';
            default:
                return 'create-form-card__icon-box';
        }
    };

    return (
        <div class="create-form-section">
            <Typography variant="headline-small" class="create-form-section__title">
                Create Form
            </Typography>
            <div class="create-form-grid">
                <For each={createFormOptions}>
                    {(option) => (
                        <div
                            class={`create-form-card create-form-card--${option.variant}`}
                            onClick={() => props.onSelectOption(option.id)}
                        >
                            <div class={getIconBoxClass(option.variant)}>
                                <Icon name={option.icon} size={option.variant === 'dashed' ? 48 : option.variant === 'outlined' ? 36 : 28} />
                            </div>
                            <Typography variant="title-small" class="create-form-card__title">
                                {option.title}
                            </Typography>
                            <Typography variant="label-small" class="create-form-card__description">
                                {option.description}
                            </Typography>
                        </div>
                    )}
                </For>
            </div>
        </div>
    );
};
