import { ReactNode } from 'react';
'use client'; 

interface LayoutProps {
  children: ReactNode;
}

import Sidebar from './Sidebar'

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-row h-screen">
      <Sidebar />
      <div className="bg-[#F8F8F8] flex-1 border border-dashed h-full">
        {children}
      </div>
    </div>
  );
}

export default Layout;