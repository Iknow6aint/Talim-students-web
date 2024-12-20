import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ScheduleTimelineProps } from "@/types/dashboard"

export function ScheduleTimeline({ schedule, currentTime }: ScheduleTimelineProps) {
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "01:00",
    "02:00",
  ]

  const getLeftPosition = (time: string) => {
    const hour = parseFloat(time.replace(":", "."))
    return ((hour - 8) * 100) / 6
  }

  const getScheduleItemWidth = (startTime: string, endTime: string) => {
    const start = parseFloat(startTime.replace(":", "."))
    const end = parseFloat(endTime.replace(":", "."))
    // Calculate width based on time difference
    const width = ((end - start) * 100) / 6
    return `${width}%`
  }

  return (
    <div className="-mt-10 2xl:mt-8 bg-white lg:h-[27em] 2xl:h-[43em]">
      <CardHeader className="flex flex-row items-center justify-between px-6 py-4">
        <CardTitle className="text-lg font-medium">Today Schedule</CardTitle>
        <button className="text-sm text-gray-600 hover:text-gray-900">
          See all
        </button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative">
          {/* Timeline header */}
          <div className="flex justify-between ">
            {timeSlots.map((time) => (
              <div key={time} className="text-sm text-gray-500 font-medium">
                {time}
              </div>
            ))}
          </div>

          {/* Timeline grid */}
          <div className="relative">
            {/* Horizontal line */}
            <div className="absolute left-0 right-0 top-2 h-px bg-gray-200" />
            <div className="absolute left-0 right-0 lg:top-[17.5em] 2xl:top-[33.2em] h-px bg-gray-200" />
            {/* Current time indicator */}
            <div
              className="absolute z-10"
              style={{
                left: `${getLeftPosition(currentTime)}%`,
                top: 0,
              }}
            >
              {/* Time pill */}
              <div className="absolute -top-8 left-1/2 h-7 px-3 -translate-x-1/2 flex items-center justify-center bg-[#002B5B] text-white text-sm font-medium rounded-full">
                {currentTime}
              </div>
              {/* Blue dot */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-blue-600" />
              {/* Vertical line */}
              <div className="absolute top-4 left-1/2 lg:h-[16.5em] 2xl:h-[32em] w-px -translate-x-1/2 bg-blue-600" />
            </div>

            {/* Schedule items */}
            <div className="relative ">
              {schedule.map((item, index) => (
                <div
                  key={index}
                  className="absolute bg-white rounded-sm shadow-sm border-l-4 border-blue-600 py-2 px-3"
                  style={{
                    left: `${getLeftPosition(item.startTime)}%`,
                    top: `${index * 48 + 25}px`,
                    width: getScheduleItemWidth(item.startTime, item.endTime),
                  }}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {item.subject}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  )
}

