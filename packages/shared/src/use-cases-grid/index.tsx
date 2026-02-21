/**
 * FormAnywhere Use Cases Grid - Premium Design
 * Uses CSS-animated SVG illustrations inside each card
 * Inspired by agently.dev's feature section micro-animations
 */
import { For, type Component } from 'solid-js';
import { Card, CardContent } from '@formanywhere/ui/card';
import { Typography } from '@formanywhere/ui/typography';
import { Box } from '@formanywhere/ui/box';

// ─── Animated SVG Illustrations ───────────────────────────────────────────

/** Field Services – Clipboard with checkmarks animating one by one */
const FieldServicesIllustration: Component = () => (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="uc-illustration">
        {/* Clipboard body */}
        <rect x="70" y="28" width="140" height="160" rx="12" fill="var(--m3-color-surface-container, #1e2a32)" stroke="var(--m3-color-outline-variant, #454f5b)" stroke-width="1.5" />
        <rect x="105" y="20" width="70" height="20" rx="10" fill="var(--m3-color-surface-container-high, #2d3a42)" stroke="var(--m3-color-outline-variant)" stroke-width="1" />
        <circle cx="140" cy="30" r="4" fill="var(--m3-color-primary)" />

        {/* Lines + check items */}
        {[0, 1, 2, 3].map((i) => (
            <g class={`uc-check-item uc-check-delay-${i}`}>
                <rect x="95" y={58 + i * 32} width="100" height="8" rx="4" fill="var(--m3-color-surface-container-high, #2d3a42)" />
                <circle cx="85" cy={62 + i * 32} r="6" fill="none" stroke="var(--m3-color-outline, #637381)" stroke-width="1.5" class="uc-check-circle" />
                <path d={`M82 ${62 + i * 32}l2 2 4-4`} stroke="var(--m3-color-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="uc-checkmark" />
            </g>
        ))}

        {/* Camera/photo icon */}
        <g class="uc-float" style={{ "transform-origin": "205px 155px" }}>
            <rect x="190" y="140" width="30" height="26" rx="5" fill="var(--m3-color-primary)" opacity="0.15" />
            <circle cx="205" cy="152" r="5" stroke="var(--m3-color-primary)" stroke-width="1.5" fill="none" />
            <rect x="199" y="142" width="12" height="4" rx="2" fill="var(--m3-color-primary)" opacity="0.5" />
        </g>
    </svg>
);

/** Events & Conferences – Badge sliding in with counter */
const EventsIllustration: Component = () => (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="uc-illustration">
        {/* Badge card */}
        <g class="uc-slide-in">
            <rect x="80" y="35" width="120" height="145" rx="12" fill="var(--m3-color-surface-container, #1e2a32)" stroke="var(--m3-color-outline-variant, #454f5b)" stroke-width="1.5" />
            {/* Photo area */}
            <circle cx="140" cy="80" r="25" fill="var(--m3-color-primary)" opacity="0.12" />
            <circle cx="140" cy="75" r="10" stroke="var(--m3-color-primary)" stroke-width="1.5" fill="none" />
            <path d="M128 92a12 12 0 0124 0" stroke="var(--m3-color-primary)" stroke-width="1.5" fill="none" />
            {/* Name line */}
            <rect x="105" y="115" width="70" height="8" rx="4" fill="var(--m3-color-surface-container-high, #2d3a42)" />
            <rect x="115" y="130" width="50" height="6" rx="3" fill="var(--m3-color-outline-variant, #454f5b)" />
            {/* QR code */}
            <g transform="translate(122, 145)">
                <rect width="6" height="6" fill="var(--m3-color-primary)" opacity="0.6" />
                <rect x="8" width="6" height="6" fill="var(--m3-color-primary)" opacity="0.4" />
                <rect x="16" width="6" height="6" fill="var(--m3-color-primary)" opacity="0.6" />
                <rect y="8" width="6" height="6" fill="var(--m3-color-primary)" opacity="0.4" />
                <rect x="8" y="8" width="6" height="6" fill="var(--m3-color-primary)" opacity="0.7" />
                <rect x="16" y="8" width="6" height="6" fill="var(--m3-color-primary)" opacity="0.3" />
            </g>
        </g>

        {/* Attendee counter */}
        <g class="uc-counter-pulse" style={{ "transform-origin": "225px 55px" }}>
            <rect x="200" y="40" width="52" height="28" rx="14" fill="var(--m3-color-primary)" />
            <text x="214" y="59" fill="var(--m3-color-on-primary)" font-size="12" font-weight="700" font-family="Inter, sans-serif">247</text>
        </g>
    </svg>
);

