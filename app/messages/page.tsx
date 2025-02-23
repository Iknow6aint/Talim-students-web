"use client";
import { useState } from "react";
import Layout from "@/components/Layout";
import { Header } from "@/components/resources/header";
import ChatSidebar from "@/components/messages/ChatSidebar";
import PrivateChat from "@/components/messages/PrivateChat";
import GroupChat from "@/components/messages/GroupChat";

export default function ChatUI() {
  // Default selected chat is private.
  const [selectedChat, setSelectedChat] = useState<{ type: "private" | "group" }>({
    type: "private",
  });

  return (
    <Layout>
      <div className="h-screen font-manrope flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden gap-1 px-8 pt-8 relative">
          <ChatSidebar onSelectChat={setSelectedChat} />
          {selectedChat.type === "group" ? <GroupChat /> : <PrivateChat />}
        </div>
      </div>
    </Layout>
  );
}
