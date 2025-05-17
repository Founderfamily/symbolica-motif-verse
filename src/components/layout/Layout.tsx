
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import CompactFooter from '../sections/CompactFooter';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <CompactFooter />
    </div>
  );
};

export default Layout;
