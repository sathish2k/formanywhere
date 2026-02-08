/**
 * Navigation and Search Demo for Showcase
 */
import { createSignal } from 'solid-js';
import {
    NavigationBar, NavigationBarItem,
    NavigationRail, NavigationRailItem,
    TopAppBar,
    SearchBar,
    SegmentedButton,
    TimePicker,
    Typography,
    Divider
} from '@formanywhere/ui';

export const NavigationDemo = () => {
    const [navIndex, setNavIndex] = createSignal<number>(0);
    const [railIndex, setRailIndex] = createSignal<number>(0);
    const [segmentValue, setSegmentValue] = createSignal<string>('Day');
    const [time, setTime] = createSignal('12:00');

    // Icons
    const HomeIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>;
    const SearchIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>;
    const SettingsIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></svg>;

    return (
        <div class="flex flex-col gap-8">
            {/* Top App Bar Demo */}
            <div class="border border-outline-variant rounded-lg overflow-hidden">
                <TopAppBar
                    title="Top App Bar"
                    variant="small"
                    navigationIcon={<div class="p-2 cursor-pointer">{HomeIcon}</div>}
                    actions={<div class="p-2 cursor-pointer">{SettingsIcon}</div>}
                />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs & Controls */}
                <div class="flex flex-col gap-6">
                    <Typography variant="headline-small" color="on-surface">Controls</Typography>

                    <SearchBar
                        placeholder="Search..."
                        onSearch={(val) => alert('Search: ' + val)}
                    />

                    <SegmentedButton
                        options={[
                            { label: 'Day', value: 'Day' },
                            { label: 'Week', value: 'Week' },
                            { label: 'Month', value: 'Month' }
                        ]}
                        value={segmentValue()}
                        onChange={(v) => setSegmentValue(v as string)}
                    />

                    <TimePicker
                        label="Select Time"
                        value={time()}
                        onChange={setTime}
                        supportingText="Native Time Input"
                    />
                </div>

                {/* Navigation Rail */}
                <div class="h-[300px] border border-outline-variant rounded-lg overflow-hidden flex">
                    <NavigationRail>
                        <NavigationRailItem
                            value={0}
                            icon={HomeIcon}
                            label="Home"
                            selected={railIndex() === 0}
                            onClick={() => setRailIndex(0)}
                        />
                        <NavigationRailItem
                            value={1}
                            icon={SearchIcon}
                            label="Search"
                            selected={railIndex() === 1}
                            onClick={() => setRailIndex(1)}
                        />
                        <NavigationRailItem
                            value={2}
                            icon={SettingsIcon}
                            label="Settings"
                            selected={railIndex() === 2}
                            onClick={() => setRailIndex(2)}
                        />
                    </NavigationRail>
                    <div class="p-4 flex-1 bg-surface-container-low">
                        <Typography variant="body-large">Content Area</Typography>
                    </div>
                </div>
            </div>

            {/* Navigation Bar */}
            <div class="border border-outline-variant rounded-lg overflow-hidden">
                <NavigationBar>
                    <NavigationBarItem
                        value={0}
                        icon={HomeIcon}
                        label="Home"
                        selected={navIndex() === 0}
                        onClick={() => setNavIndex(0)}
                    />
                    <NavigationBarItem
                        value={1}
                        icon={SearchIcon}
                        label="Explore"
                        selected={navIndex() === 1}
                        onClick={() => setNavIndex(1)}
                    />
                    <NavigationBarItem
                        value={2}
                        icon={SettingsIcon}
                        label="Settings"
                        selected={navIndex() === 2}
                        onClick={() => setNavIndex(2)}
                    />
                </NavigationBar>
            </div>
        </div>
    );
};

export default NavigationDemo;
