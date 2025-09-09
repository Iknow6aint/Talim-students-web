// components/StudentDetails.tsx
"use client";

import React from "react";
import { useStudentDetails } from "@/hooks/useStudentDetails";
// import { Skeleton } from '@/components/ui/skeleton'; // Assuming you have ShadCN UI

const StudentDetails = () => {
  const { studentDetails, loading, error } = useStudentDetails();

  if (loading) {
    return (
      <div className="w-full mx-auto bg-white shadow-sm rounded-lg border">
        <div className="p-3 bg-[#F9F9F9] text-[#454545] animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="p-4 space-y-4">
          {[
            { labelWidth: "w-20", valueWidth: "w-28" },
            { labelWidth: "w-24", valueWidth: "w-32" },
            { labelWidth: "w-28", valueWidth: "w-40" },
            { labelWidth: "w-32", valueWidth: "w-36" },
            { labelWidth: "w-26", valueWidth: "w-20" },
            { labelWidth: "w-28", valueWidth: "w-16" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-t pt-3 animate-pulse"
            >
              <div
                className={`h-4 bg-gray-200 rounded ${item.labelWidth}`}
              ></div>
              <div
                className={`h-4 bg-gray-100 rounded ${item.valueWidth}`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto bg-white shadow-sm rounded-lg border">
        <p className="p-3 bg-[#F9F9F9] text-[#454545]">Student details</p>
        <div className="p-4 text-red-500">{error}</div>
      </div>
    );
  }

  if (!studentDetails) {
    return (
      <div className="w-full mx-auto bg-white shadow-sm rounded-lg border">
        <p className="p-3 bg-[#F9F9F9] text-[#454545]">Student details</p>
        <div className="p-4 text-gray-500">No student data available</div>
      </div>
    );
  }

  const details = [
    { label: "First Name:", value: studentDetails.firstName || "N/A" },
    { label: "Last Name:", value: studentDetails.lastName || "N/A" },
    { label: "Phone Number:", value: studentDetails.phoneNumber || "N/A" },
    { label: "Email Address:", value: studentDetails.email || "N/A" },
    {
      label: "Account Status:",
      value: studentDetails.isActive ? "Active" : "Inactive",
    },
    {
      label: "Email Verified:",
      value: studentDetails.isEmailVerified ? "Yes" : "No",
    },
  ];

  return (
    <div className="w-full mx-auto bg-white shadow-sm rounded-lg border">
      <p className="p-3 bg-[#F9F9F9] text-[#454545]">Student details</p>
      <table className="w-full table-fixed sm:table-auto text-sm">
        <tbody className="w-full">
          {details.map((item, index) => (
            <tr key={index} className="border-t w-full">
              <td className="py-2 px-3 text-[#909090] whitespace-nowrap">
                {item.label}
              </td>
              <td className="py-2 px-30 sm:px-28 font-medium break-words">
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentDetails;
