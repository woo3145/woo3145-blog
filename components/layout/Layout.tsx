import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import SideBar from './SideBar';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <div className="pt-16 flex flex-col justify-between min-h-screen text-primary bg-primary transition-colors">
        <Header />
        <div className="w-full flex md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-2 py-10 md:px-8">
          <SideBar />
          <main className="w-full md:pl-8">{children}</main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
