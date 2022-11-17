import type { GetStaticProps } from 'next';
import { useEffect } from 'react';
import PostCard from '../components/atoms/PostCard/PostCard';
import { useTagContext } from '../components/context/TagContext';
import { getAllPosts, getAllTags } from '../utils/mdUtils';

interface Props {
  posts: IPost[];
  allTags: string[];
}

const HomePage = ({ posts, allTags }: Props) => {
  const { setTags } = useTagContext();
  useEffect(() => {
    setTags(allTags);
  }, [allTags, setTags]);

  return (
    <div className="w-full px-4 md:px-0">
      <div className="">
        <p className="text-3xl mb-4 px-2">최근 포스트</p>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {posts.map((post, idx) => {
            return <PostCard key={idx} {...post} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts();
  const allTags = getAllTags();
  return {
    props: {
      posts,
      allTags,
    },
  };
};
