/**
 * FAQ Item Component
 * Accordion item with expand/collapse animation
 */
import { Component, createSignal, Show, JSX } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { getIconPath } from '../../../utils/assets';

export interface FAQItemProps {
    question: string;
    answer: string;
    /** Initially expanded */
    defaultOpen?: boolean;
    class?: string;
}

export const FAQItem: Component<FAQItemProps> = (props) => {
    const [isOpen, setIsOpen] = createSignal(props.defaultOpen ?? false);

    const toggle = () => setIsOpen(!isOpen());

    return (
        <div
            class={props.class || ''}
            style={{
                border: '1px solid var(--m3-color-outline-variant)',
                'border-radius': '12px',
                overflow: 'hidden',
                background: 'var(--m3-color-surface)',
            }}
        >
            {/* Question button */}
            <button
                type="button"
                onClick={toggle}
                aria-expanded={isOpen()}
                style={{
                    width: '100%',
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'space-between',
                    padding: '20px',
                    background: 'var(--m3-color-surface)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    'text-align': 'left',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--m3-color-surface-container-low)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--m3-color-surface)';
                }}
            >
                <Typography
                    variant="title-small"
                    style={{
                        'font-weight': '600',
                        color: 'var(--m3-color-on-surface)',
                        flex: '1',
                        'padding-right': '16px',
                    }}
                >
                    {props.question}
                </Typography>
                <img
                    src={getIconPath('chevron-down')}
                    alt=""
                    style={{
                        width: '20px',
                        height: '20px',
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isOpen() ? 'rotate(180deg)' : 'rotate(0deg)',
                        'flex-shrink': '0',
                    }}
                />
            </button>

            {/* Answer content with animation */}
            <div
                style={{
                    display: 'grid',
                    'grid-template-rows': isOpen() ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <div style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '0 20px 20px' }}>
                        <Typography
                            variant="body-medium"
                            color="on-surface-variant"
                            style={{ 'line-height': '1.6' }}
                        >
                            {props.answer}
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQItem;
