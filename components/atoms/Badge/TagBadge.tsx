import Link from 'next/link';

interface Props {
  text: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const TagBadge = ({ text, className, size = 'xs' }: Props) => {
  return (
    <Link
      href={`/posts?filter=${text}`}
      className={`text-${size} px-2 py-1 bg-secondary rounded-md first-letter:uppercase hover:underline ${
        className && className
      }`}
    >
      # {text}
    </Link>
  );
};

export default TagBadge;
