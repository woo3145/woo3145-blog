import Icon from '../atoms/Icon/Icon';
import Logo from '../atoms/Logo/Logo';
import DarkModeToggle from '../modules/DarkModeToggle/DarkModeToggle';

interface Props {
  openSideBar: () => void;
}

const Header = ({ openSideBar }: Props) => {
  return (
    <header className="w-full h-16 fixed top-0 z-30 flex justify-center items-center shadow-md dark:shadow-slate-800 dark:shadow-sm bg-primary transition-colors">
      <div className="w-full max-w-screen-2xl px-8 flex justify-between items-center">
        <div className="flex items-center">
          <div
            onClick={openSideBar}
            className="lg:hidden mr-6 p-2 cursor-pointer hover:bg-secondary rounded-md"
          >
            <Icon icon={'menu'} size={30} className="fill-primary"></Icon>
          </div>
          <Logo />
        </div>

        <div className="flex items-center">
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
