import { BsMoon, BsSun } from 'react-icons/bs';
import { useIsClient } from '../../hooks/useIsClient';
import Icon from './Icon/Icon';

interface Props {
  theme: string;
  onClick?: () => void;
}

const DarkModeToggle = ({ theme, onClick }: Props) => {
  const isClient = useIsClient();
  return (
    <div
      onClick={onClick}
      className="text-xl cursor-pointer flex items-center group opacity-50"
    >
      {isClient ? (
        <Icon icon={theme === 'dark' ? 'sun' : 'moon'} size={20} />
      ) : (
        <Icon icon={'moon'} size={20} />
      )}
    </div>
  );
};

export default DarkModeToggle;
