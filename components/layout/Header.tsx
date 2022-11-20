import Link from 'next/link';
import DarkModeToggle from '../modules/DarkModeToggle/DarkModeToggle';

const Header = () => {
  return (
    <header className="w-full h-16 fixed top-0 z-30 shadow-md flex justify-center items-center dark:shadow-slate-800 dark:shadow-sm bg-white dark:bg-neutral-900 transition-colors">
      <div className="w-full max-w-screen-2xl px-8 flex justify-between items-center">
        <Link href="/" className="text-xl">
          Woo3145&apos;s Blog
        </Link>

        <div className="flex items-center">
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
