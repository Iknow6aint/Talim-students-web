"use client";
import { useState } from "react";
import Layout from "@/components/Layout";
import ChatSidebar from "@/components/messages/ChatSidebar";
import PrivateChat from "@/components/messages/PrivateChat";
import GroupChat from "@/components/messages/GroupChat";

export default function ChatUI() {
  const [selectedChat, setSelectedChat] = useState<{
    type: "private" | "group" | null;
  } | null>({
    type: "private",
  });
  const [replyingMessage, setReplyingMessage] = useState<{
    sender: string;
    text: string;
  } | null>(null);
  const [openSubMenu, setOpenSubMenu] = useState<{
    index: number;
    type: string;
  } | null>(null);

  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSubMenu = (index: number, type: string) => {
    if (
      openSubMenu &&
      openSubMenu.index === index &&
      openSubMenu.type === type
    ) {
      setOpenSubMenu(null);
    } else {
      setOpenSubMenu({ index, type });
    }
  };

  const onBack = () => {
    setSelectedChat(null);
    setShowSidebar(true);
  };

  return (
    <Layout>
      <div className="flex flex-1 h-[100vh] sm:h-[calc(100vh-85px)] overflow-hidden gap-1 px-5 pt-8 relative">
        <div className="flex flex-1 gap-1 border border-[#F0F0F0] ">
          {/* Sidebar - Show only when showSidebar is true on mobile */}
          <div
            className={`${
              showSidebar ? "block" : "hidden"
            } md:block w-full md:w-auto  scrollbar-hide`}
          >
            <ChatSidebar
              onSelectChat={(chat) => {
                setSelectedChat(chat);
                setShowSidebar(false); // Hide sidebar when chat is selected
              }}
            />
          </div>
          {/* Chat Window - Show only when showSidebar is false on mobile */}
          <div
            className={`${showSidebar ? "hidden" : "block"} md:flex flex-1 `}
          >
            {selectedChat && (
              <>
                {selectedChat.type === "group" ? (
                  <GroupChat
                    replyingMessage={replyingMessage}
                    setReplyingMessage={setReplyingMessage}
                    openSubMenu={openSubMenu}
                    toggleSubMenu={toggleSubMenu}
                    onBack={onBack}
                  />
                ) : (
                  <PrivateChat
                    replyingMessage={replyingMessage}
                    setReplyingMessage={setReplyingMessage}
                    openSubMenu={openSubMenu}
                    toggleSubMenu={toggleSubMenu}
                    onBack={onBack}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
