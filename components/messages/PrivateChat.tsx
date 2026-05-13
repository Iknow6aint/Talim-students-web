"use client";

import { useEffect, useRef, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import GroupMessageBubble from "./GroupMessageBubble";
import ReplyPreview from "./ReplyPreview";
import { useRoomMessages } from "@/hooks/useRoomMessages";
import { useAuthContext } from "@/contexts/AuthContext";
import { RealtimeChatRoom } from "@/hooks/useChat";
import { Loader2, MessageCircle } from "lucide-react";
import { generateColorFromString } from "@/lib/colorUtils";

interface PrivateChatProps {
  replyingMessage: { sender: string; text: string } | null;
  setReplyingMessage: (msg: any) => void;
  openSubMenu: { index: number; type: string } | null;
  toggleSubMenu: (index: number, type: string) => void;
  onBack: () => void;
  room?: RealtimeChatRoom;
}

export default function PrivateChat({
  replyingMessage,
  setReplyingMessage,
  openSubMenu,
  toggleSubMenu,
  onBack,
  room,
}: PrivateChatProps) {
  const { user } = useAuthContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    sendMessage,
    loadMoreMessages,
  } = useRoomMessages(room?.roomId || null);

  const getCurrentUserId = (): string | undefined => {
    if (!user) return undefined;
    return (user as any).id || user.userId || (user as any)._id;
  };

  const getColorForUser = (senderId: string, senderName = ""): string => {
    return generateColorFromString(senderName || senderId || "unknown");
  };

  const resolveSenderInfo = (message: any) => {
    let senderId = "";
    let senderName = "";
    let avatar = "";

    if (message.senderId && typeof message.senderId === "object") {
      senderId = message.senderId.userId || message.senderId._id || "";
      senderName = `${message.senderId.firstName || ""} ${message.senderId.lastName || ""}`.trim();
      avatar = message.senderId.userAvatar || "";
    } else if (typeof message.senderId === "string") {
      senderId = message.senderId;
      senderName = message.senderName || message.sender || "";
    }

    const currentUserId = getCurrentUserId();

    if (currentUserId && senderId === currentUserId && user) {
      if (!senderName || senderName === "Unknown") {
        senderName =
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          user.email ||
          "You";
      }
      if (!avatar) avatar = (user as any).userAvatar || "";
    }

    if ((!senderName || !avatar) && room?.participants) {
      const participant = room.participants.find(
        (p: any) => p._id === senderId || p.userId === senderId || (p as any).id === senderId
      );
      if (participant) {
        if (!senderName) {
          senderName =
            `${participant.firstName || ""} ${participant.lastName || ""}`.trim() ||
            (participant as any).name ||
            "Unknown User";
        }
        if (!avatar) avatar = participant.userAvatar || "";
      }
    }

    return { senderId, senderName: senderName || "Unknown", avatar };
  };

  const isCurrentUser = (senderId: string, senderName: string): boolean => {
    if (!user) return false;
    const allUserIds = [(user as any).id, user.userId, (user as any)._id].filter(Boolean);
    if (senderId && allUserIds.some(id => id === senderId)) return true;
    if (user.firstName && user.lastName && senderName) {
      const fullName = `${user.firstName} ${user.lastName}`.trim();
      if (fullName.toLowerCase() === senderName.toLowerCase().trim()) return true;
    }
    return false;
  };

  const transformMessageForUI = (message: any) => {
    const { senderId, senderName, avatar } = resolveSenderInfo(message);
    const isUserMessage = isCurrentUser(senderId, senderName);
    const messageText = message.text || message.content || "";
    const messageTime = (message as any).createdAt || message.timestamp || new Date();

    return {
      _id: message._id,
      sender: senderName,
      senderType: isUserMessage ? "self" : "other",
      text: messageText,
      time: new Date(messageTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: message.type || "text",
      avatar,
      color: getColorForUser(senderId, senderName),
      duration: message.duration,
      originalSenderId: senderId,
      timestamp: messageTime,
    };
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || !room) return;
      sendMessage(content.trim(), "text");
    },
    [room, sendMessage]
  );

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current || isLoadingMore || !hasMore) return;
    if (messagesContainerRef.current.scrollTop === 0) {
      loadMoreMessages();
    }
  }, [isLoadingMore, hasMore, loadMoreMessages]);

  const groupMessagesByDate = () => {
    const grouped: { [key: string]: any[] } = {};
    messages.forEach((message) => {
      const messageDate =
        (message as any).createdAt || message.timestamp || new Date();
      const date = new Date(messageDate).toDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(message);
    });

    const sortedDates = Object.keys(grouped).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    const sortedGrouped: { [key: string]: any[] } = {};
    sortedDates.forEach((date) => {
      sortedGrouped[date] = grouped[date].sort((a, b) => {
        const timeA = new Date((a as any).createdAt || a.timestamp).getTime();
        const timeB = new Date((b as any).createdAt || b.timestamp).getTime();
        return timeA - timeB;
      });
    });
    return sortedGrouped;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString();
  };

  if (!room) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p>No conversation selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <ChatHeader
        avatar={
          room.avatarInfo.type === "image" ? room.avatarInfo.value : ""
        }
        name={room.displayName}
        status={room.isOnline ? "Online" : undefined}
        participants={room.participants || []}
        currentUserId={user?.id || user?.userId}
        onBack={onBack}
      />

      <div
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-600 mb-3">{error}</p>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center p-8">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No messages yet
              </h3>
              <p className="text-gray-500">
                Send a message to start the conversation
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupMessagesByDate()).map(([date, dayMessages]) => (
              <div key={date} className="space-y-3">
                <div className="flex justify-center">
                  <div className="px-3 py-1 bg-white rounded-full shadow-sm border border-gray-200">
                    <span className="text-xs font-medium text-gray-600">
                      {formatDate(new Date(date))}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {dayMessages.map((message, index) => {
                    const transformed = transformMessageForUI(message);
                    return (
                      <GroupMessageBubble
                        key={message._id || index}
                        msg={transformed}
                        index={index}
                        openSubMenu={openSubMenu}
                        toggleSubMenu={toggleSubMenu}
                        setReplyingMessage={setReplyingMessage}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {replyingMessage && (
        <ReplyPreview
          replyingMessage={replyingMessage}
          onCancel={() => setReplyingMessage(null)}
        />
      )}

      <MessageInput
        onSendMessage={handleSendMessage}
        replyingMessage={replyingMessage}
        disabled={!room || isLoading}
      />
    </div>
  );
}
