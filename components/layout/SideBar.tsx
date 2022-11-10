import ContactList from './ContactList';
import Navigation from './Navigation';
import TagList from './TagList';

const SideBar = () => {
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

export default SideBar;
