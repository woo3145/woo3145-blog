import fs from 'fs';
import matter from 'gray-matter';
import type { GetStaticProps, NextPage } from 'next';
import PostCard from '../components/atoms/PostCard/PostCard';

interface Props {
  posts: Post[];
}

const HomePage = ({ posts }: Props) => {
  return (
    <div className="w-full px-4 md:px-0">
      <div className="min-h-screen">
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
  const files = fs.readdirSync('posts');
  const posts: Post[] = files.map((fileName: string) => {
    const slug = fileName.replace('.md', '');
    const readFile = fs.readFileSync(`posts/${fileName}`, 'utf-8');
    const { data: frontmatter } = matter(readFile);
    return {
      slug,
      frontmatter,
    } as Post;
  });

  return {
    props: {
      posts,
    },
  };
};
