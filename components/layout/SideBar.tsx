import Icon from '../atoms/Icon/Icon';
import Logo from '../atoms/Logo/Logo';
import ContactList from './ContactList';
import Navigation from './Navigation';
import TagList from './TagList';

export const SideBar = () => {
  return (
    <div className="w-60 shrink-0 hidden lg:block">
      {/* Sticky */}
      <div className="sticky top-20">
        <Navigation />
        <TagList />
        <ContactList />
      </div>
    </div>
  );
};

interface MobileSizeBarProps {
  closeSizeBar: () => void;
}

export const MobileSideBar = ({ closeSizeBar }: MobileSizeBarProps) => {
  return (
    <div className="absolute w-full h-screen top-0 left-0 lg:hidden">
      <div className="w-72 px-4 absolute left-0 top-0 h-full bg-primary z-50">
        <header className="h-16 flex items-center justify-between border-b">
          <Logo />
          <div
            onClick={closeSizeBar}
            className="p-2 hover:bg-secondary cursor-pointer rounded-md"
          >
            <Icon icon={'close'} size={32} />
          </div>
        </header>
        <div className="pt-4">
          <Navigation />
          <TagList />
          <ContactList />
        </div>
      </div>
      <div
        onClick={closeSizeBar}
        className="w-full h-screen absolute left-0 top-0 bg-black z-40 opacity-60 cursor-pointer"
      ></div>
    </div>
  );
};
