"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocketContextSafe } from '@/contexts/WebSocketContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { ChatMessage, ChatRoomJoinedData, FetchMessagesData } from './useWebSocket';

interface UseRoomMessagesReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  roomInfo: {
    roomId: string;
    roomName: string;
    roomType: string;
    participants: any[];
    totalParticipants: number;
  } | null;
  error: string | null;
  
  // Message operations
  sendMessage: (content: string, type?: 'text' | 'voice', duration?: number) => void;
  loadMoreMessages: () => void;
  markAsRead: (messageId: string) => void;
  
  // Real-time events
  onNewMessage: (callback: (message: ChatMessage) => void) => () => void;
}

export const useRoomMessages = (roomId: string | null): UseRoomMessagesReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  
  const { user } = useAuthContext();
  const mountedRef = useRef(true);
  
  // Called unconditionally — returns null when used outside a WebSocketProvider.
  const webSocketContext = useWebSocketContextSafe();
  const {
    isConnected,
    sendChatMessage,
    markMessageAsRead,
    fetchMessages,
    onChatRoomJoined,
    onChatMessage,
    onMessagesUpdate,
  } = (webSocketContext ?? {
    isConnected: false,
    sendChatMessage: () => {},
    markMessageAsRead: () => {},
    fetchMessages: () => {},
    onChatRoomJoined: (_cb: any) => () => {},
    onChatMessage: (_cb: any) => () => {},
    onMessagesUpdate: (_cb: any) => () => {},
  });

  // Reset state when room changes
  useEffect(() => {
    if (roomId) {
      setMessages([]);
      setIsLoading(true);
      setIsLoadingMore(false);
      setHasMore(true);
      setRoomInfo(null);
      setError(null);
      setNextCursor(undefined);
    }
  }, [roomId]);

  // Handle room joined event (initial data)
  useEffect(() => {
    if (!isConnected || !roomId) return;

    const unsubscribe = onChatRoomJoined((data: ChatRoomJoinedData) => {
      if (!mountedRef.current || data.roomId !== roomId) return;

      setRoomInfo({
        roomId: data.roomId,
        roomName: data.roomName,
        roomType: data.roomType,
        participants: data.participants,
        totalParticipants: data.totalParticipants,
      });

      setMessages(data.messages || []);
      setHasMore(data.hasMore || false);
      setNextCursor(data.nextCursor);
      setIsLoading(false);
      setError(null);

      // Bulk-mark all initial messages from others as read
      const currentUserId = user?.id || user?.userId;
      (data.messages || []).forEach((msg) => {
        if (msg.senderId !== currentUserId && msg._id) {
          markMessageAsRead(msg._id);
        }
      });
    });

    return unsubscribe;
  }, [isConnected, roomId, onChatRoomJoined, user, markMessageAsRead]);

  // Handle messages update (pagination)
  useEffect(() => {
    if (!isConnected || !roomId) return;

    const unsubscribe = onMessagesUpdate((data: FetchMessagesData) => {
      if (!mountedRef.current || data.roomId !== roomId) return;

      if (data.direction === 'before') {
        // Loading older messages
        setMessages(prev => [...data.messages, ...prev]);
      } else {
        // Loading newer messages
        setMessages(prev => [...prev, ...data.messages]);
      }
      
      setHasMore(data.hasMore || false);
      setNextCursor(data.nextCursor);
      setIsLoadingMore(false);
    });

    return unsubscribe;
  }, [isConnected, roomId, onMessagesUpdate]);

  // Handle real-time new messages
  useEffect(() => {
    if (!isConnected || !roomId) return;

    const unsubscribe = onChatMessage((message: ChatMessage) => {
      // Handle both roomId and chatRoomId from backend
      const messageRoomId = message.roomId || (message as any).chatRoomId;
      if (!mountedRef.current || messageRoomId !== roomId) return;

      const currentUserId = user?.id || user?.userId;
      if (message.senderId !== currentUserId && message._id) {
        markMessageAsRead(message._id);
      }

      // Add new message to the end
      setMessages(prev => {
        const exists = prev.some(m => m._id === message._id);
        if (exists) return prev;
        return [...prev, message];
      });
    });

    return unsubscribe;
  }, [isConnected, roomId, onChatMessage, user, markMessageAsRead]);

  // Message operations
  const sendMessage = useCallback((
    content: string, 
    type: 'text' | 'voice' = 'text', 
    duration?: number
  ) => {
    if (!roomId || !isConnected) {
      console.error('Cannot send message: no room selected or not connected');
      return;
    }
    
    if (!user?.id && !user?.userId) {
      console.error('Cannot send message: no user information');
      return;
    }
    
    const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Student';
    
    const messageData = {
      content,
      roomId,
      senderName: userName,
      type,
      ...(duration && { duration }),
    };
    
    sendChatMessage(messageData);
  }, [roomId, isConnected, user, sendChatMessage]);

  const loadMoreMessages = useCallback(() => {
    if (!roomId || !isConnected || !hasMore || isLoadingMore || !nextCursor) {
      return;
    }
    
    setIsLoadingMore(true);
    
    fetchMessages({
      roomId,
      cursor: nextCursor,
      direction: 'before',
      limit: 20,
    });
  }, [roomId, isConnected, hasMore, isLoadingMore, nextCursor, fetchMessages]);

  const markAsRead = useCallback((messageId: string) => {
    markMessageAsRead(messageId);
  }, [markMessageAsRead]);

  // Event handlers for external use
  const onNewMessage = useCallback((callback: (message: ChatMessage) => void) => {
    return onChatMessage((message: ChatMessage) => {
      if (message.roomId === roomId) {
        callback(message);
      }
    });
  }, [roomId, onChatMessage]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    messages,
    isLoading,
    isLoadingMore,
    hasMore,
    roomInfo,
    error,
    sendMessage,
    loadMoreMessages,
    markAsRead,
    onNewMessage,
  };
};
