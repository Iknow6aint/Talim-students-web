import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  subDays,
  addDays,
  isToday,
  isFuture,
  startOfDay,
} from "date-fns";

interface AttendanceDateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

export function AttendanceDateSelector({
  selectedDate,
  onDateChange,
  className = "",
}: AttendanceDateSelectorProps) {
  const handlePreviousDay = () => {
    const newDate = subDays(selectedDate, 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = addDays(selectedDate, 1);
    // Don't allow future dates
    if (!isFuture(startOfDay(newDate))) {
      onDateChange(newDate);
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const formatSelectedDate = (date: Date) => {
    if (isToday(date)) {
      return "Today";
    }
    return format(date, "EEEE, MMM do");
  };

  const canGoNext = !isFuture(startOfDay(addDays(selectedDate, 1)));

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Select Date</h3>
            <p className="text-sm text-gray-600">
              {formatSelectedDate(selectedDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousDay}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {!isToday(selectedDate) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className="text-xs px-3"
            >
              Today
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextDay}
            disabled={!canGoNext}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        {format(selectedDate, "EEEE, MMMM do, yyyy")}
      </div>
    </Card>
  );
}
