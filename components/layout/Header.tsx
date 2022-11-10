import Link from 'next/link';
import { useState } from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';
import DarkModeToggle from '../atoms/DarkModeToggle';
import Navigation from './Navigation';

const Header = () => {
  const { theme, toggle } = useDarkMode();

  return (
    <header className="w-full h-16 fixed top-0 bg-white shadow-md flex justify-center items-center">
      <div className="w-full max-w-screen-2xl px-8 flex justify-between">
        <Link href="/" className="text-xl">
          Woo3145&apos;s Blog
        </Link>

        <div className="flex items-center">
          <DarkModeToggle theme={theme} onClick={toggle} />
        </div>
      </div>
    </header>
  );
};

export default Header;
