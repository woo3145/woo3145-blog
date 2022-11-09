import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface UseDarkModeOutput {
  isDarkMode: boolean;
  toggle: () => void;
}

export const useDarkMode = (): UseDarkModeOutput => {
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('darkmode', false);

  useEffect(() => {
    if (darkMode) {
      document.getElementsByTagName('html')[0].classList.add('dark');
    } else {
      document.getElementsByTagName('html')[0].classList.remove('dark');
    }
  }, [darkMode]);

  const toggle = () => {
    setDarkMode(!darkMode);
  };

  return { isDarkMode: darkMode, toggle };
};
