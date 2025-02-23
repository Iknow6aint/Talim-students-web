import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import MessageBubble from "./PrivateMessageBubble";
import { Phone, Search, Video } from "lucide-react";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";

const messages = [
  { sender: "other", text: "Hi everyone!", time: "3:10pm", type: "text" },
  { sender: "me", text: "Got it!", time: "3:12pm", type: "text" },
  {
    sender: "other",
    text: "/audio/sample-voice-note.mp3",
    time: "3:12pm",
    type: "voice",
  },
  {
    sender: "me",
    text: "/audio/sample-voice-note.mp3",
    time: "3:12pm",
    type: "voice",
  },
];

export default function PrivateChat() {
  return (
    <div className="w-2/3 flex flex-col">
      <div className="flex items-center rounded-tr-lg p-4 border-b bg-white">
        <ChatHeader
          avatar="/image/teachers/english.png"
          name="Mrs. Yetunde Adebayo"
          status="typing..."
        />
        {/* Additional action icons can be added here if needed */}
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
        <div className="text-center px-4 py-2 bg-white rounded-md w-fit mx-auto text-xs text-[#030E18] my-4">
          Today
        </div>
        {messages.map((msg, index) => (
          <MessageBubble key={index} msg={msg} />
        ))}
      </div>
      <MessageInput />
    </div>
  );
}
