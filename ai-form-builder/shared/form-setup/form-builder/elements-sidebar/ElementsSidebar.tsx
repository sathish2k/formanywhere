/**
 * Elements Sidebar
 * Categorized list of draggable form elements
 */

'use client';

import { Box, Collapse, InputAdornment, TextField, Tooltip, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { ELEMENT_CATEGORIES, FORM_ELEMENTS } from '../elements/elements.types';
import type { ElementDefinition } from '../form-builder.configuration';

interface ElementsSidebarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  expandedCategories: Record<string, boolean>;
  onToggleCategory: (category: string) => void;
  onDragStart: (e: React.DragEvent, element: ElementDefinition) => void;
}

export function ElementsSidebar({
  searchQuery,
  onSearchChange,
  expandedCategories,
  onToggleCategory,
  onDragStart,
}: ElementsSidebarProps) {
  // Filter elements based on search
  const filteredElements = FORM_ELEMENTS.filter(
    (el) =>
      el.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedElements = filteredElements.reduce(
    (acc, element) => {
      if (!acc[element.category]) {
        acc[element.category] = [];
      }
      acc[element.category].push(element);
      return acc;
    },
    {} as Record<string, ElementDefinition[]>
  );

  return (
    <SidebarContainer>
      <SidebarHeader>
        <SidebarTitle>Form Elements</SidebarTitle>
        <SearchField
          fullWidth
          placeholder="Search elements..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} style={{ color: '#919EAB' }} />
              </InputAdornment>
            ),
          }}
        />
      </SidebarHeader>

      <ElementsList>
        {ELEMENT_CATEGORIES.map((category) => {
          const elements = groupedElements[category] || [];
          if (elements.length === 0) return null;
          const isExpanded = searchQuery ? true : (expandedCategories[category] ?? true);

          return (
            <CategoryContainer key={category}>
              <CategoryHeader
                onClick={() => !searchQuery && onToggleCategory(category)}
                isClickable={!searchQuery}
              >
                {!searchQuery &&
                  (isExpanded ? (
                    <ChevronDown size={16} style={{ color: '#637381' }} />
                  ) : (
                    <ChevronRight size={16} style={{ color: '#637381' }} />
                  ))}
                <CategoryLabel>{category}</CategoryLabel>
              </CategoryHeader>

              <Collapse in={isExpanded} timeout="auto">
                <ElementsGrid>
                  {elements.map((element) => {
                    const IconComponent = element.icon;
                    return (
                      <Tooltip
                        key={element.type}
                        title={element.description}
                        placement="right"
                        arrow
                      >
                        <DraggableElement
                          draggable
                          onDragStart={(e) => onDragStart(e, element)}
                          elementColor={element.color}
                        >
                          <ElementIconBox elementColor={element.color}>
                            <IconComponent size={18} />
                          </ElementIconBox>
                          <ElementLabel>{element.label}</ElementLabel>
                        </DraggableElement>
                      </Tooltip>
                    );
                  })}
                </ElementsGrid>
              </Collapse>
            </CategoryContainer>
          );
        })}
      </ElementsList>
    </SidebarContainer>
  );
}

// Styled Components
const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 280,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '2px 0 8px rgba(145, 158, 171, 0.04)',
}));

const SidebarHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingBottom: theme.spacing(2),
}));

const SidebarTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 800,
  fontSize: '1rem',
  color: theme.palette.text.primary,
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.grey[100],
    border: 'none',
    borderRadius: theme.spacing(1.5),
    fontSize: '0.875rem',
    transition: 'all 0.2s',
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.24)}`,
    },
  },
}));

const ElementsList = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  flex: 1,
  padding: theme.spacing(0, 2, 2),
}));

const CategoryContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
}));

const CategoryHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isClickable',
})<{ isClickable: boolean }>(({ theme, isClickable }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1, 1.5),
  cursor: isClickable ? 'pointer' : 'default',
  borderRadius: theme.spacing(1.5),
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: isClickable ? alpha('#919EAB', 0.08) : 'transparent',
  },
}));

const CategoryLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '0.6875rem',
  color: theme.palette.text.secondary,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
}));

const ElementsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  padding: theme.spacing(0, 0.5),
}));

const DraggableElement = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'elementColor',
})<{ elementColor: string }>(({ theme, elementColor }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  cursor: 'grab',
  transition: 'all 0.2s',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    borderColor: elementColor,
    backgroundColor: alpha(elementColor, 0.04),
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },
  '&:active': {
    cursor: 'grabbing',
    transform: 'translateY(0)',
  },
}));

const ElementIconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'elementColor',
})<{ elementColor: string }>(({ theme, elementColor }) => ({
  width: 36,
  height: 36,
  borderRadius: theme.spacing(1.5),
  backgroundColor: alpha(elementColor, 0.12),
  color: elementColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
}));

const ElementLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.75rem',
  textAlign: 'center',
  color: theme.palette.text.secondary,
  lineHeight: 1.2,
}));
