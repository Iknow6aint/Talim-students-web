"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import GroupMessageBubble from "./GroupMessageBubble";
import ReplyPreview from "./ReplyPreview";
import { useRoomMessages } from "@/hooks/useRoomMessages";
import { useAuthContext } from "@/contexts/AuthContext";
import { RealtimeChatRoom } from "@/hooks/useChat";
import { Loader2, MessageCircle } from "lucide-react";
import { generateColorFromString } from "@/lib/colorUtils";

interface GroupChatProps {
    replyingMessage: { sender: string; text: string } | null;
    setReplyingMessage: (msg: any) => void;
    openSubMenu: { index: number; type: string } | null;
    toggleSubMenu: (index: number, type: string) => void;
    onBack: () => void;
    room?: RealtimeChatRoom;
}

const GroupChat = ({
    replyingMessage,
    setReplyingMessage,
    openSubMenu,
    toggleSubMenu,
    onBack,
    room,
}: GroupChatProps) => {
    const { user } = useAuthContext();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [isSending, setIsSending] = useState(false);

    const {
        messages,
        isLoading,
        isLoadingMore,
        hasMore,
        roomInfo,
        error,
        sendMessage,
        loadMoreMessages,
    } = useRoomMessages(room?.roomId || null);

    // Helper to get current user ID
    const getCurrentUserId = (): string | undefined => {
        if (!user) {
            console.log('⚠️ No user object available yet (still loading)');
            return undefined;
        }

        // For students app, prioritize user.id over user.userId
        const possibleIds = [
            user.userId,
            user.userId,
            (user as any)._id, // fallback for different user object structures
        ].filter(Boolean);

        console.log('🔍 Getting current user ID:', {
            user,
            possibleIds,
            selectedId: possibleIds[0],
        });

        return possibleIds.length > 0 ? possibleIds[0] : undefined;
    };

    // Helper to get color based on sender
    const getColorForUser = (senderId: string, senderName: string = ''): string => {
        const nameForColor = senderName || senderId || 'unknown';
        return generateColorFromString(nameForColor);
    };

    // Helper to resolve sender information from backend data
    const resolveSenderInfo = (message: any) => {
        let senderId = '';
        let senderName = '';

        console.log('🔍 Raw message data for sender resolution:', {
            message,
            senderId: message.senderId,
            senderName: message.senderName,
            messageKeys: Object.keys(message)
        });

        // Handle senderId being an object (populated) vs string
        if (message.senderId && typeof message.senderId === 'object') {
            senderId = message.senderId._id || message.senderId.userId || '';
            senderName = `${message.senderId.firstName || ''} ${message.senderId.lastName || ''}`.trim();
            console.log('📋 Sender is object:', { senderId, senderName, senderObject: message.senderId });
        } else if (typeof message.senderId === 'string') {
            senderId = message.senderId;

            // Try multiple fields for sender name
            senderName = message.senderName ||
                message.sender ||
                (message as any).name ||
                '';

            console.log('📋 Sender is string:', {
                senderId, senderName, availableFields: {
                    senderName: message.senderName,
                    sender: message.sender,
                    name: (message as any).name
                }
            });
        }

        // If this is the current user and we don't have a proper sender name, use the current user's info
        const currentUserId = getCurrentUserId();
        if (senderId === currentUserId && (!senderName || senderName === 'Unknown') && user) {
            senderName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'You';
            console.log('🔄 Using current user info for sender name:', senderName);
        }

        // For other users, try to resolve from room participants if no name found
        if (!senderName || senderName.trim() === '') {
            if (room?.participants) {
                const participant = room.participants.find((p: any) => {
                    const participantId = p.userId || p._id || (p as any).id;
                    return participantId === senderId;
                });

                if (participant) {
                    senderName = `${participant.firstName || ''} ${participant.lastName || ''}`.trim() ||
                        (participant as any).name ||
                        (participant as any).email ||
                        'Unknown User';
                    console.log('🔄 Resolved sender from participants:', { participant, senderName });
                }
            }
        }

        // Final fallback to 'Unknown' if still no name
        if (!senderName || senderName.trim() === '') {
            senderName = 'Unknown';
            console.log('⚠️ Using fallback "Unknown" for sender');
        }

        console.log('✅ Final resolved sender:', { senderId, senderName });
        return { senderId, senderName };
    };

    // Helper to determine if a message is from the current user
    const isCurrentUser = (senderId: string, senderName: string): boolean => {
        const currentUserId = getCurrentUserId();

        // If we don't have a current user ID yet, we can't determine ownership
        if (!currentUserId) {
            console.log('⚠️ Cannot determine message ownership - user not loaded yet');
            return false;
        }

        console.log('🔍 isCurrentUser check:', {
            senderId,
            senderName,
            currentUserId,
            user: user ? {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                id: user.userId,
                userId: user.userId
            } : null
        });

        // First try: direct ID match
        if (currentUserId && senderId && senderId === currentUserId) {
            console.log('✅ Matched by ID:', { senderId, currentUserId });
            return true;
        }

        // Second try: match by name if user object is available
        if (user && user.firstName && user.lastName && senderName) {
            const currentUserName = `${user.firstName} ${user.lastName}`.trim();
            console.log('🔍 Trying name match:', { currentUserName, senderName });

            if (currentUserName === senderName || currentUserName.toLowerCase() === senderName.toLowerCase().trim()) {
                console.log('✅ Matched by name:', { currentUserName, senderName });
                return true;
            }
        }

        console.log('❌ No match found:', {
            senderId,
            currentUserId,
            senderName,
            userFirstName: user?.firstName,
        });
        return false;
    };

    // Transform backend messages to UI format (matching Teachers app)
    const transformMessageForUI = (message: any, index: number) => {
        // Resolve sender info from backend structure
        const { senderId, senderName } = resolveSenderInfo(message);
        const isUserMessage = isCurrentUser(senderId, senderName);

        // Handle both 'text' and 'content' fields from backend (socket logs show 'text' field)
        const messageText = message.text || message.content || '';

        // Handle both 'createdAt' and 'timestamp' fields (socket logs show 'createdAt')
        const messageTime = (message as any).createdAt || message.timestamp || new Date();

        console.log('🔄 Transforming message:', {
            messageId: message._id,
            originalSenderId: message.senderId,
            resolvedSender: { senderId, senderName },
            isUserMessage,
            messageText,
            messageTime,
            currentUser: user ? {
                id: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim()
            } : null
        });

        return {
            _id: message._id,
            sender: senderName,
            senderType: isUserMessage ? 'self' : 'other',
            text: messageText,
            time: new Date(messageTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            }),
            type: message.type || 'text',
            avatar: "", // Let GroupMessageBubble handle avatar fallback
            color: getColorForUser(senderId, senderName),
            duration: message.duration,
            // Keep original data for debugging
            originalSenderId: senderId,
            originalSenderName: senderName,
            timestamp: messageTime
        };
    };

    // Auto-scroll to bottom when new messages arrive and reset sending state on new message
    useEffect(() => {
        console.log('📨 Messages array updated:', {
            messageCount: messages.length,
            lastMessage: messages[messages.length - 1],
            messages: messages.map(m => ({
                _id: m._id,
                senderName: (m as any).senderName,
                senderId: (m as any).senderId,
                text: (m as any).text,
                content: m.content,
                createdAt: (m as any).createdAt,
                timestamp: m.timestamp
            }))
        });

        // If a new message arrives and we were sending, reset the sending state
        if (messages.length > 0 && isSending) {
            const lastMessage = messages[messages.length - 1];
            const currentUserId = getCurrentUserId();

            // Check if the last message is from the current user
            if (lastMessage && currentUserId) {
                const { senderId } = resolveSenderInfo(lastMessage);
                if (senderId === currentUserId) {
                    console.log('✅ Our message appeared, resetting sending state');
                    setIsSending(false);
                }
            }
        }

        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isSending, getCurrentUserId]);

    // Handle sending a new message
    const handleSendMessage = useCallback((content: string) => {
        if (!content.trim() || !room || isSending) {
            console.log('❌ Cannot send message:', {
                hasInput: !!content.trim(),
                hasRoom: !!room,
                isSending,
            });
            return;
        }

        console.log('📨 Sending message from student:', content.trim());
        setIsSending(true);

        try {
            sendMessage(content.trim(), 'text');
            // Keep sending state for a short time to show feedback, then reset
            setTimeout(() => {
                setIsSending(false);
            }, 500);
        } catch (error) {
            console.error('Error sending message:', error);
            setIsSending(false);
        }
    }, [room, isSending, sendMessage]);

    // Scroll handling for loading more messages
    const handleScroll = useCallback(() => {
        if (!messagesContainerRef.current || isLoadingMore || !hasMore) return;

        const { scrollTop } = messagesContainerRef.current;
        if (scrollTop === 0) {
            loadMoreMessages();
        }
    }, [isLoadingMore, hasMore, loadMoreMessages]);

    const roomName = room?.displayName || 'Chat Room';

    if (!room) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                    <p>No room selected</p>
                    <p className="text-sm">Select a chat to start messaging</p>
                </div>
            </div>
        );
    }

    // Group messages by date for proper history tracking
    const groupMessagesByDate = () => {
        const grouped: { [key: string]: any[] } = {};

        messages.forEach(message => {
            // Handle both 'createdAt' and 'timestamp' fields from backend
            const messageDate = (message as any).createdAt || message.timestamp || new Date();
            const date = new Date(messageDate).toDateString();

            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(message);
        });

        // Sort dates chronologically (oldest first)
        const sortedDates = Object.keys(grouped).sort((a, b) =>
            new Date(a).getTime() - new Date(b).getTime()
        );

        // Return sorted object
        const sortedGrouped: { [key: string]: any[] } = {};
        sortedDates.forEach(date => {
            // Sort messages within each date by timestamp (oldest first)
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
        const messageDate = new Date(date);

        if (messageDate.toDateString() === today.toDateString()) {
            return 'Today';
        }

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (messageDate.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }

        return messageDate.toLocaleDateString();
    };

    return (
        <div className="w-full h-full flex flex-col bg-white">
            {/* Custom styles for hiding scrollbar */}
            <style jsx>{`
        .messages-container {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* Internet Explorer 10+ */
        }
        .messages-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>

            {/* Chat Header */}
            <ChatHeader
                avatar={room.avatarInfo.type === 'image' ? room.avatarInfo.value : '/icons/chat.svg'}
                name={roomName}
                participants={room?.participants || []}
                currentUserId={user?.id || user?.userId}
                onBack={onBack}
            />

            {/* Messages Area */}
            <div
                className="flex-1 overflow-y-auto p-4 bg-gray-50 messages-container"
                ref={messagesContainerRef}
                onScroll={handleScroll}
            >
                {/* Loading indicator for more messages */}
                {isLoadingMore && (
                    <div className="flex justify-center py-4">
                        <div className="flex items-center space-x-2 text-gray-500">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Loading more messages...</span>
                        </div>
                    </div>
                )}

                {/* Main loading state */}
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
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
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
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                            <p className="text-gray-500">Send a message to start the conversation</p>
                        </div>
                    </div>
                ) : (
                    /* Messages grouped by date */
                    <div className="space-y-6">
                        {Object.entries(groupMessagesByDate()).map(([date, dayMessages]) => (
                            <div key={date} className="space-y-3">
                                {/* Date separator */}
                                <div className="flex justify-center">
                                    <div className="px-3 py-1 bg-white rounded-full shadow-sm border border-gray-200">
                                        <span className="text-xs font-medium text-gray-600">
                                            {formatDate(new Date(date))}
                                        </span>
                                    </div>
                                </div>

                                {/* Messages for this date */}
                                <div className="space-y-2">
                                    {dayMessages.map((message, index) => {
                                        const transformedMessage = transformMessageForUI(message, index);
                                        return (
                                            <GroupMessageBubble
                                                key={message._id || index}
                                                msg={transformedMessage}
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

                {/* Invisible element to scroll to */}
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
                isSending={isSending}
            />
        </div>
    );
};

export default GroupChat;
