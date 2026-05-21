"use client";

import Link from "next/link";
import { Bell, Menu, CalendarRange } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { useAuthContext } from "@/contexts/AuthContext";
import { WebSocketStatus } from "./WebSocketStatus";
import { ThemeToggle } from "./theme-toggle";
import { useNotifications } from "@/hooks/useNotifications";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuthContext();
  const { counts } = useNotifications();
  const unreadNotifications = counts?.unread || 0;

  const getInitials = () => {
    if (!user) return "US";
    const firstNameInitial = user.firstName?.[0]?.toUpperCase() || "";
    const lastNameInitial = user.lastName?.[0]?.toUpperCase() || "";
    return `${firstNameInitial}${lastNameInitial}` || "US";
  };

  return (
    <header className="font-manrope px-5 border-b sm:border-b-2 border-b-[#F0F0F0] dark:border-b-slate-800 bg-white dark:bg-[#1a2540] pb-4">
      <div className="flex flex-col sm:flex-row items-center w-full justify-end gap-4 py-3">
        <div className="flex items-center w-full sm:w-auto justify-between">
          <div
            className="md:hidden rounded-md shadow-none"
            onClick={onMenuClick}
          >
            <Menu className="text-[#003366] dark:text-blue-400" size={24} />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 items-center text-sm text-[#6F6F6F] dark:text-slate-400 p-2 rounded-lg border border-[#F0F0F0] dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700">
              <p className="text-[14px] sm:text-[16px]">
                {format(new Date(), "dd MMM, yyyy")}
              </p>
              <CalendarRange size={24} />
            </div>
            <div className="flex items-center">
              <WebSocketStatus />
            </div>
            <ThemeToggle />
            <Link href="/notifications">
              <Button className="relative bg-white dark:bg-slate-800 shadow-none border border-[#F0F0F0] dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 h-full rounded-lg p-3">
                <Bell className="h-5 w-5 text-gray-600 dark:text-slate-400" />
                {unreadNotifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#003366] px-1 text-[11px] font-semibold leading-none text-white">
                    {unreadNotifications > 99 ? "99+" : unreadNotifications}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/profile">
              <Avatar>
                <AvatarImage
                  src={user?.userAvatar || "/placeholder.svg"}
                  alt="User avatar"
                />
                <AvatarFallback className="bg-green-300">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
