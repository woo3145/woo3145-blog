import Link from 'next/link';
import Icon, { IconName } from '../atoms/Icon/Icon';

const Navigation = () => {
  return (
    <nav>
      <ul className="">
        <NavigationItem text={'홈'} href="/" icon={'home'} />
        <NavigationItem text={'포스트'} href="posts" icon={'code'} />
      </ul>
    </nav>
  );
};

const NavigationItem = ({
  text,
  href,
  icon,
}: {
  text: string;
  href: string;
  icon: IconName;
}) => {
  return (
    <li>
      <Link
        href={href}
        className="px-4 py-3 flex items-center hover:bg-slate-200 dark:hover:bg-neutral-700 rounded-md"
      >
        <Icon icon={icon} size={20} className="mr-4 dark:fill-white" />
        <p className="">{text}</p>
      </Link>
    </li>
  );
};

export default Navigation;
