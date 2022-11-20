import { BsMoon, BsSun } from 'react-icons/bs';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { useIsClient } from '../../../hooks/useIsClient';
import Icon from '../../atoms/Icon/Icon';

const DarkModeToggle = () => {
  const isClient = useIsClient();
  const { theme, toggle } = useDarkMode();

  return (
    <div
      onClick={toggle}
      className={`w-10 h-10 border-2 border-neutral-300 rounded-full cursor-pointer flex items-center justify-center relative overflow-hidden ${
        isClient && theme === 'light' && 'hover:border-slate-700'
      }`}
    >
      {isClient ? (
        <div
          className={`flex items-center justify-center top-0 h-40 w-40 absolute transition-transform duration-300 ${
            theme === 'dark' ? 'rotate-0' : '-rotate-90'
          }`}
        >
          <Icon
            icon={'moon'}
            size={20}
            className="absolute top-2"
            color="white"
          />
          <Icon
            icon={'sun'}
            size={20}
            className="absolute transition-transform right-2"
          />
        </div>
      ) : (
        <Icon icon={'moon'} size={20} className="absolute top-2" />
      )}
    </div>
  );
};

export default DarkModeToggle;
