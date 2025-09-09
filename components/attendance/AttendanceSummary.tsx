import { Card } from "@/components/ui/card";
import { AttendanceKPIData } from "@/services/attendance.service";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ProgressBarProps {
  value: number;
  color: string;
}

function ProgressBar({ value, color }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

interface AttendanceSummaryProps {
  data: AttendanceKPIData;
}

export function AttendanceSummary({ data }: AttendanceSummaryProps) {
  const summaryItems = [
    {
      label: "Present Days",
      value: data.presentDays,
      total: data.totalDays,
      percentage: (data.presentDays / data.totalDays) * 100,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      label: "Absent Days",
      value: data.absentDays,
      total: data.totalDays,
      percentage: (data.absentDays / data.totalDays) * 100,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    },
    {
      label: "Late Days",
      value: data.lateDays,
      total: data.totalDays,
      percentage: (data.lateDays / data.totalDays) * 100,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
    {
      label: "Excused Days",
      value: data.excusedDays,
      total: data.totalDays,
      percentage: (data.excusedDays / data.totalDays) * 100,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
  ];

  const getTrendIcon = (percentage: number) => {
    if (percentage > 20) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (percentage > 10)
      return <TrendingUp className="h-4 w-4 text-orange-500" />;
    if (percentage < 5)
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Attendance Breakdown
      </h3>

      <div className="space-y-4">
        {summaryItems.map((item, index) => (
          <div key={index} className={`${item.bgColor} rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${item.textColor}`}>
                  {item.label}
                </span>
                {item.label === "Absent Days" && getTrendIcon(item.percentage)}
              </div>
              <div className="text-right">
                <span className={`text-lg font-bold ${item.textColor}`}>
                  {item.value}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  / {item.total}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <ProgressBar value={item.percentage} color={item.color} />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {item.percentage.toFixed(1)}% of total days
                </span>
                {item.label === "Present Days" && item.percentage >= 90 && (
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                    Excellent
                  </span>
                )}
                {item.label === "Absent Days" && item.percentage > 10 && (
                  <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                    High
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Quick Stats
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Best Record:</span>
            <span className="ml-2 font-medium text-green-600">
              {data.presentDays} present days
            </span>
          </div>
          <div>
            <span className="text-gray-500">Total Days:</span>
            <span className="ml-2 font-medium">{data.totalDays} days</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
