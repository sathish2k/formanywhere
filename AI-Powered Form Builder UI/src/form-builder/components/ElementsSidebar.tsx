/**
 * Elements Sidebar Component
 * Left sidebar with draggable form elements - Enhanced Minimals.cc inspired design
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Divider,
  Collapse,
  alpha,
  Tooltip,
} from '@mui/material';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { FormElement } from '../types/form.types';
import { FORM_ELEMENTS, ELEMENT_CATEGORIES } from '../config/elements.config';

interface ElementsSidebarProps {
  onDragStart: (e: React.DragEvent, element: FormElement) => void;
}

const DRAWER_WIDTH = 280;

export const ElementsSidebar: React.FC<ElementsSidebarProps> = ({ onDragStart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Input Fields': true,
    'Layout': true,
    'Content': true,
    'Advanced': false,
  });

  const filteredElements = FORM_ELEMENTS.filter(
    (el) =>
      el.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group elements by category
  const groupedElements = filteredElements.reduce((acc, element) => {
    if (!acc[element.category]) {
      acc[element.category] = [];
    }
    acc[element.category].push(element);
    return acc;
  }, {} as Record<string, FormElement[]>);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        height: '100%',
        boxShadow: '2px 0 8px rgba(145, 158, 171, 0.04)',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2,
            fontWeight: 800,
            color: 'text.primary',
            fontSize: '1rem',
            letterSpacing: '-0.02em',
          }}
        >
          Form Elements
        </Typography>
        
        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search elements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} style={{ color: '#919EAB' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'grey.100',
              border: 'none',
              borderRadius: 1.5,
              fontSize: '0.875rem',
              transition: 'all 0.2s',
              '& fieldset': {
                border: 'none',
              },
              '&:hover': {
                bgcolor: 'grey.200',
              },
              '&.Mui-focused': {
                bgcolor: 'background.paper',
                boxShadow: (theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.24)}`,
              },
            },
            '& .MuiInputBase-input': {
              py: 1.25,
            },
          }}
        />
      </Box>

      {/* Elements by Category */}
      <Box sx={{ overflowY: 'auto', flex: 1, px: 2, pb: 2 }}>
        {ELEMENT_CATEGORIES.map((category) => {
          const elements = groupedElements[category] || [];
          if (elements.length === 0) return null;
          
          const isExpanded = searchQuery ? true : (expandedCategories[category] ?? true);

          return (
            <Box key={category} sx={{ mb: 1.5 }}>
              {/* Category Header */}
              <Box
                onClick={() => !searchQuery && toggleCategory(category)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  py: 1,
                  px: 1.5,
                  cursor: searchQuery ? 'default' : 'pointer',
                  borderRadius: 1.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: searchQuery ? 'transparent' : alpha('#919EAB', 0.08),
                  },
                }}
              >
                {!searchQuery && (
                  isExpanded ? (
                    <ChevronDown size={16} style={{ color: '#637381' }} />
                  ) : (
                    <ChevronRight size={16} style={{ color: '#637381' }} />
                  )
                )}
                <Typography
                  variant="overline"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.6875rem',
                    color: 'text.secondary',
                    letterSpacing: '0.08em',
                  }}
                >
                  {category}
                </Typography>
              </Box>

              {/* Elements */}
              <Collapse in={isExpanded} timeout="auto">
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mt: 0.5, px: 0.5 }}>
                  {elements.map((element) => {
                    const Icon = element.icon;
                    return (
                      <Tooltip 
                        key={element.type} 
                        title={`Drag to add ${element.label}`}
                        placement="right"
                        arrow
                      >
                        <Box
                          draggable
                          onDragStart={(e) => onDragStart(e, element)}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                            p: 1.5,
                            borderRadius: 2,
                            cursor: 'grab',
                            transition: 'all 0.2s',
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.paper',
                            '&:hover': {
                              bgcolor: 'background.default',
                              borderColor: alpha(element.color, 0.4),
                              transform: 'translateY(-2px)',
                              boxShadow: `0 4px 12px ${alpha(element.color, 0.12)}`,
                            },
                            '&:active': {
                              cursor: 'grabbing',
                              transform: 'scale(0.98)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1.5,
                              bgcolor: alpha(element.color, 0.12),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              transition: 'all 0.2s',
                            }}
                          >
                            <Icon size={20} color={element.color} strokeWidth={2} />
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              fontSize: '0.6875rem',
                              color: 'text.primary',
                              textAlign: 'center',
                              lineHeight: 1.2,
                            }}
                          >
                            {element.label}
                          </Typography>
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};