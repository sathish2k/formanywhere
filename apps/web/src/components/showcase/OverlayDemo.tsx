/**
 * Overlay Demo for Showcase
 * Demonstrates Drawer and Bottom Sheet interactions
 */
import { createSignal } from 'solid-js';
import { Button, Drawer, BottomSheet, Typography, List, ListItem } from '@formanywhere/ui';

export const OverlayDemo = () => {
    const [drawerOpen, setDrawerOpen] = createSignal(false);
    const [sheetOpen, setSheetOpen] = createSignal(false);

    return (
        <div class="flex gap-4">
            <Button variant="filled" onClick={() => setDrawerOpen(true)}>
                Open Drawer
            </Button>

            <Button variant="outlined" onClick={() => setSheetOpen(true)}>
                Open Bottom Sheet
            </Button>

            <Drawer open={drawerOpen()} onClose={() => setDrawerOpen(false)} width="300px">
                <div style={{ padding: '24px' }}>
                    <Typography variant="headline-small" color="on-surface" style={{ 'margin-bottom': '24px' }}>
                        Navigation
                    </Typography>
                    <List>
                        <ListItem headline="Dashboard" />
                        <ListItem headline="Settings" />
                        <ListItem headline="Profile" />
                    </List>
                </div>
            </Drawer>

            <BottomSheet open={sheetOpen()} onClose={() => setSheetOpen(false)}>
                <div style={{ 'padding-bottom': '24px' }}>
                    <Typography variant="headline-small" color="on-surface" align="center" style={{ 'margin-bottom': '16px' }}>
                        Options
                    </Typography>
                    <List>
                        <ListItem headline="Share" />
                        <ListItem headline="Get Link" />
                        <ListItem headline="Edit" />
                        <ListItem headline="Delete" />
                    </List>
                </div>
            </BottomSheet>
        </div>
    );
};

export default OverlayDemo;
