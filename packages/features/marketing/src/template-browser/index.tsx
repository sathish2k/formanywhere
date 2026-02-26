import { Component, createSignal, For, onMount, onCleanup } from 'solid-js';
import { Typography } from '@formanywhere/ui/typography';
import { Box } from '@formanywhere/ui/box';
import { Stack } from '@formanywhere/ui/stack';
import { TemplateCard, Template } from '../template-card';
import { CategoryFilter, Category } from '../category-filter';

export interface TemplateBrowserProps {
    initialTemplates: Template[];
    categories: Category[];
    iconPaths: Record<string, string>;
    onUse?: (id: string) => void | Promise<void>;
    onPreview?: (id: string) => void;
}

export const TemplateBrowser: Component<TemplateBrowserProps> = (props) => {
    const [selectedCategory, setSelectedCategory] = createSignal('all');
    const [searchQuery, setSearchQuery] = createSignal('');

    // Handle external search from Hero section
    onMount(() => {
        const handleSearch = (event: CustomEvent<string>) => {
            setSearchQuery(event.detail);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('search-templates', handleSearch as EventListener);
        }

        onCleanup(() => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('search-templates', handleSearch as EventListener);
            }
        });
    });

    const filteredTemplates = () => {
        const query = searchQuery().toLowerCase();
        const category = selectedCategory();

        return props.initialTemplates.filter((template) => {
            const matchesCategory = category === 'all' || template.category === category;
            const matchesSearch = template.name.toLowerCase().includes(query) ||
                template.description.toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
        });
    };

    return (
        <div>
            {/* Filter Section */}
            <div style={{ "margin-bottom": "2rem" }}>
                <CategoryFilter
                    categories={props.categories}
                    selected={selectedCategory()}
                    onSelect={setSelectedCategory}
                    iconPaths={props.iconPaths}
                />
            </div>

            {/* Results Header */}
            <Stack direction="row" align="center" justify="between" style={{ "margin-bottom": "2rem" }}>
                <div>
                    <Typography variant="title-large" as="h2" style={{ color: 'var(--m3-color-on-surface)', 'margin-bottom': '4px' }}>
                        {props.categories.find(c => c.id === selectedCategory())?.label || 'All Templates'}
                    </Typography>
                    <Typography variant="body-medium" style={{ color: 'var(--m3-color-on-surface-variant)' }}>
                        {filteredTemplates().length} template{filteredTemplates().length !== 1 ? 's' : ''} found
                    </Typography>
                </div>
            </Stack>

            {/* Templates Grid */}
            <div style={{
                display: "grid",
                "grid-template-columns": "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.5rem",
            }}>
                <For each={filteredTemplates()}>
                    {(template) => (
                        <TemplateCard
                            template={template}
                            onUse={props.onUse}
                            onPreview={props.onPreview}
                        />
                    )}
                </For>
            </div>

            {/* Empty State */}
            <div
                style={{
                    display: filteredTemplates().length === 0 ? 'block' : 'none',
                    'text-align': 'center',
                    padding: '64px 0'
                }}
            >
                <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    style={{ margin: '0 auto 16px', color: 'var(--m3-color-on-surface-variant)', opacity: 0.4 }}
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <Typography variant="title-medium" style={{ 'font-weight': 'bold', 'margin-bottom': '8px', color: 'var(--m3-color-on-surface)' }}>
                    No templates found
                </Typography>
                <Typography variant="body-medium" style={{ 'margin-bottom': '16px', color: 'var(--m3-color-on-surface-variant)' }}>
                    Try adjusting your search or filter criteria.
                </Typography>
                <button
                    onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                    style={{
                        padding: '8px 24px',
                        background: 'var(--m3-color-tertiary)',
                        color: 'var(--m3-color-on-tertiary)',
                        'font-weight': '600',
                        'border-radius': '10px',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Clear Filters
                </button>
            </div>
        </div>
    );
};
