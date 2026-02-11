/**
 * Layout Picker Dialog
 * Modal to choose grid layout (1, 2, or 3 columns)
 */

'use client';

import { Box, Dialog, DialogContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { RectangleVertical, Columns2, Columns3 } from 'lucide-react';

interface LayoutPickerDialogProps {
    open: boolean;
    onClose: () => void;
    onSelectLayout: (columnCount: 1 | 2 | 3) => void;
}

export function LayoutPickerDialog({ open, onClose, onSelectLayout }: LayoutPickerDialogProps) {
    const layouts = [
        {
            columns: 1 as const,
            label: '1 Column',
            description: 'Full width',
            icon: RectangleVertical,
            preview: [12],
        },
        {
            columns: 2 as const,
            label: '2 Columns',
            description: 'Equal split',
            icon: Columns2,
            preview: [6, 6],
        },
        {
            columns: 3 as const,
            label: '3 Columns',
            description: 'Equal split',
            icon: Columns3,
            preview: [4, 4, 4],
        },
    ];

    const handleSelect = (columnCount: 1 | 2 | 3) => {
        onSelectLayout(columnCount);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogContent sx={{ p: 4 }}>
                <Title variant="h5">Choose your layout</Title>

                <LayoutGrid>
                    {layouts.map((layout) => {
                        const Icon = layout.icon;
                        return (
                            <LayoutCard key={layout.columns} onClick={() => handleSelect(layout.columns)}>
                                <IconWrapper>
                                    <Icon size={32} strokeWidth={1.5} />
                                </IconWrapper>

                                <LayoutLabel variant="h6">{layout.label}</LayoutLabel>
                                <LayoutDescription variant="caption" color="text.secondary">
                                    {layout.description}
                                </LayoutDescription>

                                <PreviewContainer>
                                    {layout.preview.map((size, idx) => (
                                        <PreviewColumn key={idx} size={size} />
                                    ))}
                                </PreviewContainer>
                            </LayoutCard>
                        );
                    })}
                </LayoutGrid>
            </DialogContent>
        </Dialog>
    );
}

// Styled Components
const Title = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    marginBottom: theme.spacing(4),
    textAlign: 'center',
}));

const LayoutGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: theme.spacing(3),
}));

const LayoutCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
    border: `2px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(2),
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.action.hover,
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[4],
    },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    width: 64,
    height: 64,
    borderRadius: '50%',
    backgroundColor: theme.palette.error.lighter || '#FFEBEE',
    color: theme.palette.error.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
}));

const LayoutLabel = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    marginBottom: theme.spacing(0.5),
}));

const LayoutDescription = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

const PreviewContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    width: '100%',
    height: 48,
}));

const PreviewColumn = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'size',
})<{ size: number }>(({ theme, size }) => ({
    flex: size,
    backgroundColor: theme.palette.error.lighter || '#FFEBEE',
    borderRadius: theme.spacing(1),
}));
