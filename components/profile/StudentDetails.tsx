// components/StudentDetails.tsx
'use client';

import React from 'react';
import { useStudentDetails } from '@/hooks/useStudentDetails';
// import { Skeleton } from '@/components/ui/skeleton'; // Assuming you have ShadCN UI

const StudentDetails = () => {
  const { studentDetails, loading, error } = useStudentDetails();

  if (loading) {
    return (
      <div className="w-full mx-auto bg-white shadow-sm rounded-lg border">
        <p className="p-3 bg-[#F9F9F9] text-[#454545]">Student details</p>
        <div className="p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex justify-between border-t pt-3">
              <p>loading...</p>
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
    { label: "First Name:", value: studentDetails.firstName || 'N/A' },
    { label: "Last Name:", value: studentDetails.lastName || 'N/A' },
    { label: "Phone Number:", value: studentDetails.phoneNumber || 'N/A' },
    { label: "Email Address:", value: studentDetails.email || 'N/A' },
    { label: "Account Status:", value: studentDetails.isActive ? 'Active' : 'Inactive' },
    { label: "Email Verified:", value: studentDetails.isEmailVerified ? 'Yes' : 'No' },
  ];

  return (
    <div className="w-full mx-auto bg-white shadow-sm rounded-lg border">
      <p className="p-3 bg-[#F9F9F9] text-[#454545]">Student details</p>
      <table className="w-full table-fixed sm:table-auto text-sm">
        <tbody className="w-full">
          {details.map((item, index) => (
            <tr key={index} className="border-t w-full">
              <td className="py-2 px-3 text-[#909090] whitespace-nowrap">{item.label}</td>
              <td className="py-2 px-30 sm:px-28 font-medium break-words">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentDetails;