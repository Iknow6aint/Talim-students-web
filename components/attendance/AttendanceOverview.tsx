import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { AttendanceKPIData } from "@/services/attendance.service";
import { format } from "date-fns";

interface AttendanceOverviewProps {
  data: AttendanceKPIData;
}

export function AttendanceOverview({ data }: AttendanceOverviewProps) {
  const getInitials = () => {
    const firstInitial = data.firstName?.[0]?.toUpperCase() || "";
    const lastInitial = data.lastName?.[0]?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}` || "ST";
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const getAttendanceBadge = (rate: number) => {
    if (rate >= 90)
      return { label: "Excellent", color: "bg-green-100 text-green-800" };
    if (rate >= 75)
      return { label: "Good", color: "bg-yellow-100 text-yellow-800" };
    if (rate >= 60)
      return { label: "Fair", color: "bg-orange-100 text-orange-800" };
    return { label: "Needs Improvement", color: "bg-red-100 text-red-800" };
  };

  const badge = getAttendanceBadge(data.attendanceRate);

  return (
    <Card className="p-6 border border-[#F0F0F0] shadow-none">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Student Info */}
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
            <AvatarImage
              src={data.userAvatar}
              alt={`${data.firstName} ${data.lastName}`}
            />
            <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-medium text-[#030E18]">
              {data.firstName} {data.lastName}
            </h2>
            <p className="text-[#6F6F6F]">{data.classInfo.name}</p>
            <p className="text-sm text-[#6F6F6F]">{data.email}</p>
          </div>
        </div>

        {/* Attendance Rate Highlight */}
        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-medium text-[#030E18]">
                {data.attendanceRate.toFixed(1)}%
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}
              >
                {badge.label}
              </span>
            </div>
            <p className="text-sm text-[#6F6F6F] mt-1">
              Overall Attendance Rate
            </p>
          </div>

          {/* Term & Date Range */}
          <div className="text-right">
            <h3 className="font-semibold text-[#030E18]">
              {data.termInfo?.name || data.classInfo.name}
            </h3>
            <p className="text-sm text-[#6F6F6F]">
              {formatDate(data.dateRange.startDate)} -{" "}
              {formatDate(data.dateRange.endDate)}
            </p>
            <p className="text-xs text-[#6F6F6F] mt-1">
              {data.totalDays} total days
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
