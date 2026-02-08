import { createSignal, For, onMount, onCleanup } from 'solid-js';
import {
    Typography,
    Chip,
    Button,
    Box,
    Card,
    Avatar
} from '@formanywhere/ui';

const features = [
    {
        id: 'ai',
        title: "AI Generation",
        subtitle: "Build in Seconds",
        desc: "Don't start from scratch. Tell FormAnywhere what you need, and watch it generate fields, rules, and workflows instantly.",
        color: "var(--m3-sys-color-primary)",
        bgGradient: "from-primary/20",
        icon: (
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
        ),
        mockup: (
            <Box display="flex" style={{ width: '100%', height: '100%', 'align-items': 'center', 'justify-content': 'center', padding: '2rem' }}>
                <Card variant="glass-strong" style={{
                    width: '100%',
                    'max-width': '32rem',
                    'border-radius': '32px',
                    overflow: 'hidden',
                    display: 'flex',
                    'flex-direction': 'column'
                }}>
                    {/* Window header */}
                    <Box
                        display="flex"
                        style={{
                            height: '3.5rem',
                            'border-bottom': '1px solid var(--m3-color-outline-variant, rgba(0,0,0,0.1))',
                            'align-items': 'center',
                            padding: '0 1.5rem',
                            'justify-content': 'space-between',
                            background: 'rgba(255,255,255,0.05)'
                        }}
                    >
                        <Box display="flex" style={{ 'align-items': 'center', gap: '0.75rem' }}>
                            <Box style={{ width: '12px', height: '12px', 'border-radius': '50%', background: 'var(--m3-color-error, #FF5630)', opacity: 0.8 }} />
                            <Box style={{ width: '12px', height: '12px', 'border-radius': '50%', background: 'var(--m3-color-warning, #FFAB00)', opacity: 0.8 }} />
                            <Box style={{ width: '12px', height: '12px', 'border-radius': '50%', background: 'var(--m3-color-success, #36B37E)', opacity: 0.8 }} />
                        </Box>
                        <Chip variant="label" label="gen_form.tsx" style={{ 'font-family': 'monospace', 'font-size': '10px' }} />
                    </Box>

                    {/* Chat content */}
                    <Box padding="lg" display="flex" style={{ 'flex-direction': 'column', gap: '1.5rem', position: 'relative' }}>
                        <Box style={{
                            position: 'absolute',
                            inset: '0',
                            background: 'linear-gradient(to bottom, rgba(var(--m3-color-primary-rgb, 99, 102, 241), 0.05), transparent)',
                            'pointer-events': 'none'
                        }} />

                        {/* AI message */}
                        <Box display="flex" style={{ gap: '1rem', 'max-width': '80%' }} class="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Avatar
                                size="md"
                                icon={
                                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" /></svg>
                                }
                                style={{ background: 'rgba(var(--m3-color-primary-rgb, 99, 102, 241), 0.1)', color: 'var(--m3-color-primary)' }}
                            />
                            <Card variant="glass-subtle" padding="md" style={{ 'border-radius': '1rem', 'border-top-left-radius': '0.25rem' }}>
                                <Typography variant="body-medium">What kind of form do you need today?</Typography>
                            </Card>
                        </Box>

                        {/* User message */}
                        <Box display="flex" style={{ gap: '1rem', 'max-width': '80%', 'align-self': 'flex-end', 'flex-direction': 'row-reverse' }} class="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                            <Avatar size="md" initials="ME" style={{ background: 'var(--m3-color-surface-variant)' }} />
                            <Card variant="filled" padding="md" style={{
                                'border-radius': '1rem',
                                'border-top-right-radius': '0.25rem',
                                background: 'var(--m3-color-primary)',
                                color: 'var(--m3-color-on-primary)'
                            }}>
                                <Typography variant="body-medium" style={{ color: 'inherit' }}>Registration for a tech conference with payment.</Typography>
                            </Card>
                        </Box>

                        {/* Generating indicator */}
                        <Box style={{
                            'margin-top': '0.5rem',
                            padding: '4px',
                            'border-radius': '20px',
                            background: 'linear-gradient(to right, var(--m3-color-primary), var(--m3-color-tertiary), var(--m3-color-primary))',
                            'background-size': '200% 100%',
                            animation: 'shimmer 3s linear infinite'
                        }}>
                            <Card variant="filled" padding="md" style={{ 'border-radius': '18px', display: 'flex', 'align-items': 'center', gap: '1rem' }}>
                                <Box display="flex" style={{ gap: '0.25rem' }}>
                                    <Box style={{ width: '8px', height: '8px', 'border-radius': '50%', background: 'var(--m3-color-primary)' }} class="animate-bounce" />
                                    <Box style={{ width: '8px', height: '8px', 'border-radius': '50%', background: 'var(--m3-color-primary)' }} class="animate-bounce delay-150" />
                                    <Box style={{ width: '8px', height: '8px', 'border-radius': '50%', background: 'var(--m3-color-primary)' }} class="animate-bounce delay-300" />
                                </Box>
                                <Typography variant="label-medium" style={{
                                    background: 'linear-gradient(to right, var(--m3-color-primary), var(--m3-color-tertiary))',
                                    '-webkit-background-clip': 'text',
                                    '-webkit-text-fill-color': 'transparent'
                                }}>
                                    Generating fields, logic, and payment gateway...
                                </Typography>
                            </Card>
                        </Box>
                    </Box>
                </Card>
            </Box>
        )
    },
    {
        id: 'offline',
        title: "Offline-First",
        subtitle: "Works Everywhere",
        desc: "Field teams can collect data without internet. Data is encrypted locally and auto-synced when connection is restored.",
        color: "var(--m3-sys-color-tertiary)",
        bgGradient: "from-tertiary/20",
        icon: (
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" /></svg>
        ),
        mockup: (
            <Box display="flex" style={{ width: '100%', height: '100%', 'align-items': 'center', 'justify-content': 'center', position: 'relative' }}>
                {/* Phone mockup */}
                <Card variant="elevated" style={{
                    width: '16rem',
                    height: '24rem',
                    'border-radius': '32px',
                    border: '6px solid var(--m3-color-surface-variant)',
                    transform: 'rotate(-12deg) translateY(2rem)',
                    'z-index': 10,
                    display: 'flex',
                    'flex-direction': 'column',
                    overflow: 'hidden'
                }}>
                    {/* Phone notch */}
                    <Box display="flex" style={{
                        height: '2rem',
                        background: 'var(--m3-color-surface-variant)',
                        'justify-content': 'center',
                        'padding-top': '0.5rem'
                    }}>
                        <Box style={{ width: '3rem', height: '4px', 'border-radius': '9999px', background: 'rgba(0,0,0,0.1)' }} />
                    </Box>

                    {/* Phone content */}
                    <Box style={{ flex: 1, background: 'var(--m3-color-surface)', position: 'relative', padding: '1rem' }}>
                        {/* Offline indicator background */}
                        <Box display="flex" style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'var(--m3-color-surface-container)',
                            'flex-direction': 'column',
                            'align-items': 'center',
                            'justify-content': 'center',
                            color: 'var(--m3-color-on-surface-variant)'
                        }}>
                            <svg class="w-16 h-16 mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8l5.46-6.8zM3.27 1.44 2 2.72l2.05 2.06C1.91 5.17 .51 6.13 .36 6.27l5.46 6.8 6.18 7.7 2.1-2.62 4.17 4.17 1.27-1.27L3.27 1.44zM7.88 7.88 12 12l2.43-2.43-6.55-1.69z" /></svg>
                        </Box>

                        {/* Data saved notification */}
                        <Card variant="elevated" padding="md" style={{
                            position: 'relative',
                            'z-index': 10,
                            'border-radius': '12px',
                            display: 'flex',
                            'align-items': 'center',
                            gap: '0.75rem'
                        }} class="animate-[bounce_3s_infinite]">
                            <Avatar
                                size="sm"
                                icon={<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7" /></svg>}
                                style={{ background: 'rgba(var(--m3-color-success-rgb, 54, 179, 126), 0.2)', color: 'var(--m3-color-success, #36B37E)' }}
                            />
                            <Box>
                                <Typography variant="label-medium" style={{ 'font-weight': 'bold' }}>Data Saved</Typography>
                                <Typography variant="label-small" color="on-surface-variant">Sync pending...</Typography>
                            </Box>
                        </Card>
                    </Box>
                </Card>

                {/* Syncing card */}
                <Card variant="glass-strong" padding="lg" style={{
                    position: 'absolute',
                    top: '2.5rem',
                    right: '5rem',
                    'border-radius': '24px',
                    display: 'flex',
                    'align-items': 'center',
                    gap: '1rem'
                }} class="animate-[float_4s_ease-in-out_infinite]">
                    <Box style={{
                        width: '3rem',
                        height: '3rem',
                        'border-radius': '50%',
                        border: '4px solid var(--m3-color-tertiary)',
                        'border-top-color': 'transparent'
                    }} class="animate-spin" />
                    <Box>
                        <Typography variant="title-medium" style={{ 'font-weight': 'bold' }}>Syncing...</Typography>
                        <Typography variant="body-small" style={{ opacity: 0.6 }}>Restoring connection</Typography>
                    </Box>
                </Card>
            </Box>
        )
    },
    {
        id: 'logic',
        title: "Smart Logic",
        subtitle: "No-Code Rules",
        desc: "Visual flowchart builder for complex branching logic. Show/hide fields, calculate values, and trigger webhooks.",
        color: "var(--m3-sys-color-secondary)",
        bgGradient: "from-secondary/20",
        icon: (
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 11V3h-7v3H9V3H2v8h7V8h2v10h4v3h7v-8h-7v3h-2V8h2v3z" /></svg>
        ),
        mockup: (
            <Box display="flex" style={{ width: '100%', height: '100%', 'align-items': 'center', 'justify-content': 'center', padding: '3rem', position: 'relative' }}>
                {/* Background glow */}
                <Box style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, var(--m3-color-secondary-container, rgba(99, 102, 241, 0.2)) 0%, transparent 70%)',
                    opacity: 0.3
                }} />

                {/* Flowchart container */}
                <Card variant="outlined" style={{
                    width: '100%',
                    height: '100%',
                    'border-radius': '32px',
                    'border-style': 'dashed',
                    background: 'rgba(var(--m3-color-surface-rgb, 255, 255, 255), 0.3)',
                    'backdrop-filter': 'blur(8px)',
                    padding: '2rem',
                    position: 'relative'
                }}>
                    {/* Start node */}
                    <Card variant="elevated" padding="md" style={{
                        position: 'absolute',
                        top: '2rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        'border-radius': '1rem',
                        display: 'flex',
                        'align-items': 'center',
                        gap: '0.5rem'
                    }}>
                        <Typography variant="label-medium" style={{ 'font-weight': 'bold' }}>START FORM</Typography>
                    </Card>

                    {/* Connector line */}
                    <Box style={{
                        position: 'absolute',
                        top: '6rem',
                        left: '50%',
                        width: '2px',
                        height: '3rem',
                        background: 'rgba(var(--m3-color-secondary-rgb, 99, 102, 241), 0.5)'
                    }} />

                    {/* Condition node */}
                    <Card variant="outlined" padding="md" style={{
                        position: 'absolute',
                        top: '9rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        'border-radius': '1rem',
                        'border-width': '2px',
                        'border-color': 'var(--m3-color-secondary)',
                        width: '12rem',
                        'z-index': 10,
                        display: 'flex',
                        'flex-direction': 'column',
                        'align-items': 'center',
                        gap: '0.25rem'
                    }}>
                        <Typography variant="label-small" style={{
                            'font-weight': 'bold',
                            color: 'var(--m3-color-secondary)',
                            'letter-spacing': '0.1em',
                            'text-transform': 'uppercase'
                        }}>CONDITION</Typography>
                        <Typography variant="label-large" style={{ 'font-weight': 'bold' }}>Budget $5k</Typography>
                    </Card>

                    {/* SVG connector lines */}
                    <svg class="absolute inset-0 pointer-events-none" aria-hidden="true">
                        <path d="M350,210 C350,250 200,250 200,300" stroke="var(--m3-sys-color-secondary)" stroke-width="2" fill="none" stroke-dasharray="8 4" class="animate-[dash_1s_linear_infinite]" />
                        <path d="M350,210 C350,250 500,250 500,300" stroke="var(--m3-sys-color-outline)" stroke-width="2" fill="none" />
                    </svg>

                    {/* VP Approval node */}
                    <Chip
                        variant="label"
                        label="VP Approval"
                        style={{
                            position: 'absolute',
                            top: '300px',
                            left: '150px',
                            background: 'var(--m3-color-secondary)',
                            color: 'var(--m3-color-on-secondary)',
                            'border-radius': '12px',
                            'border-top-left-radius': '0'
                        }}
                    />

                    {/* Auto-Approve node */}
                    <Chip
                        variant="label"
                        label="Auto-Approve"
                        style={{
                            position: 'absolute',
                            top: '300px',
                            right: '150px',
                            background: 'var(--m3-color-surface)',
                            color: 'var(--m3-color-on-surface-variant)',
                            border: '1px solid var(--m3-color-outline-variant)',
                            'border-radius': '12px'
                        }}
                    />
                </Card>
            </Box>
        )
    }
] as const;

