import fs from 'fs';
import { serialize } from 'next-mdx-remote/serialize';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { MDXRemote } from 'next-mdx-remote';

interface Props {
  post: any;
}

const PostPage = ({ post }: Props) => {
  console.log(post);
  return (
    <div>
      <MDXRemote {...post} />
    </div>
  );
};

export default PostPage;

interface IParams extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const files = fs.readdirSync('posts');
  const paths = files.map((fileName) => {
    return {
      params: {
        slug: fileName.replace('.md', ''),
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const { slug } = context.params as IParams;
  const file = fs.readFileSync(`posts/${slug}.md`, 'utf-8');
  const result = await serialize(file, { parseFrontmatter: true });
  return {
    props: {
      post: result,
    },
  };
};
