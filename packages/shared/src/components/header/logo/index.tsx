/**
 * Logo Component
 * Brand logo with optional text for FormAnywhere
 */
import { Component, Show } from 'solid-js';

export interface LogoProps {
    showText?: boolean;
    class?: string;
}

export const Logo: Component<LogoProps> = (props) => {
    return (
        <a
            href="/"
            class={`flex items-center gap-3 transition-all duration-300 ${props.class || ''}`}
            style={{ 'text-decoration': 'none' }}
        >
            <div
                style={{
                    width: '32px',
                    height: '32px',
                    'border-radius': '8px',
                    background: 'linear-gradient(135deg, var(--m3-color-primary, #00A76F), var(--m3-color-primary-dark, #007867))',
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                }}
            >
                <svg
                    style={{ width: '20px', height: '20px', color: 'white' }}
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                </svg>
            </div>
            <Show when={props.showText !== false}>
                <span
                    style={{
                        color: 'var(--m3-color-on-surface, #1C1B1F)',
                        'font-weight': '600',
                        'font-size': '16px',
                    }}
                >
                    FormAnywhere
                </span>
            </Show>
        </a>
    );
};

export default Logo;
