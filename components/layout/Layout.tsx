import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import SideBar from './SideBar';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="pt-16 min-h-screen flex flex-col justify-between">
      <Header />
      <div className="w-full flex max-w-screen-2xl mx-auto px-8 py-10">
        <SideBar />
        <main className="w-full pl-8">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
