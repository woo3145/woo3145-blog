import fs from 'fs';
import matter from 'gray-matter';

export const getPostFileBySlug = (slug: string) => {
  return fs.readFileSync(`posts/${slug}.md`, 'utf-8');
};

const getPostsFilePaths = (): string[] => {
  const files = fs
    .readdirSync('posts')
    .filter((path: string) => /\.mdx?/.test(path));

  return files.filter((path: string) => path !== '0-guide.md');
};

export const getPostBySlug = (slug: string): IPost => {
  const file = getPostFileBySlug(slug);
  const { data: frontmatter, content } = matter(file);

  const post: IPost = {
    frontmatter: frontmatter as IPostFrontmatter,
    content,
    slug,
  };

  return post;
};

export const getAllPosts = (): IPost[] => {
  const postFilePaths = getPostsFilePaths();

  const posts = postFilePaths.map((filePath: string) => {
    const slug = filePath.replace('.md', '');
    const result = getPostBySlug(slug);

    return result;
  });

  return posts;
};

export const getAllTags = (): string[] => {
  const posts = getAllPosts();

  let tags: string[] = [];
  posts.forEach((post) => {
    tags = [...tags, ...post.frontmatter.tags];
  });
  return Array.from(new Set(tags));
};
