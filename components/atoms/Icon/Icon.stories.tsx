import { ComponentMeta, ComponentStory } from '@storybook/react';
import Icon, { IconName, IconSet } from './Icon';

export default {
  title: 'Icon',
  component: Icon,
  decorators: [
    (story) => (
      <div className="flex items-center justify-center flex-wrap py-20 gap-8">
        {story()}
      </div>
    ),
  ],
} as ComponentMeta<typeof Icon>;

const icons = Object.keys(IconSet) as IconName[];

const Template: ComponentStory<typeof Icon> = (args) => (
  <>
    {icons.map((icon, idx) => {
      return (
        <div
          key={idx}
          className="flex flex-col items-center gap-2 border-4 rounded-md p-6"
        >
          <Icon icon={icon} size={60} />
          <span>{icon}</span>
        </div>
      );
    })}
  </>
);

export const All = Template.bind({});

All.args = {
  icon: 'sun',
  size: 20,
};
