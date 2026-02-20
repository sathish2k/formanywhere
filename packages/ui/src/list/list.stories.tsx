import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { List, ListItem, ListDivider } from './index';

const meta: Meta<typeof List> = {
  title: 'Components/List',
  component: List,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <List style={{ width: '360px' }}>
      <ListItem headline="Profile" supportingText="Manage account details" interactive />
      <ListItem headline="Notifications" supportingText="Email and push settings" interactive />
      <ListDivider />
      <ListItem headline="Help" trailingSupportingText="F1" interactive />
    </List>
  ),
};
