import type { NextPage } from 'next';
import PostCard from '../components/atoms/PostCard/PostCard';

const Home: NextPage = () => {
  const testPost = {
    slug: 'test.md',
    frontmatter: {
      title: 'title',
      date: '2022-11-10',
      tags: ['Typescript', 'React'],
    },
    excerpt: 'excerpt',
  };
  return (
    <div className="">
      <div className="h-screen">
        <p className="text-3xl mb-4">최근 포스트</p>
        <div className="flex flex-wrap gap-4 justify-start mx-auto">
          <PostCard {...testPost} />
          <PostCard {...testPost} />
          <PostCard {...testPost} />
          <PostCard {...testPost} />
        </div>
      </div>
    </div>
  );
};

export default Home;
