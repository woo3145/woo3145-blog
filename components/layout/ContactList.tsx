import Link from 'next/link';
import Icon from '../atoms/Icon/Icon';

const ContactList = () => {
  return (
    <div className="flex gap-2 pt-2 mt-6 border-t">
      <Link
        href={process.env.NEXT_PUBLIC_USER_GITHUB_URL || ''}
        className="p-3 rounded-md hover:bg-secondary"
        referrerPolicy="no-referrer"
        target="_blank"
      >
        <Icon icon={'github'} size={24} className="dark:fill-white" />
      </Link>
      <Link
        referrerPolicy="no-referrer"
        href={`mailto:${process.env.NEXT_PUBLIC_USER_EMAIL || ''}`}
        className="p-3 rounded-md hover:bg-secondary"
      >
        <Icon icon={'email'} size={24} className="dark:fill-white" />
      </Link>
    </div>
  );
};

export default ContactList;
