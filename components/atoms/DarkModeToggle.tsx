import { BsMoon, BsSun } from 'react-icons/bs';

interface Props {
  darkmode?: boolean;
  onClick?: () => void;
}

const DarkModeToggle = ({ darkmode, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className="text-xl cursor-pointer flex items-center group opacity-50 relative"
    >
      {darkmode ? <BsSun /> : <BsMoon />}
    </div>
  );
};

export default DarkModeToggle;
