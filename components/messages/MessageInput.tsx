import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, SendHorizontal, FileText, Image, FileVideo } from "lucide-react";

export default function MessageInput() {
  const [message, setMessage] = useState("");

  return (
    <div className="w-auto overflow-hidden p-2 sm:p-3 flex flex-col sm:mx-4 sm:mb-4 bg-white rounded-lg flex items-center gap-3">
      <Input
        placeholder="Type something here..."
        className="flex-1 border-none shadow-none focus:outline-none focus-visible:ring-0 mb-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="flex w-full items-center justify-between  text-gray-500">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="text-xs sm:text-md border border-[#F0F0F0] "
          >
            <p className="hidden sm:block">Document</p>
            <FileText />
          </Button>
          <Button
            variant="ghost"
            className=" text-xs sm:text-md border border-[#F0F0F0] "
          >
            <p className="hidden sm:block">Image</p>
            <Image />
          </Button>
          <Button
            variant="ghost"
            className=" text-xs sm:text-md border border-[#F0F0F0] "
          >
            <p className="hidden sm:block">Video</p>
            <FileVideo />
          </Button>
        </div>
        <Button
          className={`border  shadow-none rounded-lg ${
            message.trim() ? "bg-[#003366] hover:bg-[#002244]" : "bg-[#C7C7C7]"
          }`}
        >
          {message.trim() ? (
            <SendHorizontal color="white" size={30} />
          ) : (
            <Mic color="white" size={30} />
          )}
        </Button>
      </div>
    </div>
  );
}
