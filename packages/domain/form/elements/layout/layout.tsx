/**
 * LayoutField — renders structural / layout elements (heading, text-block,
 * divider, spacer, logo, grid, grid-column, container, section, card).
 *
 * Children are rendered via the injected `renderChild` callback so that
 * callers (FormRenderer, CanvasElement) control nested element rendering.
 *
 * Works in both 'editor' and 'runtime' contexts — there is no mode prop
 * because layout elements carry no field value.
 */
import type { Component } from 'solid-js';
import { For, Show } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import type { LayoutFieldProps } from '../field-types';

export const LayoutField: Component<LayoutFieldProps> = (props) => {
    const el = () => props.element;
    const children = () => el().elements ?? [];

    switch (el().type) {
        case 'heading': {
            const level = () => String((el() as any).level ?? '2');
            const sizeMap: Record<string, string> = {
                '1': '2rem', '2': '1.5rem', '3': '1.25rem', '4': '1.125rem',
            };
            return (
                <div
                    class="ff-heading"
                    style={{
                        'font-size': sizeMap[level()] ?? '1.5rem',
                        'font-weight': String((el() as any).headingWeight ?? '700'),
                        'text-align': (el() as any).alignment ?? 'left',
                        color: (el() as any).headingColor || undefined,
                        margin: '0',
                        'line-height': '1.25',
                    }}
                >
                    {el().label}
                </div>
            );
        }

        case 'text-block':
            return (
                <p
                    class="ff-text-block"
                    style={{ 'text-align': (el() as any).alignment ?? 'left', margin: '0' }}
                >
                    {el().label}
                </p>
            );

        case 'divider':
            return <hr class="ff-divider" style={{
                border: 'none',
                'border-top': '1px solid var(--m3-color-outline-variant, #C4C7C5)',
                margin: '8px 0',
                width: '100%',
            }} />;

        case 'spacer':
            return <div class="ff-spacer" style={{ height: `${(el() as any).height ?? 24}px` }} />;

        case 'logo':
            return (
                <Show when={(el() as any).src}>
                    <img
                        class="ff-logo"
                        src={(el() as any).src}
                        alt={el().label || 'Logo'}
                        style={{ width: (el() as any).width ? `${(el() as any).width}px` : undefined }}
                    />
                </Show>
            );

        case 'grid':
            return (
                <div
                    class="ff-grid"
                    style={{
                        display: 'grid',
                        'grid-template-columns': `repeat(${(el() as any).columns ?? 12}, 1fr)`,
                        gap: `${(el() as any).gap ?? 16}px`,
                        width: '100%',
                    }}
                >
                    <For each={children()}>{(child) => props.renderChild(child)}</For>
                </div>
            );

        case 'grid-column':
            return (
                <div
                    class="ff-grid-column"
                    style={{
                        'grid-column': `span ${(el() as any).span ?? (el() as any).columns ?? 6}`,
                        display: 'flex',
                        'flex-direction': 'column',
                        gap: '16px',
                        'min-width': '0',
                    }}
                >
                    <For each={children()}>{(child) => props.renderChild(child)}</For>
                </div>
            );

        case 'container':
        case 'section':
        case 'card': {
            const elPadding = (el() as any).padding;
            const elMargin = (el() as any).margin;
            const elMaxWidth = (el() as any).maxWidth;
            const elAlign = (el() as any).alignment;
            const isCentered = elAlign === 'center' && elMaxWidth;
            const isCard = el().type === 'card';
            const isSection = el().type === 'section';
            return (
                <div
                    class={`ff-${el().type}`}
                    style={{
                        display: 'flex',
                        'flex-direction': 'column',
                        gap: '16px',
                        padding: elPadding != null ? `${elPadding}px`
                            : isCard ? '20px'
                            : isSection ? '0'
                            : undefined,
                        margin: isCentered
                            ? `${elMargin ?? 0}px auto`
                            : elMargin ? `${elMargin}px` : undefined,
                        'max-width': elMaxWidth ? `${elMaxWidth}px` : undefined,
                        'text-align': elAlign ?? undefined,
                        'border-radius': isCard ? 'var(--m3-shape-medium, 12px)' : undefined,
                        background: isCard ? 'var(--m3-color-surface-container-lowest, #fff)' : undefined,
                        border: isCard ? '1px solid var(--m3-color-outline-variant, #C4C7C5)' : undefined,
                        'border-bottom': isSection && !isCard ? '1px solid var(--m3-color-outline-variant, #C4C7C5)' : undefined,
                        'padding-bottom': isSection && !isCard ? '20px' : undefined,
                        'margin-bottom': isSection && !isCard ? '4px' : undefined,
                    }}
                >
                    <Show when={el().label && el().type !== 'container'}>
                        <Typography variant="title-small" class="ff-section__title" style={{
                            'font-weight': '600',
                            color: 'var(--m3-color-on-surface, #1C1B1F)',
                            'margin-bottom': '4px',
                        }}>
                            {el().label}
                        </Typography>
                    </Show>
                    <For each={children()}>{(child) => props.renderChild(child)}</For>
                </div>
            );
        }

        default:
            return null;
    }
};
