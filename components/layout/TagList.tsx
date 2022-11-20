import Link from 'next/link';
import { useTagContext } from '../context/TagContext';

const TagList = () => {
  const { tags } = useTagContext();
  return (
    <nav className="mt-6">
      <h3 className="font-bold text-lg mb-2">태그</h3>
      <div
        className="h-96 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-rounded-md 
        scrollbar-track-neutral-200 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-800 dark:scrollbar-thumb-slate-300"
      >
        {tags.map((tag, idx) => {
          return (
            <TagListItem
              key={idx}
              href={`/posts?filter=${tag}`}
              text={`${tag}`}
            />
          );
        })}
      </div>
    </nav>
  );
};

const TagListItem = ({ href, text }: { href: string; text: string }) => {
  return (
    <div>
      <Link
        href={href}
        className="px-2 py-2 text-sm flex hover:bg-secondary rounded-md first-letter:uppercase"
      >
        # <span className="first-letter:uppercase pl-2">{text}</span>
      </Link>
    </div>
  );
};

export default TagList;
