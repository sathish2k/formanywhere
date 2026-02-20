import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { NavigationRail, NavigationRailItem } from './index';

const dot = <span>●</span>;

const meta: Meta<typeof NavigationRail> = {
  title: 'Components/NavigationRail',
  component: NavigationRail,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const [current, setCurrent] = createSignal('home');
    return (
      <NavigationRail header={<button>+</button>}>
        <NavigationRailItem value="home" label="Home" icon={dot} selected={current() === 'home'} onClick={() => setCurrent('home')} />
        <NavigationRailItem value="search" label="Search" icon={dot} selected={current() === 'search'} onClick={() => setCurrent('search')} />
        <NavigationRailItem value="profile" label="Profile" icon={dot} selected={current() === 'profile'} onClick={() => setCurrent('profile')} />
      </NavigationRail>
    );
  },
};
