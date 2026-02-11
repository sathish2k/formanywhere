/**
 * Templates Page Component
 * Browse and use form templates
 */

'use client';

import { defaultFooterProps, defaultFooterSections, defaultNavLinks } from '@/shared/config';
import {
  PopularTemplates,
  type Template,
  TemplateCategoryFilters,
  TemplatesCTASection,
  TemplatesGrid,
  TemplatesHeroSection,
} from '@/shared/templates';
import { Footer, Header } from '@/shared/ui';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { templateCategories } from './templates.configuration';
import { fetchTemplates } from './templates.datasource';

export function Templates() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [popularTemplates, setPopularTemplates] = useState<Template[]>([]);
  const [_loading, setLoading] = useState(true);

  // Fetch templates from API with filters
  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true);
      const data = await fetchTemplates({
        category: selectedCategory,
        search: searchQuery || undefined,
      });
      setTemplates(data);
      setLoading(false);
    };
    loadTemplates();
  }, [selectedCategory, searchQuery]);

  // Fetch popular templates separately (for hero section)
  useEffect(() => {
    const loadPopular = async () => {
      const data = await fetchTemplates({ category: 'all' });
      setPopularTemplates(data.filter((t) => t.popular));
    };
    loadPopular();
  }, []);

  const showPopular = selectedCategory === 'all' && !searchQuery;

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <PageWrapper>
      <Header navLinks={defaultNavLinks} signInLabel="Sign in" getStartedLabel="Try for Free" />

      <TemplatesHeroSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {showPopular && <PopularTemplates templates={popularTemplates} />}

      <TemplateCategoryFilters
        categories={templateCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <TemplatesGrid
        templates={templates}
        categories={templateCategories}
        selectedCategory={selectedCategory}
        onClearFilters={handleClearFilters}
      />

      <TemplatesCTASection />

      <Footer
        tagline={defaultFooterProps.tagline}
        sections={defaultFooterSections}
        copyright={defaultFooterProps.copyright}
      />
    </PageWrapper>
  );
}

// Styled Components
const PageWrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.grey[100],
}));
