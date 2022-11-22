import { GetStaticProps } from 'next';
import { getAllPosts, getAllTags } from '../../utils/mdUtils';
import { useTagContext } from '../../components/context/TagContext';
import { useEffect, useState } from 'react';
import PostCard from '../../components/atoms/PostCard/PostCard';
import { useRouter } from 'next/router';

interface Props {
  posts: IPost[];
  allTags: string[];
}

const PostsPage = ({ posts, allTags }: Props) => {
  const { setTags } = useTagContext();
  useEffect(() => {
    setTags(allTags);
  }, [allTags, setTags]);

  const router = useRouter();
  const [filter, setFilter] = useState<string>('');
  const [filteredPosts, setFilteredPosts] = useState<IPost[]>(posts);
  const onClickTag = (tag: string) => {
    if (filter === tag) {
      return router.push({
        query: { filter: '' },
      });
    }
    router.push({
      query: {
        filter: tag,
      },
    });
  };

  useEffect(() => {
    if (!router.query.filter) {
      setFilter('');
      return;
    }
    setFilter(router.query.filter as string);
  }, [router.query]);

  useEffect(() => {
    if (filter === '') {
      setFilteredPosts(posts);
      return;
    }
    setFilteredPosts(
      posts.filter((post) => post.frontmatter.tags.includes(filter))
    );
  }, [filter, posts]);

  return (
    <div className="w-full px-4 md:px-0">
      <div className="flex flex-col justify-center items-center py-4 mb-6">
        <h1 className="text-4xl mb-2 first-letter:uppercase">
          # {filter === '' ? ' all' : `${filter}`}
        </h1>
        <p className="text-xl">posts {filteredPosts.length}</p>
      </div>
      <div className="flex flex-wrap gap-4 mb-8 max-w-3xl">
        {allTags.map((tag, idx) => {
          return (
            <button
              key={idx}
              onClick={() => onClickTag(tag)}
              className={`block px-4 py-2 bg-secondary text-primary rounded-full first-letter:uppercase cursor-pointer transition-colors
              focus:ring-2 hover:ring-2 ring-purple ring-offset-4 ${
                tag === filter && 'text-inverse bg-inverse'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
      <div className="">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredPosts.map((post, idx) => {
            return <PostCard key={idx} {...post} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default PostsPage;

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
