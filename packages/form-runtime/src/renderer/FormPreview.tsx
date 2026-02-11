/**
 * FormPreview — @formanywhere/form-runtime
 * Standalone preview wrapper around FormRenderer.
 * Shows the rendered form in a centred card with device-preview chrome,
 * a success feedback screen, and submitted-data inspector.
 */
import { createSignal, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Button } from '@formanywhere/ui/button';
import { Icon } from '@formanywhere/ui/icon';
import { Divider } from '@formanywhere/ui/divider';
import type { FormSchema } from '@formanywhere/shared/types';
import { FormRenderer } from './FormRenderer';
import '../styles.scss';

export interface FormPreviewProps {
    schema: FormSchema;
    onSubmit?: (data: Record<string, unknown>) => void;
    onBackToEditor?: () => void;
}

export const FormPreview: Component<FormPreviewProps> = (props) => {
    const [previewData, setPreviewData] = createSignal<Record<string, unknown> | null>(null);

    const handleSubmit = (data: Record<string, unknown>) => {
        setPreviewData(data);
        props.onSubmit?.(data);
    };

    const handleReset = () => {
        setPreviewData(null);
    };

    return (
        <div class="form-preview">
            {/* Preview toolbar */}
            <div class="form-preview__toolbar">
                <div class="form-preview__toolbar-left">
                    <div class="form-preview__badge">
                        <Icon name="eye" size={16} />
                        <Typography variant="label-medium">Preview Mode</Typography>
                    </div>
                    <Show when={props.schema.elements.length > 0}>
                        <Typography variant="body-small" color="on-surface-variant">
                            {props.schema.elements.length} {props.schema.elements.length === 1 ? 'field' : 'fields'}
                        </Typography>
                    </Show>
                </div>
                <Show when={props.onBackToEditor}>
                    <Button variant="outlined" onClick={props.onBackToEditor}>
                        <Icon name="pencil" size={16} />
                        Back to Editor
                    </Button>
                </Show>
            </div>

            {/* Form card container */}
            <div class="form-preview__container">
                <div class="form-preview__card">
                    <Show
                        when={!previewData()}
                        fallback={
                            <div class="form-preview__success">
                                <div class="form-preview__success-icon">
                                    <Icon name="check-circle" size={56} />
                                </div>
                                <Typography variant="headline-small">
                                    {props.schema.settings.successMessage}
                                </Typography>
                                <Typography variant="body-medium" color="on-surface-variant">
                                    This is a preview — no data was actually submitted.
                                </Typography>

                                <Divider />

                                {/* Submitted data inspector */}
                                <div class="form-preview__data-inspector">
                                    <div class="form-preview__data-header">
                                        <Icon name="file-text" size={16} />
                                        <Typography variant="label-medium" color="on-surface-variant">
                                            Submitted Values
                                        </Typography>
                                    </div>
                                    <pre class="form-preview__json">
                                        {JSON.stringify(previewData(), null, 2)}
                                    </pre>
                                </div>

                                <div class="form-preview__success-actions">
                                    <Button variant="outlined" onClick={handleReset}>
                                        <Icon name="redo" size={16} />
                                        Preview Again
                                    </Button>
                                    <Show when={props.onBackToEditor}>
                                        <Button variant="filled" onClick={props.onBackToEditor}>
                                            <Icon name="pencil" size={16} />
                                            Back to Editor
                                        </Button>
                                    </Show>
                                </div>
                            </div>
                        }
                    >
                        {/* Form header */}
                        <div class="form-preview__form-header">
                            <Typography variant="headline-small">
                                {props.schema.name}
                            </Typography>
                            <Show when={props.schema.description}>
                                <Typography variant="body-medium" color="on-surface-variant">
                                    {props.schema.description}
                                </Typography>
                            </Show>
                        </div>

                        <FormRenderer
                            schema={props.schema}
                            onSubmit={handleSubmit}
                        />
                    </Show>
                </div>
            </div>
        </div>
    );
};
