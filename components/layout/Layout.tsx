import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import { MobileSideBar, SideBar } from './SideBar';
import dynamic from 'next/dynamic';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  const router = useRouter();
  const [mobileSideBarVisible, setMobileSideBarVisible] = useState(false);

  const openSideBar = () => {
    setMobileSideBarVisible(true);
  };
  const closeSideBar = () => {
    setMobileSideBarVisible(false);
  };

  useEffect(() => {
    closeSideBar();
  }, [router]);

  return (
    <>
      <div className="relative flex flex-col justify-between min-h-screen pt-16 transition-colors text-primary bg-primary">
        <Header openSideBar={openSideBar} />
        {mobileSideBarVisible && <MobileSideBar closeSizeBar={closeSideBar} />}
        <div className="flex w-full px-2 py-10 mx-auto md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl md:px-8">
          <SideBar />
          <main className="w-full lg:pl-8">{children}</main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