/** Healthcare – Shield with intake form sliding */
const HealthcareIllustration: Component = () => (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="uc-illustration">
        {/* Shield */}
        <g class="uc-pulse" style={{ "transform-origin": "140px 95px" }}>
            <path d="M140 30l55 20v50c0 30-22 55-55 70-33-15-55-40-55-70V50l55-20z" fill="var(--m3-color-primary)" opacity="0.08" stroke="var(--m3-color-primary)" stroke-width="1.5" />
            {/* Cross icon */}
            <rect x="134" y="70" width="12" height="40" rx="3" fill="var(--m3-color-primary)" opacity="0.5" />
            <rect x="124" y="83" width="32" height="12" rx="3" fill="var(--m3-color-primary)" opacity="0.5" />
        </g>

        {/* Form sliding in from right */}
        <g class="uc-slide-right">
            <rect x="185" y="55" width="70" height="90" rx="8" fill="var(--m3-color-surface-container, #1e2a32)" stroke="var(--m3-color-outline-variant)" stroke-width="1" />
            {[0, 1, 2, 3].map((i) => (
                <rect x="195" y={70 + i * 18} width={45 - i * 5} height="5" rx="2.5" fill="var(--m3-color-surface-container-high, #2d3a42)" />
            ))}
            {/* Signature line */}
            <path d="M195 130c5-5 10 3 15-2s10 4 15-1" stroke="var(--m3-color-primary)" stroke-width="1.5" fill="none" class="uc-draw-line" />
        </g>
    </svg>
);

/** Retail & Inventory – Barcode scan + cart items */
const RetailIllustration: Component = () => (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="uc-illustration">
        {/* Barcode */}
        <g transform="translate(90, 40)">
            {[0, 8, 14, 20, 28, 34, 38, 44, 50, 56, 62, 68, 74, 80, 88, 94].map((x) => (
                <rect x={x} y="0" width={x % 14 === 0 ? 4 : 2} height={50} fill="var(--m3-color-on-surface, white)" opacity="0.7" />
            ))}
        </g>

        {/* Scan line */}
        <line x1="85" y1="65" x2="195" y2="65" stroke="var(--m3-color-primary)" stroke-width="2" class="uc-scan-line" opacity="0.8" />

        {/* Item cards popping in */}
        {[0, 1, 2].map((i) => (
            <g class={`uc-pop-in uc-pop-delay-${i}`}>
                <rect x={75 + i * 55} y="110" width="45" height="55" rx="6" fill="var(--m3-color-surface-container, #1e2a32)" stroke="var(--m3-color-outline-variant)" stroke-width="1" />
                <rect x={82 + i * 55} y="118" width="31" height="20" rx="4" fill="var(--m3-color-primary)" opacity={0.08 + i * 0.04} />
                <rect x={82 + i * 55} y="145" width="25" height="5" rx="2.5" fill="var(--m3-color-surface-container-high, #2d3a42)" />
                <rect x={82 + i * 55} y="154" width="18" height="4" rx="2" fill="var(--m3-color-outline-variant, #454f5b)" />
            </g>
        ))}
    </svg>
);

/** Construction – Progress bar + photo stack */
const ConstructionIllustration: Component = () => (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="uc-illustration">
        {/* Hard hat */}
        <g class="uc-float" style={{ "transform-origin": "140px 50px" }}>
            <path d="M100 65h80M105 65c0-22 15-35 35-35s35 13 35 35" fill="none" stroke="var(--m3-color-primary)" stroke-width="2.5" stroke-linecap="round" />
            <rect x="95" y="62" width="90" height="8" rx="4" fill="var(--m3-color-primary)" opacity="0.3" />
        </g>

        {/* Progress bar */}
        <rect x="60" y="90" width="160" height="12" rx="6" fill="var(--m3-color-surface-container, #1e2a32)" />
        <rect x="60" y="90" width="0" height="12" rx="6" fill="var(--m3-color-primary)" class="uc-progress-fill" />
        <text x="140" y="100" text-anchor="middle" fill="var(--m3-color-on-surface, white)" font-size="8" font-weight="600" font-family="Inter, sans-serif" class="uc-progress-text">78%</text>

        {/* Photo evidence stack */}
        {[0, 1, 2].map((i) => (
            <g class={`uc-stack-in uc-stack-delay-${i}`} style={{ "transform-origin": `${130 + i * 8}px ${140 + i * 5}px` }}>
                <rect x={85 + i * 8} y={120 + i * 5} width="55" height="40" rx="6" fill="var(--m3-color-surface-container, #1e2a32)" stroke="var(--m3-color-outline-variant)" stroke-width="1" />
                <rect x={90 + i * 8} y={125 + i * 5} width="45" height="22" rx="3" fill="var(--m3-color-primary)" opacity={0.06 + i * 0.04} />
                <circle cx={113 + i * 8} cy={130 + i * 5} r="5" stroke="var(--m3-color-primary)" stroke-width="1" fill="none" opacity="0.5" />
            </g>
        ))}
    </svg>
);

