import fs from 'fs';
import { serialize } from 'next-mdx-remote/serialize';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { getPostFileBySlug } from '../../utils/mdUtils';
import rehypePlugins from 'rehype-img-size';
import Utterances from '../../components/modules/Utterances';
import Head from 'next/head';

interface Props {
  source: MDXRemoteSerializeResult;
  frontmatter: IPostFrontmatter;
}

const PostPage = ({ source, frontmatter }: Props) => {
  const { title, date, tags, thumbnail, author, excerpt } = frontmatter;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <article className="mx-auto max-w-4xl">
        <header className="w-full border-b mb-8">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mb-4 mt-2 text-sm text-neutral-500">{date}</p>
        </header>
        <div className="markdown-body pb-20">
          <MDXRemote {...source} />
        </div>
        <Utterances />
      </article>
    </>
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
    mdxOptions: {
      rehypePlugins: [[rehypePlugins, { dir: 'public' }]],
    },
  });
  return {
    props: {
      source,
      frontmatter: source.frontmatter,
    },
  };
};
