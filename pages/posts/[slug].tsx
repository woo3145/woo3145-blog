import fs from 'fs';
import { serialize } from 'next-mdx-remote/serialize';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import {
  getAllTags,
  getPostFileBySlug,
  getPostsFilePaths,
} from '../../utils/mdUtils';
import rehypePlugins from 'rehype-img-size';
import Utterances from '../../components/modules/Utterances';
import Head from 'next/head';
import { useTagContext } from '../../components/context/TagContext';
import { useEffect } from 'react';
import rehypeHighlight from 'rehype-highlight';
import TagBadge from '../../components/atoms/Badge/TagBadge';

interface Props {
  source: MDXRemoteSerializeResult;
  frontmatter: IPostFrontmatter;
  allTags: string[];
}

const PostPage = ({ source, frontmatter, allTags }: Props) => {
  const { title, date, tags, thumbnail, author, excerpt } = frontmatter;
  const { setTags } = useTagContext();
  useEffect(() => {
    setTags(allTags);
  }, [allTags, setTags]);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <article className="mx-auto max-w-4xl">
        <header className="w-full border-b mb-12 pb-4">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-secondary">{date}</p>
          <div className="flex gap-2 mt-4">
            {tags.map((tag, idx) => {
              return <TagBadge key={idx} text={tag} size={'sm'} />;
            })}
          </div>
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
  const filePaths = getPostsFilePaths();
  const paths = filePaths.map((path) => {
    return {
      params: {
        slug: path.replace('.md', ''),
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
      rehypePlugins: [[rehypePlugins, { dir: 'public' }], rehypeHighlight],
    },
  });
  const allTags = getAllTags();
  return {
    props: {
      source,
      frontmatter: source.frontmatter,
      allTags,
    },
  };
};
