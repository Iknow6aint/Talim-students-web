// components/AcademicInformation.tsx
"use client";

import React from "react";
import { useAcademicDetails } from "@/hooks/useAcademicDetails";
// import { Skeleton } from '@/components/ui/skeleton';

const AcademicInformation = () => {
  const { academicData, loading, error } = useAcademicDetails();

  if (loading) {
    return (
      <div className="w-full mx-auto bg-white shadow-sm rounded-lg border">
        <div className="p-3 bg-[#F9F9F9] text-[#454545] animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-36"></div>
        </div>
        <div className="p-4 space-y-4">
          {[
            { labelWidth: "w-16", valueWidth: "w-32" },
            { labelWidth: "w-24", valueWidth: "w-20" },
            { labelWidth: "w-20", valueWidth: "w-8" },
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
        <p className="p-3 bg-[#F9F9F9] text-[#454545]">Academic Information</p>
        <div className="p-4 text-red-500">{error}</div>
      </div>
    );
  }

  if (!academicData) {
    return (
      <div className="w-full mx-auto bg-white shadow-sm rounded-lg border">
        <p className="p-3 bg-[#F9F9F9] text-[#454545]">Academic Information</p>
        <div className="p-4 text-gray-500">No academic data available</div>
      </div>
    );
  }

  const academicInformation = [
    { label: "Class:", value: academicData.classDetails.name },
    { label: "Grade Level:", value: academicData.gradeLevel },
    { label: "Subjects:", value: "12" }, // Update this if you have actual subjects data
  ];

  return (
    <div className="w-full mx-auto bg-white shadow-sm rounded-lg border">
      <p className="p-3 bg-[#F9F9F9] text-[#454545]">Academic Information</p>
      <table className="w-full table-fixed sm:table-auto text-sm">
        <tbody>
          {academicInformation.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 px-3 text-[#909090] whitespace-nowrap">
                {item.label}
              </td>
              <td className="py-2 px-30 sm:pr-28 font-medium">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AcademicInformation;
