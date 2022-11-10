interface Post {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    tags: string[];
    thumbnail?: string;
    author: string;
    excerpt: string;
  };
  content?: string;
}
