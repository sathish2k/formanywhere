import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { ThemeProvider, useTheme } from './index';

const ThemeControls = () => {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  return (
    <div style={{ display: 'grid', gap: '10px', width: '280px' }}>
      <div>Theme: {theme()}</div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => setTheme('light')}>Light</button>
        <button onClick={() => setTheme('dark')}>Dark</button>
        <button onClick={() => setTheme('system')}>System</button>
      </div>
      <div>Color: {colorScheme()}</div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => setColorScheme('green')}>Green</button>
        <button onClick={() => setColorScheme('blue')}>Blue</button>
        <button onClick={() => setColorScheme('purple')}>Purple</button>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Components/Theme',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <ThemeProvider>
      <ThemeControls />
    </ThemeProvider>
  ),
};
