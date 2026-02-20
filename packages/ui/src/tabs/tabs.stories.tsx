import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal, For } from 'solid-js';
import { Tabs, TabList, Tab, TabPanel } from './index';

// ── Inline SVG icons for demos ────────────────────────────────────────────────

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
    <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Z"/>
  </svg>
);
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
    <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
  </svg>
);
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
    <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L88-352l104-78q-1-7-1-20t1-20L88-548l100-167 119 50q11-8 23-15t24-12l16-128h200l16 128q13 5 24.5 12t22.5 15l119-50 100 167-104 78q1 7 1 20t-1 20l104 78-100 167-119-50q-11 8-23 15t-24 12L570-80H370Z"/>
  </svg>
);
const PersonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
    <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/>
  </svg>
);

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Primary (default) ─────────────────────────────────────────────────────────

export const Primary: Story = {
  name: 'Primary',
  render: () => {
    const [active, setActive] = createSignal('overview');
    return (
      <Tabs activeTab={active()} onChange={setActive}>
        <TabList>
          <Tab id="overview" label="Overview" />
          <Tab id="details" label="Details" />
          <Tab id="activity" label="Activity" />
        </TabList>
        <TabPanel tabId="overview">Overview content</TabPanel>
        <TabPanel tabId="details">Details content</TabPanel>
        <TabPanel tabId="activity">Activity content</TabPanel>
      </Tabs>
    );
  },
};

// ─── Secondary ──────────────────────────────────────────────────────────────────

export const Secondary: Story = {
  name: 'Secondary',
  render: () => {
    const [active, setActive] = createSignal('one');
    return (
      <Tabs activeTab={active()} onChange={setActive} variant="secondary">
        <TabList>
          <Tab id="one" label="One" />
          <Tab id="two" label="Two" />
          <Tab id="three" label="Three" />
        </TabList>
        <TabPanel tabId="one">Secondary tab one</TabPanel>
        <TabPanel tabId="two">Secondary tab two</TabPanel>
        <TabPanel tabId="three">Secondary tab three</TabPanel>
      </Tabs>
    );
  },
};

// ─── With Icons (primary, stacked icon + label) ─────────────────────────────────

export const WithIcons: Story = {
  name: 'With Icons (Primary)',
  render: () => {
    const [active, setActive] = createSignal('home');
    return (
      <Tabs activeTab={active()} onChange={setActive}>
        <TabList>
          <Tab id="home" label="Home" icon={<HomeIcon />} />
          <Tab id="favorites" label="Favorites" icon={<StarIcon />} />
          <Tab id="settings" label="Settings" icon={<SettingsIcon />} />
          <Tab id="profile" label="Profile" icon={<PersonIcon />} />
        </TabList>
        <TabPanel tabId="home">Home content</TabPanel>
        <TabPanel tabId="favorites">Favorites content</TabPanel>
        <TabPanel tabId="settings">Settings content</TabPanel>
        <TabPanel tabId="profile">Profile content</TabPanel>
      </Tabs>
    );
  },
};

// ─── With Icons (secondary, inline icon + label) ────────────────────────────────

export const WithIconsSecondary: Story = {
  name: 'With Icons (Secondary)',
  render: () => {
    const [active, setActive] = createSignal('home');
    return (
      <Tabs activeTab={active()} onChange={setActive} variant="secondary">
        <TabList>
          <Tab id="home" label="Home" icon={<HomeIcon />} />
          <Tab id="favorites" label="Favorites" icon={<StarIcon />} />
          <Tab id="settings" label="Settings" icon={<SettingsIcon />} />
        </TabList>
        <TabPanel tabId="home">Home content</TabPanel>
        <TabPanel tabId="favorites">Favorites content</TabPanel>
        <TabPanel tabId="settings">Settings content</TabPanel>
      </Tabs>
    );
  },
};

// ─── Inline Icon (primary with row layout instead of column) ────────────────────

export const InlineIcon: Story = {
  name: 'Inline Icon (Primary)',
  render: () => {
    const [active, setActive] = createSignal('home');
    return (
      <Tabs activeTab={active()} onChange={setActive}>
        <TabList>
          <Tab id="home" label="Home" icon={<HomeIcon />} inlineIcon />
          <Tab id="favorites" label="Favorites" icon={<StarIcon />} inlineIcon />
          <Tab id="settings" label="Settings" icon={<SettingsIcon />} inlineIcon />
        </TabList>
        <TabPanel tabId="home">Inline icon content</TabPanel>
        <TabPanel tabId="favorites">Favorites content</TabPanel>
        <TabPanel tabId="settings">Settings content</TabPanel>
      </Tabs>
    );
  },
};

