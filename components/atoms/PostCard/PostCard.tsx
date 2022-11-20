import Link from 'next/link';
import TagBadge from '../Badge/TagBadge';
import Image from '../Image/Image';

interface Props {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    tags: string[];
    thumbnail?: string;
    author: string;
    excerpt: string;
  };
}

const PostCard = ({ slug, frontmatter }: Props) => {
  const { title, date, tags, thumbnail, excerpt } = frontmatter;
  return (
    <div className="w-full md:max-w-[288px]">
      <Link href={`/posts/${slug}`}>
        <div className="w-full group hover:-translate-y-1 duration-200 flex items-center md:block">
          {thumbnail ? (
            <Image
              width={288}
              height={150}
              priority={true}
              src={`/thumbnail/${thumbnail}`}
              alt="post_thumbnail"
              className="w-40 max-w-[140px] md:max-w-none shrink-0 md:mb-2
                bg-secondary rounded-md bg-cover object-cover object-center"
            />
          ) : (
            <div
              className="w-40 max-w-[140px] md:max-w-none shrink-0 md:mb-2
           bg-secondary rounded-md"
            ></div>
          )}
          <div className="w-full pl-4 md:pl-0">
            <h3 className="text-xl font-bold line-clamp-2 md:group-hover:line-clamp-none">
              {title}
            </h3>
            <div className="mt-1">
              <p className="text-xs">{date}</p>
              <div className="flex gap-2 mt-1">
                {tags.map((tag, idx) => {
                  return <TagBadge key={idx} text={tag} />;
                })}
              </div>
              <div className="pt-2 line-clamp-3">{excerpt}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
