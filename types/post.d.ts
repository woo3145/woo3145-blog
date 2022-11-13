interface IPostFrontmatter {
  title: string;
  date: string;
  tags: string[];
  thumbnail: string;
  author: string;
  excerpt: string;
}

interface IPost {
  slug: string;
  frontmatter: IPostFrontmatter;
  content: string;
}
