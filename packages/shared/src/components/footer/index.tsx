/**
 * Footer Component - SolidJS implementation
 * Matches original Footer.astro design exactly
 */
import { Component, For } from 'solid-js';

interface FooterSection {
    title: string;
    links: { label: string; href: string }[];
}

const sections: FooterSection[] = [
    {
        title: 'Product',
        links: [
            { label: 'Features', href: '#features' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'Templates', href: '/templates' },
            { label: 'Integrations', href: '#integrations' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About', href: '/about' },
            { label: 'Blog', href: '/blog' },
            { label: 'Careers', href: '/careers' },
            { label: 'Contact', href: '/contact' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { label: 'Documentation', href: '/docs' },
            { label: 'Help Center', href: '/help' },
            { label: 'API Reference', href: '/api' },
            { label: 'Status', href: '/status' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
            { label: 'Security', href: '/security' },
        ],
    },
];

export interface FooterProps {
    class?: string;
}

export const Footer: Component<FooterProps> = (props) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            class={`relative text-on-primary overflow-hidden ${props.class || ''}`}
            role="contentinfo"
            style={{
                'background-color': 'var(--color-on-surface, #1C1B1F)',
                color: 'white',
            }}
        >
            {/* Subtle glass texture overlay */}
            <div
                class="absolute inset-0 opacity-30"
                style="background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%);"
            />

            <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Top Section */}
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                    {/* Brand */}
                    <div class="col-span-1 sm:col-span-2 md:col-span-1">
                        <a href="/" class="flex items-center gap-2 mb-4">
                            <div class="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                                <svg
                                    class="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                    />
                                </svg>
                            </div>
                            <span class="text-xl font-bold" style={{ color: 'white' }}>FormAnywhere</span>
                        </a>
                        <p class="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Build powerful forms that work offline. Collect data anywhere, sync
                            when connected.
                        </p>
                    </div>

                    {/* Links */}
                    <For each={sections}>
                        {(section) => (
                            <nav aria-label={section.title}>
                                <h4 class="label-large mb-4" style={{ color: 'white', 'font-weight': '600' }}>{section.title}</h4>
                                <ul class="space-y-2">
                                    <For each={section.links}>
                                        {(link) => (
                                            <li>
                                                <a
                                                    href={link.href}
                                                    class="text-sm transition-colors"
                                                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; }}
                                                >
                                                    {link.label}
                                                </a>
                                            </li>
                                        )}
                                    </For>
                                </ul>
                            </nav>
                        )}
                    </For>
                </div>

                {/* Bottom Section */}
                <div
                    class="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
                    style={{ 'border-top': '1px solid rgba(255, 255, 255, 0.15)' }}
                >
                    <p class="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        © {currentYear} FormAnywhere. All rights reserved.
                    </p>
                    <div class="flex items-center gap-4">
                        <a
                            href="https://twitter.com"
                            class="transition-colors"
                            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; }}
                            aria-label="Twitter"
                        >
                            <svg
                                class="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                        </a>
                        <a
                            href="https://github.com"
                            class="transition-colors"
                            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; }}
                            aria-label="GitHub"
                        >
                            <svg
                                class="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
