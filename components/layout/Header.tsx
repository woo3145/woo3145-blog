import DarkModeToggle from 'components/atoms/DarkModeToggle';
import Link from 'next/link';
import { useState } from 'react';
import Navigation from './Navigation';

const Header = () => {
  const [darkmode, setDarkMode] = useState(false);

  const darkModeToggle = () => {
    setDarkMode(!darkmode);
  };

  return (
    <header className="w-full h-16 fixed top-0 bg-white shadow-md flex justify-center items-center">
      <div className="w-full max-w-screen-2xl px-8 flex justify-between">
        <Link href="/" className="text-xl">
          Woo3145&apos;s Blog
        </Link>

        <div className="flex items-center">
          <Navigation />
          <DarkModeToggle darkmode={darkmode} onClick={darkModeToggle} />
        </div>
      </div>
    </header>
  );
};

export default Header;
