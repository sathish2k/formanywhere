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
            return <hr class="ff-divider" />;

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
                    style={{ 'grid-template-columns': `repeat(${(el() as any).columns ?? 12}, 1fr)` }}
                >
                    <For each={children()}>{(child) => props.renderChild(child)}</For>
                </div>
            );

        case 'grid-column':
            return (
                <div
                    class="ff-grid-column"
                    style={{ 'grid-column': `span ${(el() as any).span ?? 6}` }}
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
            return (
                <div
                    class={`ff-${el().type}`}
                    style={{
                        padding: elPadding != null ? `${elPadding}px` : undefined,
                        margin: isCentered
                            ? `${elMargin ?? 0}px auto`
                            : elMargin ? `${elMargin}px` : undefined,
                        'max-width': elMaxWidth ? `${elMaxWidth}px` : undefined,
                        'text-align': elAlign ?? undefined,
                    }}
                >
                    <Show when={el().label && el().type !== 'container'}>
                        <Typography variant="title-small" class="ff-section__title">
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
