import { BsMoon, BsSun } from 'react-icons/bs';
import { useIsClient } from '../../hooks/useIsClient';
import Icon from './Icon';

interface Props {
  darkMode: boolean;
  onClick?: () => void;
}

const DarkModeToggle = ({ darkMode, onClick }: Props) => {
  const isClient = useIsClient();
  return (
    <div
      onClick={onClick}
      className="text-xl cursor-pointer flex items-center group opacity-50"
    >
      {isClient ? (
        <Icon icon={darkMode ? 'sun' : 'moon'} size={20} />
      ) : (
        <Icon icon={'moon'} size={20} />
      )}
    </div>
  );
};

export default DarkModeToggle;
