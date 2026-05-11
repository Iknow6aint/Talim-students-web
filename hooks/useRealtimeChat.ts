"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useWebSocketContextSafe } from "@/contexts/WebSocketContext";
import { ChatRoomData, ChatRoomsUpdateData, ChatMessage } from "./useWebSocket";

export interface RealtimeChatRoom extends ChatRoomData {
  displayName: string;
  avatarInfo: {
    type: "image" | "initials";
    value: string;
    bgColor?: string;
  };
  isOnline?: boolean;
  lastSeen?: Date;
}

interface UseRealtimeChatReturn {
  chatRooms: RealtimeChatRoom[];
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;

  // Chat room operations
  refreshChatRooms: () => void;
  searchChatRooms: (searchTerm: string) => RealtimeChatRoom[];
  getFilteredChatRooms: (type?: string) => RealtimeChatRoom[];

  // Room selection and management
  selectedRoomId: string | null;
  selectRoom: (roomId: string) => void;
  unselectRoom: () => void;

  // Message operations
  sendMessage: (
    content: string,
    type?: "text" | "voice",
    duration?: number
  ) => void;
  markAsRead: (messageId: string) => void;

  // Real-time events
  onNewMessage: (callback: (message: ChatMessage) => void) => () => void;
  onRoomUpdate: (
    callback: (roomId: string, room: RealtimeChatRoom) => void
  ) => () => void;
}

