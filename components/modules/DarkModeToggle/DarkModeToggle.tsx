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
      className="w-10 h-10 border-2 rounded-full hover:border-slate-700 cursor-pointer flex items-center justify-center relative overflow-hidden"
    >
      {isClient ? (
        <div
          className={`flex items-center justify-center top-0 h-40 w-40 absolute transition-transform duration-300 ${
            theme === 'dark' ? 'rotate-0' : '-rotate-90'
          }`}
        >
          <Icon icon={'moon'} size={20} className="absolute top-2" />
          <Icon
            icon={'sun'}
            size={20}
            className="absolute transition-transform right-2"
          />
        </div>
      ) : (
        <Icon icon={'moon'} size={20} className="absolute top-2" />
      )}
      {/* {isClient ? (
        <Icon icon={theme === 'dark' ? 'sun' : 'moon'} size={20} />
      ) : (
        <Icon icon={'moon'} size={20} />
      )} */}
    </div>
  );
};

export default DarkModeToggle;
