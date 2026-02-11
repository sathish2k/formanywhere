/**
 * Grid Layout Renderer (Canvas)
 * Renders grid layout with user-friendly add/remove column controls
 */

'use client';

import { Plus, GripVertical, Trash2 } from 'lucide-react';
import { Box, Button, Chip, IconButton, Tooltip, Typography, Grid } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import type { DroppedElement, GridItemConfig } from '../../form-builder.configuration';
import { ElementRenderer } from '../ElementRenderer';

interface GridLayoutRendererProps {
    element: DroppedElement;
    isSelected: boolean;
    onClick: () => void;
    onDeleteElement: (id: string) => void;
    onUpdateElement: (elementId: string, updates: Partial<DroppedElement>) => void;
    onDropIntoContainer: (containerId: string, newElement: DroppedElement, columnIndex?: number) => void;
    onSelectElement: (id: string) => void;
}

export function GridLayoutRenderer({
    element,
    isSelected,
    onClick,
    onDeleteElement,
    onUpdateElement,
    onDropIntoContainer,
    onSelectElement,
}: GridLayoutRendererProps) {
    const gridItems = element.gridItems || [];
    const spacing = element.spacing || 2;

    const handleDrop = (e: React.DragEvent, gridItemIndex: number) => {
        e.preventDefault();
        e.stopPropagation();

        const elementData = e.dataTransfer.getData('application/json');
        if (!elementData) return;

        const newElement = JSON.parse(elementData) as DroppedElement;
        onDropIntoContainer(element.id, newElement, gridItemIndex);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleAddColumn = () => {
        const newGridItems = [
            ...gridItems,
            {
                id: `grid-item-${Date.now()}`,
                size: 12 / (gridItems.length + 1),
                children: [],
            } as GridItemConfig,
        ];

        // Redistribute sizes evenly
        const equalSize = 12 / newGridItems.length;
        newGridItems.forEach((item) => {
            item.size = equalSize;
        });

        onUpdateElement(element.id, { gridItems: newGridItems });
    };

    const handleRemoveColumn = (indexToRemove: number) => {
        if (gridItems.length <= 1) return; // Keep at least one column

        const newGridItems = gridItems.filter((_, index) => index !== indexToRemove);

        // Redistribute sizes evenly
        const equalSize = 12 / newGridItems.length;
        newGridItems.forEach((item) => {
            item.size = equalSize;
        });

        onUpdateElement(element.id, { gridItems: newGridItems });
    };

    const handleDeleteChild = (gridItemIndex: number, childId: string) => {
        const newGridItems = [...gridItems];
        newGridItems[gridItemIndex] = {
            ...newGridItems[gridItemIndex],
            children: newGridItems[gridItemIndex].children.filter((child) => child.id !== childId),
        };
        onUpdateElement(element.id, { gridItems: newGridItems });
    };

    const handleUpdateChild = (
        gridItemIndex: number,
        childId: string,
        updates: Partial<DroppedElement>
    ) => {
        const newGridItems = [...gridItems];
        newGridItems[gridItemIndex] = {
            ...newGridItems[gridItemIndex],
            children: newGridItems[gridItemIndex].children.map((child) =>
                child.id === childId ? { ...child, ...updates } : child
            ),
        };
        onUpdateElement(element.id, { gridItems: newGridItems });
    };

    return (
        <GridContainer onClick={onClick} isSelected={isSelected}>
            <Grid container spacing={spacing}>
                {gridItems.map((gridItem, index) => {
                    const itemSize = typeof gridItem.size === 'number' ? gridItem.size : gridItem.size.xs || 12;

                    return (
                        <Grid key={gridItem.id} size={itemSize}>
                            <GridItemWrapper
                                onDrop={(e) => handleDrop(e, index)}
                                onDragOver={handleDragOver}
                                isSelected={isSelected}
                            >
                                {/* Column Header with Remove Button */}
                                {isSelected && (
                                    <GridItemHeader>
                                        <ColumnSizeBadge
                                            label={`${itemSize}/12`}
                                            size="small"
                                            icon={<GripVertical size={12} />}
                                        />
                                        {gridItems.length > 1 && (
                                            <RemoveColumnButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveColumn(index);
                                                }}
                                            >
                                                <Trash2 size={14} />
                                            </RemoveColumnButton>
                                        )}
                                    </GridItemHeader>
                                )}

                                {/* Drop Zone or Children */}
                                {gridItem.children.length === 0 ? (
                                    <DropZone>
                                        <Typography variant="caption" color="text.secondary">
                                            Drop elements here
                                        </Typography>
                                    </DropZone>
                                ) : (
                                    <ChildrenContainer>
                                        {gridItem.children.map((child) => (
                                            <Box key={child.id} sx={{ mb: 2 }}>
                                                <ElementRenderer
                                                    element={child}
                                                    isSelected={false}
                                                    onClick={() => onSelectElement(child.id)}
                                                    onDeleteElement={() => handleDeleteChild(index, child.id)}
                                                    onUpdateElement={(childId, updates) =>
                                                        handleUpdateChild(index, childId, updates)
                                                    }
                                                    onDropIntoContainer={onDropIntoContainer}
                                                    onSelectElement={onSelectElement}
                                                />
                                            </Box>
                                        ))}
                                    </ChildrenContainer>
                                )}
                            </GridItemWrapper>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Add Column Button */}
            {isSelected && (
                <AddColumnButton
                    variant="outlined"
                    startIcon={<Plus size={16} />}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAddColumn();
                    }}
                    fullWidth
                >
                    Add Column
                </AddColumnButton>
            )}
        </GridContainer>
    );
}

// Styled Components
const GridContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1.5),
    border: `2px dashed ${isSelected ? theme.palette.primary.main : theme.palette.divider}`,
    backgroundColor: isSelected
        ? alpha(theme.palette.primary.main, 0.04)
        : theme.palette.background.paper,
    transition: 'all 0.2s',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.02),
    },
}));

const GridItemWrapper = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isSelected',
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
    position: 'relative',
    minHeight: 100,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
    transition: 'all 0.2s',
}));

const GridItemHeader = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: -12,
    left: 8,
    right: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    zIndex: 5,
}));

const ColumnSizeBadge = styled(Chip)(({ theme }) => ({
    height: 24,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: '0.6875rem',
    fontWeight: 600,
    boxShadow: theme.shadows[2],
    '& .MuiChip-icon': {
        color: theme.palette.primary.contrastText,
    },
}));

const RemoveColumnButton = styled(IconButton)(({ theme }) => ({
    width: 24,
    height: 24,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    '&:hover': {
        backgroundColor: theme.palette.error.lighter,
        color: theme.palette.error.main,
    },
}));

const DropZone = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    border: `2px dashed ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    backgroundColor: alpha(theme.palette.grey[500], 0.04),
    transition: 'all 0.2s',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
    },
}));

const ChildrenContainer = styled(Box)({
    width: '100%',
});

const AddColumnButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    borderStyle: 'dashed',
    borderWidth: 2,
    color: theme.palette.text.secondary,
    '&:hover': {
        borderStyle: 'dashed',
        borderWidth: 2,
        backgroundColor: alpha(theme.palette.primary.main, 0.04),
        color: theme.palette.primary.main,
    },
}));
