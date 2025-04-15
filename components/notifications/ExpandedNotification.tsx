// components/notifications/ExpandedNotification.tsx
import { ChevronLeft } from "lucide-react";
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  sender: string;
  avatar: string;
  message: string;
  time: string;
  unread: boolean;
}

interface Props {
  notification: Notification;
  onClose: () => void;
}

const ExpandedNotifications = ({ notification, onClose }: Props) => {
  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto">
      <div>
        <Button
          className="bg-transparent shadow-none hover:bg-gray-200"
          onClick={onClose}
        >
          <ChevronLeft className="text-[#6F6F6F]" />
        </Button>
      </div>
      <div className="h-full bg-white rounded-2xl flex flex-col gap-5 p-8 sm:px-10">
        <p className="text-[18px] text-center sm:text-left">
          {notification.message.length > 50
            ? `${notification.message.substring(0, 50)}...`
            : notification.message}
        </p>
        <div className="border-b border-[#E3E3E3] -mx-10"></div>
        <div className="flex flex-col gap-6 h-full overflow-y-auto">
          <div className="flex gap-4">
            <div className="relative w-10 h-10">
              <Avatar className="w-10 h-10 rounded-full bg-gray-300">
                <AvatarImage src={notification.avatar} />
              </Avatar>
            </div>
            <div className="flex flex-col">
              <p>{notification.sender}</p>
              <p className="text-sm text-[#7B7B7B]">Teacher</p>
            </div>
          </div>
          <div className="space-y-3 h-full overflow-y-auto">
            {notification.message.split("\n").map((line, index) => (
              <p className="text-[#030E18]" key={index}>
                {line}
              </p>
            ))}
          </div>
          <div className="flex flex-col flex-1 gap-4">
            <Input
              placeholder="Reply here if you have a question or response"
              className="flex-1 text-[#8C8C8C] border-[#8C8C8C] border-0 rounded-none border-b shadow-none focus:outline-none focus-visible:ring-0"
            />
            <div className="flex justify-end">
              <Button className="bg-[#A7A7A7]">Reply</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedNotifications;