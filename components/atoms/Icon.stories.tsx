import { ComponentMeta, ComponentStory } from '@storybook/react';
import Icon from './Icon';

export default {
  title: 'Icon',
  component: Icon,
  decorators: [
    (story) => (
      <div className="flex items-center justify-center py-20 gap-14">
        {story()}
      </div>
    ),
  ],
} as ComponentMeta<typeof Icon>;

const Template: ComponentStory<typeof Icon> = (args) => (
  <>
    <Icon icon={'sun'} size={60} />
    <Icon icon={'moon'} size={60} />
  </>
);

export const All = Template.bind({});

All.args = {
  icon: 'sun',
  size: 20,
};