// ─── Icon Only ──────────────────────────────────────────────────────────────────

export const IconOnly: Story = {
  name: 'Icon Only',
  render: () => {
    const [active, setActive] = createSignal('home');
    return (
      <Tabs activeTab={active()} onChange={setActive}>
        <TabList>
          <Tab id="home" icon={<HomeIcon />} />
          <Tab id="favorites" icon={<StarIcon />} />
          <Tab id="settings" icon={<SettingsIcon />} />
          <Tab id="profile" icon={<PersonIcon />} />
        </TabList>
        <TabPanel tabId="home">Home content</TabPanel>
        <TabPanel tabId="favorites">Favorites content</TabPanel>
        <TabPanel tabId="settings">Settings content</TabPanel>
        <TabPanel tabId="profile">Profile content</TabPanel>
      </Tabs>
    );
  },
};

// ─── Scrollable ─────────────────────────────────────────────────────────────────

export const Scrollable: Story = {
  name: 'Scrollable',
  render: () => {
    const [active, setActive] = createSignal('tab-0');
    const tabs = Array.from({ length: 12 }, (_, i) => `Tab ${i + 1}`);
    return (
      <div style={{ "max-width": '400px' }}>
        <Tabs activeTab={active()} onChange={setActive}>
          <TabList scrollable>
            <For each={tabs}>{(label, i) =>
              <Tab id={`tab-${i()}`} label={label} />
            }</For>
          </TabList>
          <For each={tabs}>{(label, i) =>
            <TabPanel tabId={`tab-${i()}`}>{label} content</TabPanel>
          }</For>
        </Tabs>
      </div>
    );
  },
};

// ─── Disabled Tabs ──────────────────────────────────────────────────────────────

export const Disabled: Story = {
  name: 'Disabled Tabs',
  render: () => {
    const [active, setActive] = createSignal('enabled1');
    return (
      <Tabs activeTab={active()} onChange={setActive}>
        <TabList>
          <Tab id="enabled1" label="Enabled" />
          <Tab id="disabled1" label="Disabled" disabled />
          <Tab id="enabled2" label="Also Enabled" />
          <Tab id="disabled2" label="Also Disabled" disabled />
        </TabList>
        <TabPanel tabId="enabled1">First enabled tab</TabPanel>
        <TabPanel tabId="enabled2">Second enabled tab</TabPanel>
      </Tabs>
    );
  },
};

// ─── All Variants Overview ──────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => {
    const [a1, setA1] = createSignal('a');
    const [a2, setA2] = createSignal('a');
    const [a3, setA3] = createSignal('a');
    const [a4, setA4] = createSignal('a');

    const section = (title: string, children: any) => (
      <div style={{ "margin-bottom": '32px' }}>
        <div style={{ "font-size": '14px', "font-weight": '500', color: '#49454f', "margin-bottom": '8px' }}>{title}</div>
        {children}
      </div>
    );

    return (
      <div>
        {section('Primary (label only)', (
          <Tabs activeTab={a1()} onChange={setA1}>
            <TabList>
              <Tab id="a" label="Tab A" />
              <Tab id="b" label="Tab B" />
              <Tab id="c" label="Tab C" />
            </TabList>
          </Tabs>
        ))}

        {section('Secondary (label only)', (
          <Tabs activeTab={a2()} onChange={setA2} variant="secondary">
            <TabList>
              <Tab id="a" label="Tab A" />
              <Tab id="b" label="Tab B" />
              <Tab id="c" label="Tab C" />
            </TabList>
          </Tabs>
        ))}

        {section('Primary with icon + label (stacked)', (
          <Tabs activeTab={a3()} onChange={setA3}>
            <TabList>
              <Tab id="a" label="Home" icon={<HomeIcon />} />
              <Tab id="b" label="Star" icon={<StarIcon />} />
              <Tab id="c" label="Settings" icon={<SettingsIcon />} />
            </TabList>
          </Tabs>
        ))}

        {section('Icon only', (
          <Tabs activeTab={a4()} onChange={setA4}>
            <TabList>
              <Tab id="a" icon={<HomeIcon />} />
              <Tab id="b" icon={<StarIcon />} />
              <Tab id="c" icon={<SettingsIcon />} />
            </TabList>
          </Tabs>
        ))}
      </div>
    );
  },
};
