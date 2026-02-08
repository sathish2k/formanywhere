/** @type {import('tailwindcss').Config} */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    content: [
        './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
        path.join(__dirname, '../../packages/ui/src/**/*.{ts,tsx}'),
        path.join(__dirname, '../../packages/shared/src/**/*.{ts,tsx}'),
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--color-primary)',
                    dark: 'var(--color-primary-dark)',
                    light: 'var(--color-primary-light)',
                },
                secondary: {
                    DEFAULT: 'var(--color-secondary)',
                    dark: 'var(--color-secondary-dark)',
                },
                tertiary: {
                    DEFAULT: 'var(--color-tertiary)',
                    dark: 'var(--color-tertiary-dark)',
                },
                success: 'var(--m3-color-success)',
                warning: 'var(--m3-color-warning)',
                error: 'var(--m3-color-error)',
                info: 'var(--m3-color-info)',
                background: {
                    default: 'var(--background-default)',
                    paper: 'var(--background-paper)',
                    neutral: 'var(--background-neutral)',
                },
                surface: {
                    DEFAULT: 'var(--m3-color-surface)',
                    dim: 'var(--m3-color-surface-dim)',
                    bright: 'var(--m3-color-surface-bright)',
                }
            },
            textColor: {
                primary: 'var(--text-primary)',
                secondary: 'var(--text-secondary)',
                disabled: 'var(--text-disabled)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                card: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
            },
        },
    },
    plugins: [],
};
// touch
