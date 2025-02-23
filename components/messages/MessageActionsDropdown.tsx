// MessageActionsDropdown.tsx
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface MessageActionsDropdownProps {
  index: number;
  openSubMenu: { index: number; type: string } | null;
  toggleSubMenu: (index: number, type: string) => void;
  setReplyingMessage: (msg: any) => void;
  msg: any;
}

const MessageActionsDropdown = ({
  index,
  openSubMenu,
  toggleSubMenu,
  setReplyingMessage,
  msg,
}: MessageActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 bg-white border border-[#F0F0F0] rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
          <ChevronDown className="text-[#878787]" size={16} />
        </button>
      </DropdownMenuTrigger>
      {!(openSubMenu && openSubMenu.index === index) && (
        <DropdownMenuContent
          className="border-[#F0F0F0] font-manrope shadow-none"
          align="end"
        >
          <DropdownMenuItem
            onClick={() => setReplyingMessage(msg)}
            className="text-[#131616]"
          >
            Reply
          </DropdownMenuItem>
          <DropdownMenuItem className="text-[#131616]">
            Reply privately
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => toggleSubMenu(index, "emojis")}
            className="text-[#131616]"
          >
            Emojis
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => toggleSubMenu(index, "sendTo")}
            className="text-[#131616]"
          >
            Send to
          </DropdownMenuItem>
          <DropdownMenuItem className="text-[#131616]">
            Download
          </DropdownMenuItem>
          <DropdownMenuItem className="text-[#131616]">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default MessageActionsDropdown;
