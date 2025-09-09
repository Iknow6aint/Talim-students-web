import React from "react";
import { useAcademicDetails } from "@/hooks/useAcademicDetails";
// import { Skeleton } from "@/components/ui/skeleton";

const ParentDetails = () => {
  const { academicData, loading, error } = useAcademicDetails();

  if (loading) {
    return (
      <div className="w-full mx-auto bg-white shadow-sm rounded-lg border">
        <div className="p-3 bg-[#F9F9F9] text-[#454545] animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-44"></div>
        </div>
        <div className="p-4 space-y-4">
          {[
            { labelWidth: "w-20", valueWidth: "w-24" },
            { labelWidth: "w-24", valueWidth: "w-28" },
            { labelWidth: "w-28", valueWidth: "w-40" },
            { labelWidth: "w-32", valueWidth: "w-44" },
            { labelWidth: "w-24", valueWidth: "w-20" },
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
        <p className="p-3 bg-[#F9F9F9] text-[#454545]">
          Parent/Guardian Information
        </p>
        <div className="p-4 text-red-500">{error}</div>
      </div>
    );
  }

  if (!academicData?.parentContact) {
    return (
      <div className="w-full mx-auto bg-white shadow-sm rounded-lg border">
        <p className="p-3 bg-[#F9F9F9] text-[#454545]">
          Parent/Guardian Information
        </p>
        <div className="p-4 text-gray-500">
          No parent/guardian information available
        </div>
      </div>
    );
  }

  const parentDetails = [
    {
      label: "First Name:",
      value: academicData.parentContact.fullName.split(" ")[0],
    },
    {
      label: "Last Name:",
      value: academicData.parentContact.fullName.split(" ").slice(1).join(" "),
    },
    {
      label: "Phone Number:",
      value: academicData.parentContact.phoneNumber || "N/A",
    },
    {
      label: "Email Address:",
      value: academicData.parentContact.email || "N/A",
    },
    {
      label: "Relationship:",
      value: academicData.parentContact.relationship || "N/A",
    },
  ];

  return (
    <div className="w-full mx-auto bg-white shadow-sm rounded-lg border">
      <p className="p-3 bg-[#F9F9F9] text-[#454545]">
        Parent/Guardian Information
      </p>
      <table className="w-full table-fixed sm:table-auto text-sm">
        <tbody className="w-full">
          {parentDetails.map((item, index) => (
            <tr key={index} className="border-t w-full overflow-x-auto">
              <td className="py-2 px-3 text-[#909090] w-2/3 sm:w-auto whitespace-nowrap">
                {item.label}
              </td>
              <td className="py-2 w-1/3 sm:px-28 sm:w-auto font-medium break-words whitespace-normal">
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParentDetails;
