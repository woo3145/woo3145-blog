import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface UseDarkModeOutput {
  theme: string;
  toggle: () => void;
}

export const useDarkMode = (): UseDarkModeOutput => {
  const [theme, setTheme] = useLocalStorage<string>('theme', 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.getElementsByTagName('html')[0].classList.add('dark');
    } else {
      document.getElementsByTagName('html')[0].classList.remove('dark');
    }
  }, [theme]);

  const toggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggle };
};
