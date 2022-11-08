import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="pt-16 min-h-screen flex flex-col justify-between">
      <Header />
      <main className="w-full max-w-screen-2xl mx-auto px-8 py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
