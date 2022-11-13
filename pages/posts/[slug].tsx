import fs from 'fs';
import { serialize } from 'next-mdx-remote/serialize';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { getPostFileBySlug } from '../../utils/mdUtils';

interface Props {
  source: MDXRemoteSerializeResult;
}

const PostPage = ({ source }: Props) => {
  return (
    <div>
      <MDXRemote {...source} />
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
  const file = getPostFileBySlug(slug);
  const source: MDXRemoteSerializeResult = await serialize(file, {
    parseFrontmatter: true,
  });
  return {
    props: {
      source,
    },
  };
};
