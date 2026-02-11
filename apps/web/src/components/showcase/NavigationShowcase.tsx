/**
 * NavigationBar Showcase - SolidJS wrapper for the showcase page
 * Extracted from .astro file to avoid JSX parsing issues with icon prop
 * SVG icons must be defined inside the component function for SolidJS compilation
 */
import { NavigationBar, NavigationBarItem } from '@formanywhere/ui/navigation-bar';
import { Typography } from '@formanywhere/ui/typography';

export const NavigationShowcase = () => {
    const HomeIcon = (
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    );

    const FormsIcon = (
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );

    const AnalyticsIcon = (
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    );

    const SettingsIcon = (
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );

    return (
        <div class="space-y-8">
            {/* Standard */}
            <div>
                <Typography variant="title-medium" color="on-surface-variant" class="mb-4">
                    Standard
                </Typography>
                <div class="rounded-2xl overflow-hidden border border-outline-variant">
                    <NavigationBar value="home">
                        <NavigationBarItem value="home" label="Home" selected alwaysShowLabel icon={HomeIcon} />
                        <NavigationBarItem value="forms" label="Forms" alwaysShowLabel icon={FormsIcon} />
                        <NavigationBarItem value="analytics" label="Analytics" alwaysShowLabel icon={AnalyticsIcon} />
                        <NavigationBarItem value="settings" label="Settings" alwaysShowLabel icon={SettingsIcon} />
                    </NavigationBar>
                </div>
            </div>

            {/* Glass Variant */}
            <div>
                <Typography variant="title-medium" color="on-surface-variant" class="mb-4">
                    Glass Variant
                </Typography>
                <div class="rounded-2xl overflow-hidden border border-outline-variant">
                    <NavigationBar value="home" glass>
                        <NavigationBarItem value="home" label="Home" selected alwaysShowLabel icon={HomeIcon} />
                        <NavigationBarItem value="forms" label="Forms" alwaysShowLabel icon={FormsIcon} />
                        <NavigationBarItem value="analytics" label="Analytics" alwaysShowLabel icon={AnalyticsIcon} />
                    </NavigationBar>
                </div>
            </div>
        </div>
    );
};

export default NavigationShowcase;
