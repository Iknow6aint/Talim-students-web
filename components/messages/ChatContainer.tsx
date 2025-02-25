// ChatContainer.tsx
import React from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";

interface ChatContainerProps {
  headerProps: React.ComponentProps<typeof ChatHeader>;
  children: React.ReactNode;
  replyingMessage?: any;
  onCancelReply?: () => void;
}

export default function ChatContainer({
  headerProps,
  children,
  replyingMessage,
  onCancelReply,
}: ChatContainerProps) {
  return (
    <div className="w-2/3 flex flex-col">
      <div className="flex items-center rounded-tr-lg p-4 border-b bg-white">
        <ChatHeader {...headerProps} />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">{children}</div>
      {replyingMessage && (
        <div className="p-3 flex border-b border-[#F0F0F0] mx-4 bg-white rounded-lg items-start">
          <div className="flex flex-col">
            <p className="font-semibold text-[#F39C12] text-sm mb-1">
              {replyingMessage.sender}
            </p>
            <p className="text-sm text-[#030E18] leading-tight">
              {replyingMessage.text}
            </p>
          </div>
          <button
            onClick={onCancelReply}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      )}
      <MessageInput />
    </div>
  );
}
