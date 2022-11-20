import Link from 'next/link';
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
              width={1280}
              height={720}
              priority={true}
              src={`/thumbnail/${thumbnail}`}
              alt="post_thumbnail"
              className="w-40 max-w-[140px] md:max-w-none mr-4 shrink-0 md:mb-2 md:mr-0
                bg-secondary rounded-md bg-cover object-cover object-center"
            />
          ) : (
            <div
              className="w-40 max-w-[140px] md:max-w-none mr-4 shrink-0 md:mb-2 md:mr-0
           bg-secondary rounded-md"
            ></div>
          )}
          <div className="w-full">
            <h3 className="text-xl font-bold line-clamp-2 md:group-hover:line-clamp-none">
              {title}
            </h3>
            <div className="mt-1">
              <p className="text-xs">{date}</p>
              <div className="flex gap-2 mt-1">
                {tags.map((tag, idx) => {
                  return (
                    <div
                      key={idx}
                      className="text-xs px-2 py-1 bg-secondary rounded-md"
                    >
                      #{tag}
                    </div>
                  );
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
