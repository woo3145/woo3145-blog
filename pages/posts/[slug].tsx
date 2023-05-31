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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={excerpt} />
        <meta name="author" content={author} />
        <meta key="og:type" property="og:type" content="article" />
        <meta key="og:title" property="og:title" content={title} />
        <meta
          key="og:description"
          property="og:description"
          content={excerpt}
        />
        <meta key="og:image" property="og:image" content={thumbnail} />
        <meta key="og:image:width" property="og:image:width" content={'300'} />
        <meta
          key="og:image:height"
          property="og:image:height"
          content={'150'}
        />
        <meta key="twitter:card" name="twitter:card" content="summary" />
        <meta key="twitter:title" name="twitter:title" content={title} />
        <meta
          key="twitter:description"
          name="twitter:description"
          content={excerpt}
        />
        <meta key="twitter:image" name="twitter:image" content={thumbnail} />
      </Head>
      <article className="max-w-4xl mx-auto">
        <header className="w-full pb-4 mb-12 border-b">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-secondary">{date}</p>
          <div className="flex gap-2 mt-4">
            {tags.map((tag, idx) => {
              return <TagBadge key={idx} text={tag} size={'sm'} />;
            })}
          </div>
        </header>
        <div className="pb-20 markdown-body">
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
