/**
 * Tabs Showcase - SolidJS wrapper for the showcase page
 * Extracted from .astro file to avoid JSX parsing issues
 */
import { Typography } from '@formanywhere/ui/typography';
import { Tabs, TabList, Tab, TabPanel } from '@formanywhere/ui/tabs';

export const TabsShowcase = () => {
    return (
        <div class="space-y-8">
            {/* Standard */}
            <div>
                <Typography variant="title-medium" color="on-surface-variant" class="mb-4">
                    Standard
                </Typography>
                <Tabs defaultActiveTab="tab1">
                    <TabList>
                        <Tab id="tab1" label="Overview" />
                        <Tab id="tab2" label="Features" />
                        <Tab id="tab3" label="Pricing" />
                        <Tab id="tab4" label="Disabled" disabled />
                    </TabList>
                    <TabPanel tabId="tab1">
                        <Typography variant="body-medium" color="on-surface">
                            Overview panel content — FormAnywhere is an offline-first form builder.
                        </Typography>
                    </TabPanel>
                    <TabPanel tabId="tab2">
                        <Typography variant="body-medium" color="on-surface">
                            Features panel — AI-powered, blazing fast, works offline.
                        </Typography>
                    </TabPanel>
                    <TabPanel tabId="tab3">
                        <Typography variant="body-medium" color="on-surface">
                            Pricing panel — Free tier, Pro, and Lifetime plans available.
                        </Typography>
                    </TabPanel>
                </Tabs>
            </div>

            {/* Glass Variant */}
            <div>
                <Typography variant="title-medium" color="on-surface-variant" class="mb-4">
                    Glass Variant
                </Typography>
                <Tabs defaultActiveTab="gt1">
                    <TabList class="glass">
                        <Tab id="gt1" label="Design" />
                        <Tab id="gt2" label="Code" />
                        <Tab id="gt3" label="Preview" />
                    </TabList>
                    <TabPanel tabId="gt1">
                        <Typography variant="body-medium" color="on-surface">
                            Design view with glass tab bar.
                        </Typography>
                    </TabPanel>
                    <TabPanel tabId="gt2">
                        <Typography variant="body-medium" color="on-surface">
                            Code editor view.
                        </Typography>
                    </TabPanel>
                    <TabPanel tabId="gt3">
                        <Typography variant="body-medium" color="on-surface">
                            Live preview.
                        </Typography>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    );
};

export default TabsShowcase;
