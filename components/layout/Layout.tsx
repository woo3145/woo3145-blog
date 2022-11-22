import { ReactNode, useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import { MobileSideBar, SideBar } from './SideBar';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  const [mobileSideBarVisible, setMobileSideBarVisible] = useState(false);

  const openSideBar = () => {
    setMobileSideBarVisible(true);
  };
  const closeSideBar = () => {
    setMobileSideBarVisible(false);
  };

  return (
    <>
      <div className="pt-16 flex flex-col justify-between min-h-screen text-primary bg-primary transition-colors relative">
        <Header openSideBar={openSideBar} />
        {mobileSideBarVisible && <MobileSideBar closeSizeBar={closeSideBar} />}
        <div className="w-full flex md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-2 py-10 md:px-8">
          <SideBar />
          <main className="w-full lg:pl-8">{children}</main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
