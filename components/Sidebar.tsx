"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

type MenuItem = {
  label: string;
  iconPath: string;
  notification?: number;
  link?: string;
};

const menuItems: MenuItem[] = [
  { label: "Dashboard", iconPath: "/icons/dashboard.svg", link: "/dashboard" },
  { label: "Subjects", iconPath: "/icons/subjects.svg", link: "/subjects" },
  { label: "Resources", iconPath: "/icons/resources.svg", link: "/resources" },
  { label: "Timetable", iconPath: "/icons/timetable.svg", link: "/timetable" },
  { label: "Attendance", iconPath: "/icons/attendance.svg", link: "/attendance" },
  { label: "Results", iconPath: "/icons/results.svg", link: "/results" },
  { label: "Messages", iconPath: "/icons/messages.svg", link: "/messages" },
  { label: "Settings", iconPath: "/icons/settings.svg", link: "/settings" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const pathname = usePathname();
  const { logout, user } = useAuthContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-[266px] font-manrope px-4 h-full pb-4 bg-[#FBFBFB] dark:bg-slate-900 flex flex-col justify-between border-r border-[#F1F1F1] dark:border-slate-800 overflow-y-auto scrollbar-hide">
      <div>
        <div className="flex items-center py-2 justify-between">
          <div className="flex items-center">
            <div className="text-white p-3 rounded-lg">
              <Image
                src="/icons/talim.svg"
                alt="School"
                width={44.29}
                height={43.23}
              />
            </div>
            <span className="ml-2 text-lg font-semibold text-[#030E18] dark:text-slate-100">
              Talim
            </span>
          </div>
          <div
            className="border border-[#003366] dark:border-slate-600 rounded-md md:hidden"
            onClick={onClose}
          >
            <ChevronLeft className="text-[#003366] dark:text-slate-300" />
          </div>
        </div>
        <div className="mb-4 border-b border-2 border-solid border-[#F1F1F1] dark:border-slate-800 -mx-4" />
        <div className="flex items-center px-2 py-3 border-2 border-solid border-[#F1F1F1] dark:border-slate-700 bg-[#FBFBFB] dark:bg-slate-800 rounded-md mb-4">
          <Image
            src={user?.schoolLogo || "/unity.png"}
            alt={user?.schoolName || "School Logo"}
            width={40}
            height={40}
          />
          <span className="ml-2 font-medium text-base text-gray-700 dark:text-slate-200">
            {user?.schoolName || "Unity Secondary S..."}
          </span>
        </div>
        <nav>
          <ul>
            {menuItems.map((item) => {
              const isActive = pathname === item.link;
              return (
                <li key={item.label} className="mb-4">
                  <Link href={item.link || "#"}>
                    <div
                      className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${
                        isActive
                          ? "bg-[#003366] bg-opacity-25 text-[#003366] dark:bg-blue-900/30 dark:text-blue-400"
                          : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Image
                        src={item.iconPath}
                        alt={item.label}
                        width={20}
                        height={20}
                        className={isActive ? "" : "dark:invert dark:opacity-70"}
                      />
                      <span className="font-manrope text-base ml-3 font-medium">
                        {item.label}
                      </span>
                      {item.notification && (
                        <span className="ml-auto bg-blue-900 dark:bg-blue-700 text-white text-sm w-5 h-5 flex items-center justify-center rounded-full">
                          {item.notification}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div>
        <div className="mb-4 border-b border-2 border-solid border-[#F1F1F1] dark:border-slate-800 -mx-4" />
        <div
          className="flex items-center px-3 py-2 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md cursor-pointer"
          onClick={handleLogout}
        >
          <Image
            src="/icons/logout.svg"
            alt="Logout"
            width={18}
            height={20}
            className="dark:invert dark:opacity-70"
          />
          <span className="ml-3 font-medium">Logout Account</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
