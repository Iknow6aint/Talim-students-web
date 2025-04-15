"use client";
import Layout from "@/components/Layout";
import AcademicInformation from "@/components/profile/AcademicInformation";
import ParentDetails from "@/components/profile/ParentDetails";
import StudentDetails from "@/components/profile/StudentDetails";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { BookOpenText, ChevronLeft, UserRound, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const tabs = [
  { label: "Personal Information", icon: <UserRound /> },
  { label: "Parent/Guardian Information", icon: <UsersRound /> },
  { label: "Academic Information", icon: <BookOpenText /> },
];

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState("Personal Information");
  const router = useRouter();
   const { user } = useAuthContext()
  
    // Generate initials from first and last names
    const getInitials = () => {
      if (!user) return "US"; // Default if no user
      
      const firstNameInitial = user.firstName?.[0]?.toUpperCase() || '';
      const lastNameInitial = user.lastName?.[0]?.toUpperCase() || '';
      
      // Handle cases where only one name exists
      return `${firstNameInitial}${lastNameInitial}` || "US";
    };
  return (
    <Layout>
      <div className="flex h-full flex-col p-4 gap-6">
        <div>
          <Button
            className="bg-transparent shadow-none hover:bg-gray-200"
            onClick={() => router.back()}
          >
            <ChevronLeft className="text-[#6F6F6F]" strokeWidth={1.5} />
          </Button>
        </div>
        <div className="flex gap-4 bg-white py-10  sm:p-10 rounded-3xl justify-center sm:justify-start items-center">
          <Avatar className="w-[100px] sm:w-[150px] h-[100px] sm:h-[150px]">
            <AvatarImage src="/placeholder.svg" alt="User avatar" />
            <AvatarFallback className="bg-green-300">{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-3">
            <p>My Profile</p>
            <Button className="border border-[#003366] text-[#003366] bg-[#F3F3F3] shadow-none hover:bg-gray-200">
              Upload Photo
            </Button>
          </div>
        </div>
        <div className="bg-white h-full p-4 flex flex-col gap-4 rounded-3xl">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <Button
                key={tab.label}
                onClick={() => setSelectedTab(tab.label)}
                className={`rounded-lg border border-[#F0F0F0] text-[#686868] hover:bg-gray-200 shadow-none items-center  ${
                  selectedTab === tab.label
                    ? "bg-[#F0F0F0] border-[#ADBECE]"
                    : "bg-white"
                }`}
              >
                {tab.icon}
                {tab.label}
              </Button>
            ))}
          </div>
          {selectedTab === "Personal Information" && <StudentDetails />}
          {selectedTab === "Parent/Guardian Information" && <ParentDetails />}
          {selectedTab === "Academic Information" && <AcademicInformation />}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
