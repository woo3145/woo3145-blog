import Navigation from './Navigation';
import TagList from './TagList';

const SideBar = () => {
  return (
    <div className="w-64 shrink-0">
      {/* Sticky */}
      <div className="sticky top-20">
        <Navigation />
        <TagList />
      </div>
    </div>
  );
};

export default SideBar;