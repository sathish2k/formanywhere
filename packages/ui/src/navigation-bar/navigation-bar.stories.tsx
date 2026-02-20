import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { NavigationBar, NavigationBarItem } from './index';

const dot = <span>●</span>;

const meta: Meta<typeof NavigationBar> = {
  title: 'Components/NavigationBar',
  component: NavigationBar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const [current, setCurrent] = createSignal('home');
    return (
      <NavigationBar>
        <NavigationBarItem value="home" label="Home" icon={dot} selected={current() === 'home'} onClick={() => setCurrent('home')} />
        <NavigationBarItem value="search" label="Search" icon={dot} selected={current() === 'search'} onClick={() => setCurrent('search')} />
        <NavigationBarItem value="profile" label="Profile" icon={dot} selected={current() === 'profile'} onClick={() => setCurrent('profile')} />
      </NavigationBar>
    );
  },
};