const tabId = (id: string) => `feature-tab-${id}`;
const panelId = (id: string) => `feature-panel-${id}`;

export const FeatureTabs = () => {
    const [active, setActive] = createSignal(0);
    let interval: number | undefined;

    onMount(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) return;
        interval = window.setInterval(() => setActive((p) => (p + 1) % features.length), 6000);
    });

    onCleanup(() => {
        if (interval) window.clearInterval(interval);
    });

    return (
        <Box display="flex" style={{ width: '100%', 'flex-direction': 'column', gap: '3rem' }}>
            {/* Tab buttons */}
            <Box display="flex" style={{ 'justify-content': 'center' }}>
                <Card variant="glass-subtle" padding="xs" style={{
                    display: 'inline-flex',
                    'border-radius': '9999px',
                    gap: '0.25rem'
                }}>
                    <For each={features}>
                        {(feature, index) => {
                            const isActive = () => active() === index();
                            return (
                                <Button
                                    variant={isActive() ? "tonal" : "ghost"}
                                    onClick={() => {
                                        setActive(index());
                                        if (interval) window.clearInterval(interval);
                                    }}
                                    style={{
                                        'border-radius': '9999px',
                                        gap: '0.5rem',
                                        'font-weight': 'bold'
                                    }}
                                    aria-selected={isActive()}
                                    aria-controls={panelId(feature.id)}
                                >
                                    <Box style={{
                                        width: '8px',
                                        height: '8px',
                                        'border-radius': '50%',
                                        background: isActive() ? 'var(--m3-color-secondary)' : 'var(--m3-color-outline-variant)',
                                        transition: 'background 0.3s'
                                    }} />
                                    {feature.subtitle}
                                </Button>
                            );
                        }}
                    </For>
                </Card>
            </Box>

            <Card variant="glass" class="w-full h-auto md:h-[600px] overflow-hidden relative rounded-[48px]">
                {/* Background gradient */}
                <Box style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--m3-color-surface-container-low)',
                    opacity: 0.5
                }} />

                {/* Dynamic color gradient */}
                <Box style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at top right, ${features[active()].bgGradient.replace('from-', '').replace('/20', '/10')}, transparent 70%)`,
                    transition: 'background 1s'
                }} />

                <Box
                    class="flex flex-col md:flex-row"
                    style={{
                        height: '100%',
                        width: '100%',
                        position: 'relative',
                        'z-index': 10
                    }}
                >
                    <Box display="flex" style={{
                        'flex-direction': 'column',
                        'justify-content': 'center',
                        position: 'relative'
                    }} class="w-full feature-tab-left feature-tab-min-h-content shrink-0 min-w-0 p-8 md:p-0">
                        <For each={features}>
                            {(feature, index) => {
                                const isActive = () => active() === index();
                                return (
                                    <Box
                                        padding="xl"
                                        display="flex"
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            'flex-direction': 'column',
                                            'justify-content': 'center',
                                            opacity: isActive() ? 1 : 0,
                                            transform: isActive() ? 'translateY(0)' : 'translateY(-2rem)',
                                            'pointer-events': isActive() ? 'auto' : 'none',
                                            visibility: isActive() ? 'visible' : 'hidden',
                                            transition: 'all 0.7s',
                                            'z-index': isActive() ? 10 : 1
                                        }}
                                    >
                                        <Chip
                                            variant="label"
                                            label={`${feature.id.toUpperCase()} FEATURE`}
                                            style={{
                                                color: feature.color,
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                'backdrop-filter': 'blur(12px)',
                                                'margin-bottom': '1.5rem',
                                                width: 'fit-content'
                                            }}
                                        />
                                        <Typography
                                            variant="display-medium"
                                            class="mb-6 leading-tight tracking-tight"
                                            style={{ color: 'var(--m3-color-on-surface)' }}
                                        >
                                            {feature.title}
                                        </Typography>
                                        <Typography
                                            variant="body-large"
                                            class="leading-relaxed"
                                            style={{ color: 'var(--m3-color-on-surface-variant)', opacity: 0.9 }}
                                        >
                                            {feature.desc}
                                        </Typography>

                                        <Box style={{ 'margin-top': '2.5rem' }}>
                                            <Button
                                                variant="text"
                                                style={{ color: feature.color, padding: 0, gap: '0.5rem' }}
                                            >
                                                Learn more
                                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" aria-hidden="true">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </Button>
                                        </Box>
                                    </Box>
                                );
                            }}
                        </For>
                    </Box>

                    <Box style={{
                        position: 'relative',
                        background: 'rgba(var(--m3-color-surface-variant-rgb, 200, 200, 200), 0.05)',
                        'border-top': '1px solid rgba(255, 255, 255, 0.1)',
                        'backdrop-filter': 'blur(8px)',
                        overflow: 'hidden'
                    }} class="w-full feature-tab-right feature-tab-min-h-preview shrink-0 min-w-0 md:border-t-0 md:border-l" aria-hidden="true">
                        {/* Noise texture */}
                        <Box style={{
                            position: 'absolute',
                            inset: 0,
                            'background-image': "url('https://grainy-gradients.vercel.app/noise.svg')",
                            opacity: 0.2,
                            'mix-blend-mode': 'overlay'
                        }} />

                        <For each={features}>
                            {(feature, index) => {
                                const isActive = () => active() === index();
                                return (
                                    <Box style={{
                                        position: 'absolute',
                                        inset: 0,
                                        width: '100%',
                                        height: '100%',
                                        opacity: isActive() ? 1 : 0,
                                        transform: isActive()
                                            ? 'translateX(0) scale(1)'
                                            : index() < active()
                                                ? 'translateX(-20%) scale(0.95)'
                                                : 'translateX(20%) scale(0.95)',
                                        visibility: isActive() ? 'visible' : 'hidden',
                                        transition: 'all 1s cubic-bezier(0.25, 1, 0.5, 1)',
                                        'z-index': isActive() ? 10 : 1
                                    }}>
                                        {feature.mockup}
                                    </Box>
                                );
                            }}
                        </For>
                    </Box>
                </Box>
            </Card>

            <style>{`
                .feature-tab-min-h-content { min-height: 300px; }
                .feature-tab-min-h-preview { min-height: 350px; }
                @media (min-width: 768px) {
                    .feature-tab-left { width: 41.666667% !important; min-height: 450px !important; }
                    .feature-tab-right { width: 58.333333% !important; min-height: 450px !important; }
                }
                @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                @keyframes dash { to { stroke-dashoffset: -24; } }
                @media (prefers-reduced-motion: reduce) {
                    .animate-in,
                    .animate-[shimmer_3s_linear_infinite],
                    .animate-[float_4s_ease-in-out_infinite],
                    .animate-[dash_1s_linear_infinite] {
                        animation: none !important;
                    }
                }
            `}</style>
        </Box>
    );
};

export default FeatureTabs;
