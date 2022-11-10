import { ComponentMeta, ComponentStory } from '@storybook/react';
import DarkModeToggle from './DarkModeToggle';

export default {
  title: 'DarkModeToggle',
  component: DarkModeToggle,
  decorators: [
    (story) => (
      <div className="flex items-center justify-center py-20">{story()}</div>
    ),
  ],
} as ComponentMeta<typeof DarkModeToggle>;

const Template: ComponentStory<typeof DarkModeToggle> = (args) => (
  <DarkModeToggle />
);

export const Default = Template.bind({});
Default.args = {};
