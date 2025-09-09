import { Card, CardContent } from "@/components/ui/card";
import { AttendanceKPIData } from "@/services/attendance.service";
import { format } from "date-fns";

interface AttendanceInsightsProps {
  data: AttendanceKPIData;
}

export function AttendanceInsights({ data }: AttendanceInsightsProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const getAttendanceGrade = (rate: number) => {
    if (rate >= 95) return { grade: "A+", description: "Excellent attendance" };
    if (rate >= 90) return { grade: "A", description: "Very good attendance" };
    if (rate >= 85) return { grade: "B+", description: "Good attendance" };
    if (rate >= 80)
      return { grade: "B", description: "Satisfactory attendance" };
    if (rate >= 75)
      return { grade: "C+", description: "Below average attendance" };
    if (rate >= 70) return { grade: "C", description: "Poor attendance" };
    return { grade: "F", description: "Very poor attendance" };
  };

  const attendanceGrade = getAttendanceGrade(data.attendanceRate);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {/* Attendance Performance */}
      <Card className="border border-[#F0F0F0] shadow-none">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-[#030E18] mb-4">
            Attendance Performance
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#6F6F6F]">Current Grade:</span>
              <span className="text-2xl font-bold text-[#030E18]">
                {attendanceGrade.grade}
              </span>
            </div>

            <div className="text-sm text-[#6F6F6F]">
              {attendanceGrade.description}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6F6F6F]">Progress</span>
                <span className="text-[#030E18]">
                  {data.attendanceRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${data.attendanceRate}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Term Information */}
      <Card className="border border-[#F0F0F0] shadow-none">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-[#030E18] mb-4">
            Term Information
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#6F6F6F]">Academic Year:</span>
              <span className="text-[#030E18] font-medium">
                {data.termInfo?.name || "Current Term"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#6F6F6F]">Start Date:</span>
              <span className="text-[#030E18]">
                {formatDate(data.dateRange.startDate)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#6F6F6F]">End Date:</span>
              <span className="text-[#030E18]">
                {formatDate(data.dateRange.endDate)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#6F6F6F]">Class:</span>
              <span className="text-[#030E18] font-medium">
                {data.classInfo.name}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Breakdown */}
      <Card className="border border-[#F0F0F0] shadow-none sm:col-span-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-[#030E18] mb-4">
            Attendance Breakdown
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#030E18] mb-1">
                {data.presentDays}
              </div>
              <div className="text-sm text-[#6F6F6F] mb-2">Days Present</div>
              <div className="text-xs text-[#6F6F6F]">
                {((data.presentDays / data.totalDays) * 100).toFixed(1)}% of
                total
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-[#030E18] mb-1">
                {data.absentDays}
              </div>
              <div className="text-sm text-[#6F6F6F] mb-2">Days Absent</div>
              <div className="text-xs text-[#6F6F6F]">
                {((data.absentDays / data.totalDays) * 100).toFixed(1)}% of
                total
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-[#030E18] mb-1">
                {data.lateDays}
              </div>
              <div className="text-sm text-[#6F6F6F] mb-2">Days Late</div>
              <div className="text-xs text-[#6F6F6F]">
                {((data.lateDays / data.totalDays) * 100).toFixed(1)}% of total
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-[#030E18] mb-1">
                {data.excusedDays}
              </div>
              <div className="text-sm text-[#6F6F6F] mb-2">Days Excused</div>
              <div className="text-xs text-[#6F6F6F]">
                {((data.excusedDays / data.totalDays) * 100).toFixed(1)}% of
                total
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
