import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, SendHorizontal, FileText, Image, FileVideo, Loader2 } from "lucide-react";

interface MessageInputProps {
  onSendMessage?: (content: string) => void;
  replyingMessage?: { sender: string; text: string } | null;
  disabled?: boolean;
  isSending?: boolean;
}

export default function MessageInput({ 
  onSendMessage, 
  replyingMessage, 
  disabled = false,
  isSending = false
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() && onSendMessage && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-100">
      <div className="flex items-end space-x-3">
        {/* Attachment Button */}
        <button 
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          disabled={disabled}
        >
          <FileText className="w-5 h-5" />
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <Input
            placeholder={disabled ? "Connecting..." : "Type a message..."}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
          />
        </div>

        {/* Send Button */}
        <button
          className={`p-2 rounded-full transition-all duration-200 ${
            message.trim() && !disabled && !isSending

            ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-100 text-gray-400"
          }`}
          onClick={handleSendMessage}
          disabled={disabled || !message.trim() || isSending}
        >
          {isSending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : message.trim() ? (
            <SendHorizontal className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
