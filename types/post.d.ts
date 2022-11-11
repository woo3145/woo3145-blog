interface PostFrontmatter {
  title: string;
  date: string;
  tags: string[];
  thumbnail?: string;
  author: string;
  excerpt: string;
}

interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
}
