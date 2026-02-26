import { Component, For, Show, createSignal } from 'solid-js';
import { Card, CardContent } from '@formanywhere/ui/card';
import { Typography } from '@formanywhere/ui/typography';
import { Chip } from '@formanywhere/ui/chip';
import { Button } from '@formanywhere/ui/button';
import { Stack } from '@formanywhere/ui/stack';

export interface Template {
    id: string;
    name: string;
    description: string;
    category: string;
    popular: boolean;
    uses: string;
    fields: string[];
}

export interface TemplateCardProps {
    template: Template;
    onUse?: (id: string) => void | Promise<void>;
    onPreview?: (id: string) => void;
}

export const TemplateCard: Component<TemplateCardProps> = (props) => {
    const [usingTemplate, setUsingTemplate] = createSignal(false);

    const handleUse = async (e: MouseEvent) => {
        if (props.onUse) {
            e.preventDefault();
            setUsingTemplate(true);
            try {
                await props.onUse(props.template.id);
            } finally {
                setUsingTemplate(false);
            }
        }
    };

    return (
        <Card
            variant="outlined"
            style={{
                background: 'var(--m3-color-surface-container-lowest)',
                transition: 'all 0.5s cubic-bezier(0.2, 0, 0, 1)',
                border: '1px solid color-mix(in srgb, var(--m3-color-primary) 8%, transparent)',
                overflow: 'hidden',
                'border-radius': '24px',
                height: '100%',
                display: 'flex',
                'flex-direction': 'column',
                position: 'relative',
            }}
        >
            {/* Preview Top Section - Isometric Assembly */}
            <div
                style={{
                    height: '224px',
                    position: 'relative',
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    overflow: 'hidden',
                    background: 'linear-gradient(145deg, var(--m3-color-surface-container), var(--m3-color-surface-container-high))',
                    perspective: '1000px',
                }}
            >
                {/* Themed Aurora Mesh Background */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.85,
                        transition: 'opacity 1s ease',
                        background: `
                            radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--m3-color-primary-container) 50%, transparent) 0%, transparent 60%),
                            radial-gradient(circle at 0% 100%, color-mix(in srgb, var(--m3-color-tertiary-container) 40%, transparent) 0%, transparent 60%),
                            radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--m3-color-secondary-container) 30%, transparent) 0%, transparent 100%)
                        `,
                    }}
                />

                {/* Isometric Glass Stack */}
                <div
                    style={{
                        position: 'relative',
                        width: '128px',
                        height: '128px',
                        transform: 'rotateX(55deg) rotateZ(-45deg) translateZ(0px)',
                        'transform-style': 'preserve-3d',
                        transition: 'transform 0.7s cubic-bezier(0.2, 0, 0, 1)',
                    }}
                >
                    {/* Layer 1: Base Card */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'var(--m3-color-surface)',
                            'border-radius': '16px',
                            'box-shadow': '10px 10px 30px rgba(0,0,0,0.15)',
                            border: '1px solid var(--m3-color-outline-variant)',
                            transform: 'translateZ(0px)',
                        }}
                    />

                    {/* Layer 2: Input Field */}
                    <div
                        style={{
                            position: 'absolute',
                            left: '8px',
                            right: '8px',
                            top: '16px',
                            height: '32px',
                            background: 'var(--m3-color-surface-container-high)',
                            'border-radius': '8px',
                            border: '1px solid var(--m3-color-outline-variant)',
                            'backdrop-filter': 'blur(4px)',
                            'box-shadow': '0 1px 2px rgba(0,0,0,0.05)',
                            transform: 'translateZ(20px)',
                        }}
                    />

                    {/* Layer 3: Input Field */}
                    <div
                        style={{
                            position: 'absolute',
                            left: '8px',
                            right: '8px',
                            top: '56px',
                            height: '32px',
                            background: 'var(--m3-color-surface-container-high)',
                            'border-radius': '8px',
                            border: '1px solid var(--m3-color-outline-variant)',
                            'backdrop-filter': 'blur(4px)',
                            'box-shadow': '0 1px 2px rgba(0,0,0,0.05)',
                            transform: 'translateZ(40px)',
                        }}
                    />

                    {/* Layer 4: Floating Action Button */}
                    <div
                        style={{
                            position: 'absolute',
                            right: '8px',
                            bottom: '8px',
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, var(--m3-color-primary), var(--m3-color-tertiary))',
                            'border-radius': '12px',
                            'box-shadow': '0 10px 20px color-mix(in srgb, var(--m3-color-primary) 30%, transparent)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            transform: 'translateZ(60px)',
                            display: 'flex',
                            'align-items': 'center',
                            'justify-content': 'center',
                            color: 'var(--m3-color-on-primary)',
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
                        </svg>
                    </div>
                </div>

                {/* Popular Badge */}
                <Show when={props.template.popular}>
                    <div
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            display: 'flex',
                            'align-items': 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            'border-radius': '9999px',
                            'z-index': 20,
                            'box-shadow': '0 8px 16px -4px color-mix(in srgb, var(--m3-color-primary) 30%, transparent)',
                            background: 'var(--m3-color-primary)',
                            'backdrop-filter': 'blur(4px)',
                            border: '1px solid var(--glass-border-subtle, rgba(255,255,255,0.2))',
                        }}
                    >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--m3-color-on-primary)' }}>
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span style={{ "font-size": "10px", "font-weight": "700", "letter-spacing": "0.1em", "text-transform": "uppercase", color: "var(--m3-color-on-primary)" }}>Popular</span>
                    </div>
                </Show>
            </div>

            {/* Content Section */}
            <CardContent style={{ padding: '28px 24px 24px', flex: '1', display: 'flex', 'flex-direction': 'column' }}>
                <div style={{ "margin-bottom": "auto" }}>
                    {/* Category Label */}
                    <Typography
                        variant="label-small"
                        style={{
                            color: 'var(--m3-color-primary)',
                            'text-transform': 'uppercase',
                            'letter-spacing': '0.08em',
                            'font-weight': '700',
                            'font-size': '11px',
                            'margin-bottom': '10px',
                            display: 'block',
                        }}
                    >
                        {props.template.category}
                    </Typography>

                    <a href="/signup" style={{ "text-decoration": "none", color: "inherit", transition: "color 0.3s ease" }}>
                        <Typography
                            variant="title-large"
                            as="h3"
                            style={{
                                margin: '0 0 10px 0',
                                'font-weight': '700',
                                'font-size': '19px',
                                'letter-spacing': '-0.02em',
                                color: 'var(--m3-color-on-surface)',
                            }}
                        >
                            {props.template.name}
                        </Typography>
                    </a>

                    <Typography
                        variant="body-medium"
                        style={{
                            color: 'var(--m3-color-on-surface-variant)',
                            'line-height': '1.6',
                            'font-size': '14px',
                            opacity: '0.85',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            '-webkit-line-clamp': '2',
                            '-webkit-box-orient': 'vertical',
                        }}
                    >
                        {props.template.description}
                    </Typography>
                </div>

                {/* Footer Actions */}
                <Stack direction="row" align="center" justify="between" style={{
                    'margin-top': '28px',
                    'border-top': '1px solid var(--m3-color-outline-variant)',
                    'padding-top': '20px',
                }}>
                    {/* Usage Stats */}
                    <Stack direction="row" gap="xs" align="center">
                        <div style={{
                            display: 'flex',
                            'align-items': 'center',
                            'justify-content': 'center',
                            width: '28px',
                            height: '28px',
                            'border-radius': '9999px',
                            background: 'color-mix(in srgb, var(--m3-color-secondary-container) 50%, transparent)',
                            color: 'var(--m3-color-secondary)',
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <span style={{
                            'font-size': '13px',
                            'font-weight': '600',
                            color: 'var(--m3-color-on-surface-variant)',
                        }}>
                            {props.template.uses}
                        </span>
                    </Stack>

                    {/* Actions */}
                    <Stack direction="row" gap="xs" align="center">
                        <Show when={props.onPreview}>
                            <button
                                onClick={() => props.onPreview!(props.template.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    'font-size': '0.8125rem',
                                    'font-weight': '600',
                                    color: 'var(--m3-color-on-surface-variant)',
                                    padding: '4px 8px',
                                    'border-radius': '8px',
                                }}
                            >
                                Preview
                            </button>
                        </Show>
                        <a
                            href={props.onUse ? undefined : '/signup'}
                            onClick={handleUse}
                            style={{
                                display: 'flex',
                                'align-items': 'center',
                                gap: '8px',
                                'font-size': '0.875rem',
                                'font-weight': '700',
                                color: usingTemplate() ? 'var(--m3-color-on-surface-variant)' : 'var(--m3-color-primary)',
                                'text-decoration': 'none',
                                transition: 'color 0.3s ease',
                                cursor: usingTemplate() ? 'default' : 'pointer',
                                'pointer-events': usingTemplate() ? 'none' : 'auto',
                            }}
                        >
                            {usingTemplate() ? 'Opening...' : 'Use Template'}
                            <Show when={!usingTemplate()}>
                                <span style={{ transition: 'transform 0.3s ease' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </span>
                            </Show>
                        </a>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};
