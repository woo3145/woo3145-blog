import Link from 'next/link';

const Navigation = () => {
  return (
    <ul className="px-8 text-lg flex">
      <NavigationItem text={'about'} href="about" />
      <NavigationItem text={'posts'} href="posts" />
    </ul>
  );
};

const NavigationItem = ({ text, href }: { text: string; href: string }) => {
  return (
    <li className="text-lg px-2 hover:translate-y-0.5 transition-transform">
      <Link href={href}>{text}</Link>
    </li>
  );
};

export default Navigation;
