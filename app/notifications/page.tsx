"use client";
import Layout from "@/components/Layout";
import ExpandedNotifications from "@/components/notifications/ExpandedNotification";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CheckCheck, ChevronDown, Search } from "lucide-react";
import React, { useState } from "react";

type Notification = {
  id: number;
  sender: string;
  avatar: string;
  message: string;
  time: string;
  unread: boolean;
};

const notifications: Notification[] = [
  {
    id: 1,
    sender: "Mrs. Yetunde Adebayo",
    avatar: "/image/teachers/english.png",
    message:
      "Dear Students, I hope this message finds you well! I am excited to announce that we will be starting a new unit in our English class this week. This unit will focus on creative writing and reading comprehension. We’ll be exploring a variety of texts, practicing our writing skills, and discussing key themes to enhance your understanding and appreciation of literature. Additionally, I will be posting weekly homework assignments and reading materials on our class portal, so please be sure to check regularly and stay up to date. If you have any questions or need extra help with any of the materials, don't hesitate to reach out—I'm always here to support you in your learning journey. Let’s make this a fun and productive term together! Warm regards,Students English Language Teacher",
    time: "9:00 PM",
    unread: true,
  },
  {
    id: 2,
    sender: "Mrs. Yetunde Adebayo",
    avatar: "/image/teachers/english.png",
    message:
      "Dear Students, please be reminded that all assignments for this week are ...",
    time: "10:00 PM",
    unread: true,
  },
  {
    id: 3,
    sender: "Mrs. Yetunde Adebayo",
    avatar: "/image/teachers/english.png",

    message:
      "Dear Students, please be reminded that all assignments for this week are ...",
    time: "9:00 PM",
    unread: false,
  },
  {
    id: 4,
    sender: "Mrs. Yetunde Adebayo",
    avatar: "/image/teachers/english.png",

    message:
      "Dear Students, please be reminded that all assignments for this week are ...",
    time: "9:00 PM",
    unread: false,
  },
  {
    id: 5,
    sender: "Mrs. Yetunde Adebayo",
    avatar: "/image/teachers/english.png",

    message:
      "Dear Students, please be reminded that all assignments for this week are ...",
    time: "9:00 PM",
    unread: false,
  },
  {
    id: 6,
    sender: "Mrs. Yetunde Adebayo",
    avatar: "/image/teachers/english.png",

    message:
      "Dear Students, please be reminded that all assignments for this week are ...",
    time: "9:00 PM",
    unread: false,
  },
  {
    id: 7,
    sender: "Mrs. Yetunde Adebayo",
    avatar: "/image/teachers/english.png",

    message:
      "Dear Students, please be reminded that all assignments for this week are ...",
    time: "9:00 PM",
    unread: false,
  },
  {
    id: 8,
    sender: "Mrs. Yetunde Adebayo",
    avatar: "/image/teachers/english.png",

    message:
      "Dear Students, please be reminded that all assignments for this week are ...",
    time: "9:00 PM",
    unread: false,
  },
  {
    id: 9,
    sender: "Mrs. Yetunde Adebayo",
    avatar: "/image/teachers/english.png",

    message:
      "Dear Students, please be reminded that all assignments for this week are ...",
    time: "9:00 PM",
    unread: false,
  },
  {
    id: 10,
    sender: "Mrs. Yetunde Adebayo",
    avatar: "/image/teachers/english.png",

    message:
      "Dear Students, please be reminded that all assignments for this week are ...",
    time: "9:00 PM",
    unread: false,
  },
  {
    id: 11,
    sender: "Mrs. Yetunde Adebayo",
    avatar: "/image/teachers/english.png",

    message:
      "Dear Students, please be reminded that all assignments for this week are ...",
    time: "9:00 PM",
    unread: false,
  },
  {
    id: 12,
    sender: "Mrs. Yetunde Adebayo",
    avatar: "/image/teachers/english.png",

    message:
      "Dear Students, please be reminded that all assignments for this week are ...",
    time: "9:00 PM",
    unread: false,
  },
  {
    id: 13,
    sender: "Mrs. Yetunde Adebayo",
    avatar: "/image/teachers/english.png",

    message:
      "Dear Students, please be reminded that all assignments for this week are ...",
    time: "9:00 PM",
    unread: false,
  },
];

function page() {
  const [allNotifications] = useState(notifications);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  return (
    <Layout>
      <div className="p-4 h-full border-[#F0F0F0] overflow-y-auto">
        {!selectedNotification ? (
          <div className="flex flex-col gap-4 h-full">
            <div className="flex flex-col lg:flex-row justify-between">
              <p className="text-[#2F2F2F] font-medium">Notifications</p>
              <div className="flex gap-2">
                <div className="flex items-center border border-[#F0F0F0] shadow-none rounded-lg px-3 w-full bg-white">
                  <Search className="text-[#898989]" size={18} />
                  <Input
                    className="border-0 shadow-none focus-visible:ring-0 focus:outline-none flex-1"
                    placeholder="Search"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex text-[#595959] opacity-[70%] sm:opacity-[50%] bg-[#FFFFFF] h-full rounded-lg shadow-none border-[#F0F0F0] items-center gap-1"
                    >
                      Recent <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="font-manrope" align="end">
                    <DropdownMenuItem>Recent</DropdownMenuItem>
                    <DropdownMenuItem>All</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="bg-white place-items-center h-full rounded-lg sm:border">
              {/* <img src="/icons/notifications.svg" />
            <p className="text-[#525252]">There are no updates for now</p> */}
              <div className="flex justify-between w-full sm:p-6 py-5 px-2 bg-[#F8F8F8] sm:bg-[#FFFFFF] border-b">
                <div className="flex gap-2">
                  <p className="text-[#003366] cursor-pointer">All</p>
                  <p className="text-[#8F8F8F] cursor-pointer">Unread(10)</p>
                </div>
                <div className="flex gap-1 items-center text-[#003366] cursor-pointer">
                  <CheckCheck size={20} />
                  <p>Mark all as read</p>
                </div>
              </div>
              <div className="w-full h-full overflow-y-auto scrollbar-hide">
                {allNotifications.map((notification: Notification) => (
                  <div
                    key={notification.id}
                    onClick={() => setSelectedNotification(notification)}
                    className="flex items-center gap-4 p-2 sm:px-10 border-b border-l sm:border-l-0 border-r cursor-pointer"
                  >
                    <div className="relative w-10 h-10">
                      <Avatar className="w-10 h-10 rounded-full bg-gray-300">
                        <AvatarImage src={notification.avatar} />
                      </Avatar>
                    </div>
                    <div className="sm:flex gap-4 flex-1">
                      <p>{notification.sender}</p>
                      <p className="text-sm truncate max-w-[250px] sm:max-w-[100px] md:max-w-[50px] lg:max-w-[300px] xl:max-w-[750px] 2xl:max-w-[1800px] flex items-center text-[#737373]">
                        Announcement: {notification.message}
                      </p>
                    </div>
                    <span
                      className={` text-sm ${
                        notification.unread
                          ? "text-[#030E18]"
                          : "text-[#737373]"
                      }`}
                    >
                      {notification.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full ">
            <ExpandedNotifications
              onClose={() => setSelectedNotification(null)}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default page;
