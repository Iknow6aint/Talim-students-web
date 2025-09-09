import { Calendar, CheckCircle, XCircle, Clock, Coffee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AttendanceMetricCardProps {
  type: "attendance-rate" | "present" | "absent" | "late" | "excused" | "total";
  value: number;
  label: string;
  subtitle?: string;
  percentage?: number;
}

export function AttendanceMetricCard({
  type,
  value,
  label,
  subtitle,
  percentage,
}: AttendanceMetricCardProps) {
  const getIcon = (cardType: string) => {
    switch (cardType) {
      case "attendance-rate":
        return <Calendar className="h-[52px] w-[52px]" />;
      case "present":
        return <CheckCircle className="h-[52px] w-[52px]" />;
      case "absent":
        return <XCircle className="h-[52px] w-[52px]" />;
      case "late":
        return <Clock className="h-[52px] w-[52px]" />;
      case "excused":
        return <Coffee className="h-[52px] w-[52px]" />;
      default:
        return <Calendar className="h-[52px] w-[52px]" />;
    }
  };

  const getSuffix = (cardType: string) => {
    return cardType === "attendance-rate" ? "%" : "";
  };

  return (
    <Card className="overflow-hidden border border-[#F0F0F0] shadow-none">
      <CardContent className="pt-6 pb-4">
        <div className="space-y-2 flex mb-6 justify-start items-center gap-2 flex-row">
          <div className="flex justify-center items-center text-blue-600">
            {getIcon(type)}
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-medium text-[#030E18]">
              {value}
              {getSuffix(type)}
            </div>
            <p className="text-sm text-[#6F6F6F]">{label}</p>
          </div>
        </div>

        {/* Horizontal line */}
        <div className="h-px -mx-6 bg-gray-200" />

        {/* Subtitle */}
        <div className="mt-4 text-sm text-[#606060]">
          {subtitle || "View details"}
        </div>
      </CardContent>
    </Card>
  );
}
