import { ComponentMeta, ComponentStory } from '@storybook/react';
import PostCard from './PostCard';

export default {
  title: 'PostCard',
  component: PostCard,
  decorators: [
    (story) => (
      <div className="flex items-center justify-center py-20">{story()}</div>
    ),
  ],
} as ComponentMeta<typeof PostCard>;

const Template: ComponentStory<typeof PostCard> = (args) => (
  <PostCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  slug: 'test.md',
  frontmatter: {
    title: 'title',
    date: '2022-11-10',
    tags: ['Typescript', 'React'],
    author: 'woo3145',
    excerpt: 'excerpt',
  },
};
