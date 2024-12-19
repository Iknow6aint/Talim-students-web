import React from 'react';
import Image from 'next/image';
// 1. Type for Menu Item
type MenuItem = {
  label: string; // Menu name
  iconPath: string; // Emoji iconPath or component
  notification?: number; // Optional notification count
};

const menuItems: MenuItem[] = [
  { label: 'Dashboard', iconPath: '/icons/dashboard.svg' },
  { label: 'Subjects', iconPath: '/icons/subjects.svg' },
  { label: 'Resources', iconPath: '/icons/resources.svg' },
  { label: 'Timetable', iconPath: '/icons/timetable.svg' },
  { label: 'Attendance', iconPath: '/icons/attendance.svg' },
  { label: 'Results', iconPath: '/icons/attendance.svg' },
  { label: 'Messages', iconPath: '/icons/attendance.svg', notification: 5 },
];

const Sidebar: React.FC = () => {
  return (
    <div className="h-screen w-[266px] font-manrope px-4 pt-8 pb-4 bg-[#FBFBFB] flex flex-col justify-between border-r">
      {/* Header */}
      <div>
        <div className="flex items-center mb-4">
          <div className=" text-white p-3 rounded-lg">
          <Image src="/icons/talim.svg" alt='School' width={44.29} height={43.23}/>
          </div>
          <span className="ml-2 text-lg font-semibold text-[#030E18]">Talim</span>
          
        </div>
        <div className="mb-4 border-b border-2 border-solid border-[#F1F1F1] -mx-4"></div>

        {/* School Selector */}
        <div className="flex items-center px-2 py-3 border-2 border-solid border-[#F1F1F1] bg-[#FBFBFB] rounded-md mb-4">
          <Image src="/icons/unity.png" alt='School' width={40} height={40}/>
          <span className="ml-2 font-medium text-base text-gray-700">Unity Secondary S...</span>
        </div>

        {/* Menu Items */}
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.label} className="mb-4">
                <div
                  className={`flex items-center px-3 py-2 rounded-md ${
                    item.label === 'Dashboard'
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Image src={item.iconPath} alt={item.label} width={20} height={20} />
                  <span className="ml-3 font-medium">{item.label}</span>
                  {item.notification && (
                    <span className="ml-auto bg-blue-900 text-white text-sm w-5 h-5 flex items-center justify-center rounded-full">
                      {item.notification}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Logout */}
      <div>
      <div className="mb-4 border-b border-2 border-solid border-[#F1F1F1] -mx-4"></div>

        <div className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
        <Image src="/icons/logout.svg" alt='School' width={18} height={20}/>
          <span className="ml-3 font-medium">Logout Account</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