/** Developing Markets – Globe with connectivity dots pulsing */
const DevelopingMarketsIllustration: Component = () => (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="uc-illustration">
        {/* Globe */}
        <circle cx="140" cy="100" r="55" fill="none" stroke="var(--m3-color-outline-variant, #454f5b)" stroke-width="1" />
        <ellipse cx="140" cy="100" rx="30" ry="55" fill="none" stroke="var(--m3-color-outline-variant, #454f5b)" stroke-width="0.8" />
        <line x1="85" y1="100" x2="195" y2="100" stroke="var(--m3-color-outline-variant, #454f5b)" stroke-width="0.8" />
        <ellipse cx="140" cy="80" rx="50" ry="12" fill="none" stroke="var(--m3-color-outline-variant, #454f5b)" stroke-width="0.8" />
        <ellipse cx="140" cy="120" rx="50" ry="12" fill="none" stroke="var(--m3-color-outline-variant, #454f5b)" stroke-width="0.8" />

        {/* Connectivity dots */}
        {[
            { cx: 120, cy: 72, delay: 0 },
            { cx: 160, cy: 85, delay: 1 },
            { cx: 130, cy: 115, delay: 2 },
            { cx: 155, cy: 125, delay: 3 },
            { cx: 110, cy: 100, delay: 4 },
            { cx: 170, cy: 105, delay: 5 },
        ].map((dot) => (
            <g class={`uc-dot-pulse uc-dot-delay-${dot.delay}`}>
                <circle cx={dot.cx} cy={dot.cy} r="3.5" fill="var(--m3-color-primary)" />
                <circle cx={dot.cx} cy={dot.cy} r="8" fill="none" stroke="var(--m3-color-primary)" stroke-width="1" class="uc-wave-ring" />
            </g>
        ))}

        {/* Signal waves */}
        <g class="uc-signal" style={{ "transform-origin": "220px 60px" }}>
            <path d="M210 70a15 15 0 010-20" stroke="var(--m3-color-primary)" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5" />
            <path d="M215 75a22 22 0 010-30" stroke="var(--m3-color-primary)" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.35" />
            <path d="M220 80a30 30 0 010-40" stroke="var(--m3-color-primary)" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.2" />
        </g>
    </svg>
);

// Map illustration type to component
const illustrations: Record<string, Component> = {
    'field-services': FieldServicesIllustration,
    'events': EventsIllustration,
    'healthcare': HealthcareIllustration,
    'retail': RetailIllustration,
    'construction': ConstructionIllustration,
    'developing-markets': DevelopingMarketsIllustration,
};

// --- Feature Card ---

interface FeatureCardProps {
    title: string;
    description: string;
    illustrationType: string;
    delay: number;
}

const FeatureCard: Component<FeatureCardProps> = (props) => {
    const Illustration = () => {
        const Comp = illustrations[props.illustrationType];
        return Comp ? <Comp /> : null;
    };

    return (
        <Card
            variant="glass"
            class="feature-card"
            style={{
                animation: `fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${props.delay}ms forwards`,
                opacity: '0',
                height: '100%',
                display: 'flex',
                'flex-direction': 'column',
                'border-radius': '16px',
                'box-shadow': '0 2px 12px rgba(0, 0, 0, 0.04)',
                transition: 'all 300ms ease-out',
            }}
        >
            {/* Illustration Area */}
            <Box
                display="flex"
                style={{
                    height: '220px',
                    'align-items': 'center',
                    'justify-content': 'center',
                    overflow: 'hidden',
                    background: 'linear-gradient(to bottom right, var(--m3-color-surface-container-lowest, #0a0a0a), var(--m3-color-surface-container-low, #141a21))',
                    'border-radius': '16px 16px 0 0',
                    padding: '16px',
                }}
            >
                <Illustration />
            </Box>

            {/* Text Content */}
            <CardContent style={{
                flex: '1',
                display: 'flex',
                'flex-direction': 'column',
                padding: '20px 24px 32px',
            }}>
                <Typography
                    variant="title-medium"
                    color="on-surface"
                    as="h3"
                    style={{ 'margin-bottom': '8px' }}
                >
                    {props.title}
                </Typography>
                <Typography
                    variant="body-medium"
                    color="on-surface-variant"
                    style={{ 'line-height': '1.6' }}
                >
                    {props.description}
                </Typography>
            </CardContent>
        </Card>
    );
};

