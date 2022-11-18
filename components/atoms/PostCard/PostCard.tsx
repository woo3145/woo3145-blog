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
        <div className="w-full transition-transform hover:-translate-y-1 duration-200 flex items-center md:block">
          {thumbnail ? (
            <Image
              width={800}
              height={600}
              priority={true}
              src={`/thumbnail/${thumbnail}`}
              alt="post_thumbnail"
              className="w-40 h-24 mr-4 shrink-0 md:mb-2 md:mr-0 md:w-full md:h-40
                bg-neutral-700 rounded-md bg-cover object-cover object-center"
            />
          ) : (
            <div
              className="w-40 h-24 mr-4 shrink-0 md:mb-2 md:mr-0 md:w-full md:h-44
           bg-neutral-700 rounded-md"
            ></div>
          )}
          <div className="w-full">
            <h3 className="text-xl line-clamp-2">{title}</h3>
            <div className="mt-1">
              <p className="text-xs">{date}</p>
              <div className="flex gap-2 mt-1">
                {tags.map((tag, idx) => {
                  return (
                    <div
                      key={idx}
                      className="text-xs px-2 py-1 bg-neutral-200 dark:bg-neutral-600 rounded-md"
                    >
                      #{tag}
                    </div>
                  );
                })}
              </div>
              <div className="pt-2 font-normal line-clamp-3">{excerpt}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
