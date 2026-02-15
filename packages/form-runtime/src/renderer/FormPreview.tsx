/**
 * FormPreview — @formanywhere/form-runtime
 * Standalone preview wrapper around FormRenderer.
 * Shows the rendered form in a centred card with device-preview chrome,
 * a success feedback screen, and submitted-data inspector.
 */
import { createSignal, createMemo, Show } from 'solid-js';
import type { Component, JSX } from 'solid-js';
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
    const [device, setDevice] = createSignal<'desktop' | 'tablet' | 'mobile'>('desktop');

    const deviceWidth = () => {
        switch (device()) {
            case 'mobile': return '375px';
            case 'tablet': return '768px';
            default: return '100%';
        }
    };

    const handleSubmit = (data: Record<string, unknown>) => {
        setPreviewData(data);
        props.onSubmit?.(data);
    };

    const handleReset = () => {
        setPreviewData(null);
    };

    /** Build CSS custom properties from theme settings */
    const themeStyle = createMemo((): JSX.CSSProperties => {
        const theme = props.schema.settings.theme;
        if (!theme) return {};
        const s: Record<string, string> = {};
        if (theme.primaryColor) s['--m3-color-primary'] = theme.primaryColor;
        if (theme.secondaryColor) s['--m3-color-secondary'] = theme.secondaryColor;
        if (theme.backgroundColor) s['--m3-color-background'] = theme.backgroundColor;
        if (theme.surfaceColor) s['--m3-color-surface-container-lowest'] = theme.surfaceColor;
        if (theme.borderRadius != null) s['--m3-shape-large'] = `${theme.borderRadius}px`;
        if (theme.fontFamily) s['font-family'] = `'${theme.fontFamily}', sans-serif`;
        return s as JSX.CSSProperties;
    });

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
                <div class="form-preview__toolbar-center">
                    <div class="form-preview__device-toggle">
                        <button
                            class="form-preview__device-btn"
                            classList={{ 'form-preview__device-btn--active': device() === 'desktop' }}
                            onClick={() => setDevice('desktop')}
                            title="Desktop"
                        >
                            <Icon name="monitor" size={16} />
                        </button>
                        <button
                            class="form-preview__device-btn"
                            classList={{ 'form-preview__device-btn--active': device() === 'tablet' }}
                            onClick={() => setDevice('tablet')}
                            title="Tablet"
                        >
                            <Icon name="tablet" size={16} />
                        </button>
                        <button
                            class="form-preview__device-btn"
                            classList={{ 'form-preview__device-btn--active': device() === 'mobile' }}
                            onClick={() => setDevice('mobile')}
                            title="Mobile"
                        >
                            <Icon name="smartphone" size={16} />
                        </button>
                    </div>
                </div>
                <Show when={props.onBackToEditor}>
                    <Button variant="outlined" onClick={props.onBackToEditor}>
                        <Icon name="pencil" size={16} />
                        Back to Editor
                    </Button>
                </Show>
            </div>

            {/* Injected Google Font */}
            <Show when={props.schema.settings.googleFontUrl}>
                <link rel="stylesheet" href={props.schema.settings.googleFontUrl} />
            </Show>

            {/* Injected Custom CSS */}
            <Show when={props.schema.settings.customCSS}>
                <style>{props.schema.settings.customCSS}</style>
            </Show>

            {/* Form card container */}
            <div class="form-preview__container">
                <div
                    class="form-preview__card"
                    style={{
                        'max-width': deviceWidth(),
                        transition: 'max-width 0.3s ease',
                        ...themeStyle(),
                    }}
                >
                    <Show
                        when={!previewData()}
                        fallback={
                            <div class="form-preview__success">
                                <div class="form-preview__success-icon">
                                    <Icon name="check-circle" size={56} />
                                </div>
                                <Typography variant="headline-small">
                                    {props.schema.settings.successHeading || 'Thank You!'}
                                </Typography>
                                <Typography variant="body-medium" color="on-surface-variant">
                                    {props.schema.settings.successMessage || 'Your response has been recorded.'}
                                </Typography>

                                {/* Optional redirect info */}
                                <Show when={props.schema.settings.redirectUrl}>
                                    <Typography variant="body-small" color="on-surface-variant">
                                        Redirecting to {props.schema.settings.redirectUrl}
                                        {props.schema.settings.redirectDelay ? ` in ${props.schema.settings.redirectDelay}s...` : '...'}
                                    </Typography>
                                </Show>

                                {/* Optional custom button */}
                                <Show when={props.schema.settings.successButtonText}>
                                    <Button
                                        variant="tonal"
                                        onClick={() => {
                                            const url = props.schema.settings.successButtonUrl;
                                            if (url) window.open(url, '_blank');
                                        }}
                                    >
                                        {props.schema.settings.successButtonText}
                                    </Button>
                                </Show>

                                <Show when={props.schema.settings.successShowData !== false}>
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
                                </Show>

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
