import { Component, For, Show } from 'solid-js';
import { Card, CardContent } from '@formanywhere/ui/card';
import { Typography } from '@formanywhere/ui/typography';
import { Chip } from '@formanywhere/ui/chip';
import { Button } from '@formanywhere/ui/button';

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
    onUse?: (id: string) => void;
}

export const TemplateCard: Component<TemplateCardProps> = (props) => {
    return (
        <Card
            variant="outlined"
            style={{
                background: 'var(--m3-color-surface-container-lowest)',
                transition: 'all 0.5s cubic-bezier(0.2, 0, 0, 1)',
                border: '1px solid rgba(var(--m3-ref-primary), 0.08)',
                overflow: 'hidden',
                'border-radius': '24px',
            }}
            class="hover:shadow-2xl hover:-translate-y-2 hover:border-primary/20 group h-full flex flex-col relative"
        >
            {/* Preview Top Section - Innovative Isometric Assembly */}
            <div
                class="h-56 relative flex items-center justify-center overflow-hidden perspective-1000"
                style={{
                    background: 'var(--m3-color-surface-container-low)',
                    perspective: '1000px'
                }}
            >
                {/* 1. Deep Aurora Mesh Background */}
                <div
                    class="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-1000"
                    style={{
                        background: `
                            radial-gradient(circle at 100% 0%, rgba(var(--m3-ref-primary), 0.2) 0%, transparent 60%),
                            radial-gradient(circle at 0% 100%, rgba(var(--m3-ref-tertiary), 0.15) 0%, transparent 60%),
                            radial-gradient(circle at 50% 50%, rgba(var(--m3-ref-secondary), 0.1) 0%, transparent 100%),
                            linear-gradient(to bottom, transparent, rgba(var(--m3-ref-primary), 0.05))
                        `
                    }}
                ></div>

                {/* 2. Isometric Glass Stack Assembly */}
                <div
                    class="relative w-32 h-32 transform-style-3d transition-transform duration-700 cubic-bezier(0.2, 0, 0, 1) group-hover:rotate-x-12 group-hover:rotate-y-12"
                    style={{
                        transform: 'rotateX(55deg) rotateZ(-45deg) translateZ(0px)',
                        'transform-style': 'preserve-3d'
                    }}
                >
                    {/* Layer 1: Base Card (Bottom) */}
                    <div
                        class="absolute inset-0 bg-surface-container-lowest rounded-2xl shadow-xl border border-white/20 transition-transform duration-500 delay-75 group-hover:translate-z-0"
                        style={{
                            'box-shadow': '10px 10px 30px rgba(0,0,0,0.2)',
                            transform: 'translateZ(0px)'
                        }}
                    ></div>

                    {/* Layer 2: Input Field (Middle) */}
                    <div
                        class="absolute inset-x-2 top-4 h-8 bg-white/40 rounded-lg border border-white/40 backdrop-blur-sm shadow-sm transition-transform duration-500 delay-100 group-hover:translate-z-12"
                        style={{
                            transform: 'translateZ(20px)'
                        }}
                    ></div>

                    {/* Layer 3: Input Field (Middle Top) */}
                    <div
                        class="absolute inset-x-2 top-14 h-8 bg-white/40 rounded-lg border border-white/40 backdrop-blur-sm shadow-sm transition-transform duration-500 delay-150 group-hover:translate-z-24"
                        style={{
                            transform: 'translateZ(40px)'
                        }}
                    ></div>

                    {/* Layer 4: Floating Action Button (Top) */}
                    <div
                        class="absolute right-2 bottom-2 w-10 h-10 bg-gradient-to-br from-primary to-tertiary rounded-xl shadow-lg border border-white/20 transition-transform duration-500 delay-200 group-hover:translate-z-36 hover:scale-110"
                        style={{
                            transform: 'translateZ(60px)',
                            'box-shadow': '0 10px 20px rgba(var(--m3-ref-primary), 0.3)'
                        }}
                    >
                        <div class="w-full h-full flex items-center justify-center text-white">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-7-7l7 7-7 7"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Popular Badge - Premium Shimmer Pill */}
                <Show when={props.template.popular}>
                    <div
                        class="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full z-20 shadow-lg border border-white/20"
                        style={{
                            background: 'rgba(var(--m3-ref-primary), 0.95)',
                            'box-shadow': '0 8px 16px -4px rgba(var(--m3-ref-primary), 0.3)',
                            'backdrop-filter': 'blur(4px)'
                        }}
                    >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" class="text-white">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                        </svg>
                        <span class="text-[10px] font-bold tracking-widest uppercase text-white">Popular</span>
                    </div>
                </Show>
            </div>

            {/* Content Section */}
            <CardContent style={{ padding: '28px 24px 24px', 'flex': '1', 'display': 'flex', 'flex-direction': 'column' }}>
                <div class="mb-auto">
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
                            display: 'block'
                        }}
                    >
                        {props.template.category}
                    </Typography>

                    <a href="/signup" class="no-underline group-hover:text-primary transition-colors duration-300">
                        <Typography
                            variant="title-large"
                            as="h3"
                            style={{
                                margin: '0 0 10px 0',
                                'font-weight': '700',
                                'font-size': '19px',
                                'letter-spacing': '-0.02em',
                                color: 'var(--m3-color-on-surface)'
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
                            '-webkit-box-orient': 'vertical'
                        }}
                    >
                        {props.template.description}
                    </Typography>
                </div>

                {/* Footer Actions */}
                <div style={{ 'margin-top': '28px', display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'border-top': '1px solid rgba(0,0,0,0.04)', 'padding-top': '20px' }}>

                    {/* Usage Stats */}
                    <div style={{ display: 'flex', 'align-items': 'center', gap: '8px' }}>
                        <div class="flex items-center justify-center w-7 h-7 rounded-full bg-secondary-container/50 text-secondary">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        </div>
                        <span style={{
                            'font-size': '13px',
                            'font-weight': '600',
                            color: 'var(--m3-color-on-surface-variant)'
                        }}>
                            {props.template.uses}
                        </span>
                    </div>

                    {/* Action */}
                    <a
                        href="/signup"
                        class="group/link flex items-center gap-2 text-sm font-bold text-primary no-underline hover:text-primary-dark transition-colors"
                    >
                        Use Template
                        <span class="transform transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-0.5">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
                            </svg>
                        </span>
                    </a>
                </div>
            </CardContent>
        </Card>
    );
};
