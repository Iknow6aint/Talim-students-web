
'use client'; 
import Sidebar from './Sidebar'

function Layout() {
  return (
    <div className='h-screen flex flex-row justify-start'>
        <Sidebar/>
        <div className='bg-blue-400 flex flex-1 p-4 text-white border-1 border-dashed '>Blog dashboard </div>
    </div>
  
  )
}

export default Layout