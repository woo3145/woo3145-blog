import { ComponentMeta, ComponentStory } from '@storybook/react';
import DarkModeToggle from './DarkModeToggle';

export default {
  title: 'DarkModeToggle',
  component: DarkModeToggle,
  argTypes: {},
} as ComponentMeta<typeof DarkModeToggle>;

const Template: ComponentStory<typeof DarkModeToggle> = (args) => (
  <DarkModeToggle {...args} />
);

export const Default = Template.bind({});
Default.args = {
  darkMode: false,
  onClick: () => {},
};

export const DarkModeToggleOn = Template.bind({});
DarkModeToggleOn.args = {
  darkMode: true,
  onClick: () => {},
};
