import Link from 'next/link';

interface Props {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    tags: string[];
  };
  excerpt: string;
}

const PostCard = ({ slug, frontmatter, excerpt }: Props) => {
  const { title, date, tags } = frontmatter;
  return (
    <Link href={`/post/${slug}`} className="w-full">
      <div className="w-full p-2 transition-transform hover:-translate-y-1 duration-200">
        <h3 className="text-2xl line-clamp-2">{title}</h3>
        <div className="mt-1">
          <p className="text-xs">{date}</p>
          <div className="flex gap-2 mt-1">
            {tags.map((tag, idx) => {
              return (
                <div
                  key={idx}
                  className="text-xs px-2 py-1 bg-slate-200 rounded-md"
                >
                  #{tag}
                </div>
              );
            })}
          </div>
          <div className="pt-2 text-gray-700 font-normal line-clamp-3">
            {excerpt}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
