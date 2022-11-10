import type { NextPage } from 'next';
import PostCard from '../components/atoms/PostCard/PostCard';

const Home: NextPage = () => {
  const testPost = {
    slug: 'test.md',
    frontmatter: {
      title: 'title',
      date: '2022-11-10',
      tags: ['Typescript', 'React'],
      thumbnail: '/assets/jae-park-7GX5aICb5i4-unsplash.jpg',
    },
    excerpt: 'excerpt',
  };
  return (
    <div className="w-full px-4 md:px-0">
      <div className="min-h-screen">
        <p className="text-3xl mb-4 px-4">최근 포스트</p>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
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
