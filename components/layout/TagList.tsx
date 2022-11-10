import Link from 'next/link';

const TagList = () => {
  return (
    <nav className="pt-6">
      <h3 className="font-bold text-lg mb-2">태그</h3>
      <div className="h-96 overflow-y-scroll">
        <TagListItem href={'/'} text={'# Typescript'} />
        <TagListItem href={'/'} text={'# Typescript'} />
        <TagListItem href={'/'} text={'# Typescript'} />
        <TagListItem href={'/'} text={'# Typescript'} />
        <TagListItem href={'/'} text={'# Typescript'} />
        <TagListItem href={'/'} text={'# Typescript'} />
        <TagListItem href={'/'} text={'# Typescript'} />
        <TagListItem href={'/'} text={'# Typescript'} />
        <TagListItem href={'/'} text={'# Typescript'} />
        <TagListItem href={'/'} text={'# Typescript'} />
        <TagListItem href={'/'} text={'# Typescript'} />
        <TagListItem href={'/'} text={'# Typescript'} />
      </div>
    </nav>
  );
};

const TagListItem = ({ href, text }: { href: string; text: string }) => {
  return (
    <div>
      <Link
        href={href}
        className="px-2 py-2 text-sm flex hover:bg-slate-200 rounded-md"
      >
        {text}
      </Link>
    </div>
  );
};

export default TagList;