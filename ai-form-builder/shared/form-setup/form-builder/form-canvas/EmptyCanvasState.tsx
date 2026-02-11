/**
 * Empty Canvas State
 * Shown when canvas has no elements, prompting user to create a grid layout
 */

'use client';

import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LayoutGrid, Sparkles } from 'lucide-react';

interface EmptyCanvasStateProps {
    onCreateGridLayout: () => void;
}

export function EmptyCanvasState({ onCreateGridLayout }: EmptyCanvasStateProps) {
    return (
        <Container>
            <Content>
                <IconWrapper>
                    <Sparkles size={40} strokeWidth={1.5} />
                </IconWrapper>

                <Heading variant="h5">Start Building Your Form</Heading>

                <Description variant="body2" color="text.secondary">
                    Create a responsive grid layout first, then drag and drop form
                    elements into columns.
                </Description>

                <CreateButton
                    variant="contained"
                    size="large"
                    startIcon={<LayoutGrid size={20} />}
                    onClick={onCreateGridLayout}
                >
                    Create Grid Layout
                </CreateButton>

                <Divider>
                    <DividerLine />
                    <DividerText variant="caption" color="text.disabled">
                        OR
                    </DividerText>
                    <DividerLine />
                </Divider>

                <DragMessage variant="body2" color="primary">
                    <Sparkles size={16} style={{ marginRight: 8 }} />
                    Drag elements from the left sidebar
                </DragMessage>
            </Content>
        </Container>
    );
}

// Styled Components
const Container = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
    padding: theme.spacing(4),
}));

const Content = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 500,
    textAlign: 'center',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: theme.palette.error.lighter || '#FFEBEE',
    color: theme.palette.error.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
}));

const Heading = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    marginBottom: theme.spacing(1.5),
}));

const Description = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    lineHeight: 1.6,
}));

const CreateButton = styled(Button)(({ theme }) => ({
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    borderRadius: theme.spacing(3),
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    boxShadow: theme.shadows[4],
    '&:hover': {
        boxShadow: theme.shadows[8],
    },
}));

const Divider = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    margin: theme.spacing(4, 0),
}));

const DividerLine = styled(Box)(({ theme }) => ({
    flex: 1,
    height: 1,
    backgroundColor: theme.palette.divider,
}));

const DividerText = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(0, 2),
    fontWeight: 600,
}));

const DragMessage = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2, 4),
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(3),
    fontWeight: 500,
    backgroundColor: theme.palette.primary.lighter || '#E3F2FD',
}));