// --- Data ---

const useCases = [
    {
        title: 'Field Services',
        description: 'Building inspections with photo evidence. Maintenance checklists with technician signatures. Delivery confirmations with GPS proof.',
        type: 'field-services',
    },
    {
        title: 'Events & Conferences',
        description: 'Attendee registration with badge printing. Session feedback collection. Lead capture for exhibitors - all working offline.',
        type: 'events',
    },
    {
        title: 'Healthcare',
        description: 'HIPAA-compliant patient intake forms. Symptom trackers with offline capability. Consent forms with e-signatures.',
        type: 'healthcare',
    },
    {
        title: 'Retail & Inventory',
        description: 'Customer surveys at point of sale. Inventory audits with barcode scanning. Employee incident reports.',
        type: 'retail',
    },
    {
        title: 'Construction',
        description: 'Safety inspection checklists. Daily progress reports with photos. Subcontractor time tracking with signatures.',
        type: 'construction',
    },
    {
        title: 'Developing Markets',
        description: 'Full functionality in areas with unreliable internet. NGO field surveys. Agricultural data collection in rural zones.',
        type: 'developing-markets',
    },
];

// --- Main Grid ---

export const UseCasesGrid: Component = () => {
    return (
        <Box
            maxWidth="7xl"
            marginX="auto"
            paddingX="md"
            style={{
                display: 'grid',
                'grid-template-columns': 'repeat(1, 1fr)',
                gap: '32px',
            }}
            class="use-cases-grid"
        >
            <For each={useCases}>
                {(feature, index) => (
                    <FeatureCard
                        title={feature.title}
                        description={feature.description}
                        illustrationType={feature.type}
                        delay={index() * 100}
                    />
                )}
            </For>

            <style>
                {`
                /* ─── Grid Animations ──────────────────────── */
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .feature-card:hover {
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
                    transform: translateY(-2px);
                }
                @media (min-width: 768px) {
                    .use-cases-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }
                @media (min-width: 1024px) {
                    .use-cases-grid { grid-template-columns: repeat(3, 1fr) !important; }
                }

                /* ─── Illustration Shared ──────────────────── */
                .uc-illustration {
                    width: 100%;
                    max-width: 260px;
                    height: auto;
                }

                /* ─── Checkmark Items (Field Services) ────── */
                @keyframes checkAppear {
                    0%   { stroke-dashoffset: 20; opacity: 0; }
                    50%  { opacity: 1; }
                    100% { stroke-dashoffset: 0; opacity: 1; }
                }
                @keyframes circleCheck {
                    0%   { fill: transparent; }
                    100% { fill: color-mix(in srgb, var(--m3-color-primary) 15%, transparent); }
                }
                .uc-checkmark {
                    stroke-dasharray: 20;
                    stroke-dashoffset: 20;
                    animation: checkAppear 0.5s ease-out forwards;
                }
                .uc-check-circle {
                    animation: circleCheck 0.4s ease-out forwards;
                }
                .uc-check-delay-0 .uc-checkmark, .uc-check-delay-0 .uc-check-circle { animation-delay: 0.5s; }
                .uc-check-delay-1 .uc-checkmark, .uc-check-delay-1 .uc-check-circle { animation-delay: 1.2s; }
                .uc-check-delay-2 .uc-checkmark, .uc-check-delay-2 .uc-check-circle { animation-delay: 1.9s; }
                .uc-check-delay-3 .uc-checkmark, .uc-check-delay-3 .uc-check-circle { animation-delay: 2.6s; }
                .uc-check-item { animation: fadeInUp 0.4s ease-out both; }
                .uc-check-delay-0 { animation-delay: 0.3s; }
                .uc-check-delay-1 { animation-delay: 1.0s; }
                .uc-check-delay-2 { animation-delay: 1.7s; }
                .uc-check-delay-3 { animation-delay: 2.4s; }

                /* ─── Float (Camera, Hard Hat) ─────────────── */
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .uc-float { animation: float 3s ease-in-out infinite; }

                /* ─── Slide In (Badge) ─────────────────────── */
                @keyframes slideIn {
                    from { transform: translateX(-30px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .uc-slide-in { animation: slideIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s both; }

                /* ─── Counter Pulse ────────────────────────── */
                @keyframes counterPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                }
                .uc-counter-pulse { animation: counterPulse 2s ease-in-out infinite; animation-delay: 1s; }

                /* ─── Shield Pulse (Healthcare) ────────────── */
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.03); opacity: 0.9; }
                }
                .uc-pulse { animation: pulse 3s ease-in-out infinite; }

                /* ─── Slide Right (Form) ───────────────────── */
                @keyframes slideRight {
                    from { transform: translateX(40px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .uc-slide-right { animation: slideRight 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s both; }

                /* ─── Draw Line (Signature) ────────────────── */
                @keyframes drawLine {
                    from { stroke-dashoffset: 60; }
                    to { stroke-dashoffset: 0; }
                }
                .uc-draw-line {
                    stroke-dasharray: 60;
                    stroke-dashoffset: 60;
                    animation: drawLine 1.5s ease-out 1.2s forwards;
                }

                /* ─── Scan Line (Retail) ───────────────────── */
                @keyframes scanLine {
                    0%   { transform: translateY(-20px); opacity: 0.2; }
                    50%  { opacity: 0.9; }
                    100% { transform: translateY(20px); opacity: 0.2; }
                }
                .uc-scan-line { animation: scanLine 2s ease-in-out infinite; }

                /* ─── Pop In (Item Cards) ──────────────────── */
                @keyframes popIn {
                    from { transform: scale(0.7); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .uc-pop-in { animation: popIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
                .uc-pop-delay-0 { animation-delay: 0.8s; }
                .uc-pop-delay-1 { animation-delay: 1.2s; }
                .uc-pop-delay-2 { animation-delay: 1.6s; }

                /* ─── Progress Fill (Construction) ─────────── */
                @keyframes progressFill {
                    from { width: 0; }
                    to { width: 125px; }
                }
                .uc-progress-fill { animation: progressFill 2.5s ease-out 0.5s forwards; }

                /* ─── Photo Stack (Construction) ───────────── */
                @keyframes stackIn {
                    from { transform: translateY(20px) scale(0.9); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                .uc-stack-in { animation: stackIn 0.5s ease-out both; }
                .uc-stack-delay-0 { animation-delay: 1.5s; }
                .uc-stack-delay-1 { animation-delay: 1.9s; }
                .uc-stack-delay-2 { animation-delay: 2.3s; }

                /* ─── Dot Pulse (Globe) ────────────────────── */
                @keyframes dotPulse {
                    0%, 100% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.3); opacity: 1; }
                }
                .uc-dot-pulse { animation: dotPulse 2.5s ease-in-out infinite; }
                .uc-dot-delay-0 { animation-delay: 0s; }
                .uc-dot-delay-1 { animation-delay: 0.4s; }
                .uc-dot-delay-2 { animation-delay: 0.8s; }
                .uc-dot-delay-3 { animation-delay: 1.2s; }
                .uc-dot-delay-4 { animation-delay: 1.6s; }
                .uc-dot-delay-5 { animation-delay: 2.0s; }

                /* ─── Wave Ring (Connectivity) ─────────────── */
                @keyframes waveRing {
                    0% { r: 3.5; opacity: 0.6; }
                    100% { r: 16; opacity: 0; }
                }
                .uc-wave-ring { animation: waveRing 2.5s ease-out infinite; }
                .uc-dot-delay-0 .uc-wave-ring { animation-delay: 0s; }
                .uc-dot-delay-1 .uc-wave-ring { animation-delay: 0.4s; }
                .uc-dot-delay-2 .uc-wave-ring { animation-delay: 0.8s; }
                .uc-dot-delay-3 .uc-wave-ring { animation-delay: 1.2s; }
                .uc-dot-delay-4 .uc-wave-ring { animation-delay: 1.6s; }
                .uc-dot-delay-5 .uc-wave-ring { animation-delay: 2.0s; }

                /* ─── Signal Waves ─────────────────────────── */
                @keyframes signalPulse {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.7; }
                }
                .uc-signal path:nth-child(1) { animation: signalPulse 2s ease-in-out infinite 0s; }
                .uc-signal path:nth-child(2) { animation: signalPulse 2s ease-in-out infinite 0.3s; }
                .uc-signal path:nth-child(3) { animation: signalPulse 2s ease-in-out infinite 0.6s; }

                /* ─── Reduced Motion ───────────────────────── */
                @media (prefers-reduced-motion: reduce) {
                    .uc-float, .uc-pulse, .uc-counter-pulse, .uc-scan-line,
                    .uc-dot-pulse, .uc-wave-ring, .uc-signal path {
                        animation: none !important;
                    }
                }
                `}
            </style>
        </Box>
    );
};

export default UseCasesGrid;