export const useRealtimeChat = (): UseRealtimeChatReturn => {
  const [chatRooms, setChatRooms] = useState<RealtimeChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const { user } = useAuthContext();

  // Called unconditionally — returns null when used outside a WebSocketProvider.
  const webSocketContext = useWebSocketContextSafe();
  const {
    socket,
    isConnected,
    fetchChatRooms,
    onChatRoomsUpdate,
    onChatMessage,
    sendChatMessage,
    joinChatRoom,
    leaveChatRoom,
    markMessageAsRead,
    onUnreadMessagesUpdate,
  } = (webSocketContext ?? {
    socket: null,
    isConnected: false,
    fetchChatRooms: () => {},
    onChatRoomsUpdate: (_cb: any) => () => {},
    onChatMessage: (_cb: any) => () => {},
    sendChatMessage: () => {},
    joinChatRoom: () => {},
    leaveChatRoom: () => {},
    markMessageAsRead: () => {},
    onUnreadMessagesUpdate: (_cb: any) => () => {},
  });

  const searchTermRef = useRef<string>("");
  const mountedRef = useRef(true);
  const selectedRoomIdRef = useRef<string | null>(null);

  // Keep ref in sync so event-handler closures can read the current room without
  // stale-closure bugs.
  useEffect(() => {
    selectedRoomIdRef.current = selectedRoomId;
  }, [selectedRoomId]);

  // Initial chat rooms fetch when connected
  useEffect(() => {
    const userId = user?.id || user?.userId;

    if (isConnected && userId && socket?.connected) {
      setIsLoading(true);
      setError(null);
      fetchChatRooms(userId);
    } else {
      setIsLoading(false);
    }
  }, [isConnected, user?.id, user?.userId, socket?.connected, fetchChatRooms]);

  // Transform chat room data for better UX
  const transformChatRoom = useCallback(
    (room: ChatRoomData): RealtimeChatRoom => {
      let displayName = room.name || "Chat Room";
      let avatarInfo: RealtimeChatRoom["avatarInfo"] = {
        type: "initials",
        value: "CR",
        bgColor: generateColorFromString(displayName),
      };
      let isOnline = false;

      switch (room.type) {
        case "group":
        case "class":
        case "class_group":
        case "course_group": {
          displayName = room.name || `Class ${room.classId || "Chat"}`;
          avatarInfo = {
            type: "initials",
            value: displayName
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase(),
            bgColor: generateColorFromString(displayName),
          };
          isOnline = room.participants.some(
            (p) => p.role === "teacher" && p.isOnline
          );
          break;
        }

        case "one_to_one": {
          const otherParticipant = room.participants.find(
            (p) => p.userId !== user?.id && p.userId !== user?.userId
          );

          if (otherParticipant) {
            displayName =
              `${otherParticipant.firstName || ""} ${
                otherParticipant.lastName || ""
              }`.trim() || "Unknown User";
            isOnline = otherParticipant.isOnline || false;

            if (otherParticipant.userAvatar) {
              avatarInfo = {
                type: "image",
                value: otherParticipant.userAvatar,
              };
            } else {
              const initials = `${otherParticipant.firstName?.[0] || ""}${
                otherParticipant.lastName?.[0] || ""
              }`.toUpperCase();
              avatarInfo = {
                type: "initials",
                value: initials || "U",
                bgColor: generateColorFromString(displayName),
              };
            }
          }
          break;
        }
      }

      // Normalise lastMessage — backend may send 'text' instead of 'content'
      let transformedLastMessage = room.lastMessage;
      if (room.lastMessage && (room.lastMessage as any).text) {
        transformedLastMessage = {
          ...room.lastMessage,
          content: (room.lastMessage as any).text,
        };
      }

      return {
        ...room,
        displayName,
        avatarInfo,
        isOnline,
        lastMessage: transformedLastMessage,
      };
    },
    [user?.id, user?.userId]
  );

  // Handle real-time chat rooms updates
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = onChatRoomsUpdate((data: ChatRoomsUpdateData) => {
      if (!mountedRef.current) return;

      if (!data || !data.rooms || !Array.isArray(data.rooms)) {
        setError("Invalid chat rooms data received");
        setIsLoading(false);
        return;
      }

      const transformedRooms = data.rooms.map((roomData) => {
        const transformed = transformChatRoom(roomData);
        // Preserve locally-zeroed unread count for the open room so a stale
        // server snapshot doesn't re-show the badge.
        if (transformed.roomId === selectedRoomIdRef.current) {
          return { ...transformed, unreadCount: 0 };
        }
        return transformed;
      });

      // Sort by last message time
      transformedRooms.sort((a, b) => {
        const timeA = a.lastMessage?.timestamp
          ? new Date(a.lastMessage.timestamp).getTime()
          : new Date(a.updatedAt).getTime();
        const timeB = b.lastMessage?.timestamp
          ? new Date(b.lastMessage.timestamp).getTime()
          : new Date(b.updatedAt).getTime();
        return timeB - timeA;
      });

      setChatRooms(transformedRooms);
      setIsLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [isConnected, onChatRoomsUpdate, transformChatRoom]);

  // Handle real-time messages
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = onChatMessage((message: ChatMessage) => {
      if (!mountedRef.current) return;

      setChatRooms((prevRooms) => {
        const updatedRooms = prevRooms.map((room) => {
          if (room.roomId === message.roomId) {
            const isCurrentRoom = room.roomId === selectedRoomIdRef.current;
            return {
              ...room,
              lastMessage: {
                content: message.content,
                senderId: message.senderId,
                senderName: message.senderName,
                timestamp: message.timestamp,
                type: message.type,
              },
              updatedAt: message.timestamp,
              unreadCount: isCurrentRoom
                ? 0
                : message.senderId !== user?.id &&
                    message.senderId !== user?.userId
                  ? (room.unreadCount || 0) + 1
                  : room.unreadCount,
            };
          }
          return room;
        });

        return updatedRooms.sort((a, b) => {
          const timeA = a.lastMessage?.timestamp
            ? new Date(a.lastMessage.timestamp).getTime()
            : 0;
          const timeB = b.lastMessage?.timestamp
            ? new Date(b.lastMessage.timestamp).getTime()
            : 0;
          return timeB - timeA;
        });
      });
    });

    return unsubscribe;
  }, [isConnected, onChatMessage, user?.id, user?.userId]);

  // Chat room operations
  const refreshChatRooms = useCallback(() => {
    if (isConnected) {
      setIsLoading(true);
      fetchChatRooms(user?.id || user?.userId);
    }
  }, [isConnected, fetchChatRooms, user?.id, user?.userId]);

  // Sync unread counts when the backend pushes a global update.
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = onUnreadMessagesUpdate(() => {
      if (!mountedRef.current) return;
      refreshChatRooms();
    });

    return unsubscribe;
  }, [isConnected, onUnreadMessagesUpdate, refreshChatRooms]);

  const searchChatRooms = useCallback(
    (searchTerm: string): RealtimeChatRoom[] => {
      searchTermRef.current = searchTerm.toLowerCase();

      if (!searchTerm.trim()) {
        return chatRooms;
      }

      return chatRooms.filter(
        (room) =>
          room.displayName.toLowerCase().includes(searchTermRef.current) ||
          room.participants.some((p) =>
            `${p.firstName || ""} ${p.lastName || ""}`
              .toLowerCase()
              .includes(searchTermRef.current)
          )
      );
    },
    [chatRooms]
  );

  const getFilteredChatRooms = useCallback(
    (type?: string): RealtimeChatRoom[] => {
      if (!type || type === "all") {
        return chatRooms;
      }

      if (type === "classes") {
        return chatRooms.filter(
          (room) => room.type === "class" || room.type === "class_group"
        );
      }

      if (type === "groups") {
        return chatRooms.filter((room) => room.type === "group");
      }

      return chatRooms;
    },
    [chatRooms]
  );

  // Room selection
  const selectRoom = useCallback(
    (roomId: string) => {
      if (selectedRoomId === roomId) return;

      if (selectedRoomId) {
        leaveChatRoom(selectedRoomId);
      }

      setSelectedRoomId(roomId);
      joinChatRoom(roomId);

      // Zero unread count for the room being opened
      setChatRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.roomId === roomId ? { ...room, unreadCount: 0 } : room
        )
      );
    },
    [selectedRoomId, joinChatRoom, leaveChatRoom]
  );

  const unselectRoom = useCallback(() => {
    if (selectedRoomId) {
      leaveChatRoom(selectedRoomId);
      setSelectedRoomId(null);
    }
  }, [selectedRoomId, leaveChatRoom]);

  // Message operations
  const sendMessage = useCallback(
    (content: string, type: "text" | "voice" = "text", duration?: number) => {
      if (!selectedRoomId) {
        return;
      }

      if (!user?.id && !user?.userId) {
        return;
      }

      const userName =
        `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student";

      const messageData = {
        content,
        roomId: selectedRoomId,
        senderName: userName,
        type,
        ...(duration && { duration }),
      };

      sendChatMessage(messageData);
    },
    [selectedRoomId, user, sendChatMessage]
  );

  const markAsRead = useCallback(
    (messageId: string) => {
      markMessageAsRead(messageId);
    },
    [markMessageAsRead]
  );

  const onNewMessage = useCallback(
    (callback: (message: ChatMessage) => void) => {
      return onChatMessage(callback);
    },
    [onChatMessage]
  );

  const onRoomUpdate = useCallback(
    (_callback: (roomId: string, room: RealtimeChatRoom) => void) => {
      return () => {};
    },
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (selectedRoomId) {
        leaveChatRoom(selectedRoomId);
      }
    };
  }, [selectedRoomId, leaveChatRoom]);

  return {
    chatRooms,
    isLoading,
    isConnected,
    error,
    refreshChatRooms,
    searchChatRooms,
    getFilteredChatRooms,
    selectedRoomId,
    selectRoom,
    unselectRoom,
    sendMessage,
    markAsRead,
    onNewMessage,
    onRoomUpdate,
  };
};

// Utility function to generate consistent colors from strings
function generateColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}
