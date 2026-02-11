/**
 * FormAnywhere Use Cases Grid - Premium Design
 * Uses components from @formanywhere/ui following ui-principles
 * Features: Works Everywhere, Lightning Fast, Intelligent Formatting, etc.
 */
import { For, type Component } from 'solid-js';
import { Card, CardContent } from '@formanywhere/ui/card';
import { Typography } from '@formanywhere/ui/typography';
import { Box } from '@formanywhere/ui/box';

// --- Feature Card Component ---

interface FeatureCardProps {
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    delay: number;
}

const FeatureCard: Component<FeatureCardProps> = (props) => {
    return (
        <Card
            variant="outlined"
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
            {/* Image Area */}
            <Box
                display="flex"
                style={{
                    height: '220px',
                    'align-items': 'center',
                    'justify-content': 'center',
                    overflow: 'hidden',
                    background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
                }}
            >
                <img
                    src={props.imageSrc}
                    alt={props.imageAlt}
                    style={{
                        width: '100%',
                        height: '100%',
                        'object-fit': 'cover',
                        transition: 'transform 500ms ease-out',
                    }}
                    loading="lazy"
                />
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

// --- FormAnywhere Feature Data ---

const useCases = [
    {
        title: 'Field Services',
        description: 'Building inspections with photo evidence. Maintenance checklists with technician signatures. Delivery confirmations with GPS proof.',
        imageSrc: '/assets/features/drag-drop-builder.webp',
        alt: 'Field inspector with clipboard'
    },
    {
        title: 'Events & Conferences',
        description: 'Attendee registration with badge printing. Session feedback collection. Lead capture for exhibitors - all working offline.',
        imageSrc: '/assets/features/works-everywhere.webp',
        alt: 'Event registration booth'
    },
    {
        title: 'Healthcare',
        description: 'HIPAA-compliant patient intake forms. Symptom trackers with offline capability. Consent forms with e-signatures.',
        imageSrc: '/assets/features/secure-data.webp',
        alt: 'Medical clipboard with privacy shield'
    },
    {
        title: 'Retail & Inventory',
        description: 'Customer surveys at point of sale. Inventory audits with barcode scanning. Employee incident reports.',
        imageSrc: '/assets/features/any-platform.webp',
        alt: 'Retail store with mobile device'
    },
    {
        title: 'Construction',
        description: 'Safety inspection checklists. Daily progress reports with photos. Subcontractor time tracking with signatures.',
        imageSrc: '/assets/features/offline-first.webp',
        alt: 'Construction site with mobile form'
    },
    {
        title: 'Developing Markets',
        description: 'Full functionality in areas with unreliable internet. NGO field surveys. Agricultural data collection in rural zones.',
        imageSrc: '/assets/features/smart-logic.webp',
        alt: 'Global map with connectivity dots'
    },
];

// --- Main Grid Component ---

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
                        imageSrc={feature.imageSrc}
                        imageAlt={feature.alt}
                        delay={index() * 100}
                    />
                )}
            </For>

            <style>
                {`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .feature-card:hover {
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
                    transform: translateY(-2px);
                }
                
                .feature-card:hover img {
                    transform: scale(1.02);
                }
                
                @media (min-width: 768px) {
                    .use-cases-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
                
                @media (min-width: 1024px) {
                    .use-cases-grid {
                        grid-template-columns: repeat(3, 1fr) !important;
                    }
                }
                `}
            </style>
        </Box>
    );
};

export default UseCasesGrid;
