/**
 * Grid Layout Renderer (Preview)
 * Renders grid layout for form preview with responsive breakpoints
 */

'use client';

import { Box } from '@mui/material';
import type { DroppedElement } from '../../form-builder.configuration';
import { ElementRenderer } from '../ElementRenderer';

interface GridLayoutRendererProps {
    element: DroppedElement;
}

export function GridLayoutRenderer({ element }: GridLayoutRendererProps) {
    const gridItems = element.gridItems || [];
    const spacing = element.spacing || 2;

    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            <Box sx={{ display: 'flex', gap: spacing, flexWrap: 'wrap' }}>
                {gridItems.map((gridItem) => {
                    // Calculate width percentage based on grid size (out of 12)
                    const gridSize = typeof gridItem.size === 'number' ? gridItem.size : 12;
                    const widthPercent = (gridSize / 12) * 100;

                    return (
                        <Box
                            key={gridItem.id}
                            sx={{
                                width: `${widthPercent}%`,
                                minWidth: `${widthPercent}%`,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                px: spacing * 0.5
                            }}
                        >
                            {gridItem.children.map((child) => (
                                <ElementRenderer key={child.id} element={child} />
                            ))}
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}
