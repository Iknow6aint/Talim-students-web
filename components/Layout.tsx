import { ReactNode } from 'react';
'use client'; 

interface LayoutProps {
  children: ReactNode;
}

import Sidebar from './Sidebar'

function Layout({children}: LayoutProps) {
  return (
    <div className='h-screen flex flex-row justify-start'>
        <Sidebar/>
        <div className='bg-blue-400 flex flex-1 p-4 text-white border-1 border-dashed '>{children}</div>
    </div>
  
  )
}

export default Layout