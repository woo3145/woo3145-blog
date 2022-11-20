import Icon from '../atoms/Icon/Icon';

const ContactList = () => {
  return (
    <div className="mt-6 pt-2 flex gap-2 border-t">
      <a
        href={process.env.NEXT_PUBLIC_USER_GITHUB_URL || ''}
        className="p-3 rounded-md hover:bg-secondary"
        rel="noreferrer"
        target="_blank"
      >
        <Icon icon={'github'} size={24} className="dark:fill-white" />
      </a>
      <a
        rel="noreferrer"
        href={`mailto:${process.env.NEXT_PUBLIC_USER_EMAIL || ''}`}
        className="p-3 rounded-md hover:bg-secondary"
      >
        <Icon icon={'email'} size={24} className="dark:fill-white" />
      </a>
    </div>
  );
};

export default ContactList;
