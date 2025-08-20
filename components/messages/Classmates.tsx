import { Search, X } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { generateColorFromString, getUserInitials } from "@/lib/colorUtils";

interface ClassmatesProps {
    participants?: any[];
}

const Classmates = ({ participants = [] }: ClassmatesProps) => {
    // Use participants data or fallback to empty array
    const members = participants.length > 0 ? participants.map(p => ({
        name: `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.name || 'Unknown User',
        avatar: p.avatar || '',
        role: p.role || 'Student',
        id: p.id
    })) : [];
    return (
        <div className="mt-2">
            <div className="relative flex items-center border px-2 py-1 rounded-lg ">
                <Search strokeWidth="1px" size={20} />
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-transparent p-2 text-sm focus:outline-none"
                />
                <X className="text-gray-500 cursor-pointer ml-2" size={16} />
            </div>
            <div className="flex flex-col overflow-y-auto max-h-[320px] scrollbar-hide">
                {members.map((mem, index) => (
                    <div key={mem.id || index} className="flex items-start gap-3 p-3 rounded cursor-pointer hover:bg-gray-200">
                        <Avatar className="w-10 h-10 rounded-full">
                            <AvatarImage src={mem.avatar} />
                            <AvatarFallback
                                className="text-white font-medium text-sm"
                                style={{ backgroundColor: generateColorFromString(mem.name) }}
                            >
                                {getUserInitials(mem.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className=" text-[16px]">{mem.name}</p>
                            <p className="text-sm text-[#7B7B7B]">{mem.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Classmates;
