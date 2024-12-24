import { Download } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

const Timetable = () => {
  // Fixed height for each hour
  const hourHeight = 130; // Adjust height for your preference (in pixels)

  // Define subjects with start time, end time, and the day
  const subjects = [
    {
      name: "Mathematics",
      day: "Monday",
      start: 8,
      end: 10, // Ends at 10 AM
    },
    {
      name: "Mathematics",
      day: "Tuesday",
      start: 8,
      end: 9, // Ends at 9 AM
    },
    {
      name: "English Studies",
      day: "Tuesday",
      start: 9,
      end: 10, // Ends at 10 AM
    },
    {
      name: "Social Studies",
      day: "Tuesday",
      start: 10,
      end: 11, // Ends at 11 AM
    },
    {
      name: "Civic Education",
      day: "Thursday",
      start: 9,
      end: 10, // Ends at 10 AM
    },
    {
      name: "Break time",
      day: "All",
      start: 12,
      end: 13, // Ends at 1 PM
    },
  ];

  return (
    <div className="px-4">
      <div className="mx-auto bg-[#F8F8F8] rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Timetable</h1>
          {/* <button className="bg-blue-600 text-white w-[149px]  py-2 rounded hover:bg-blue-700">
            Download <Download className="mr-2 h-4 w-4" />
          </button> */}
          <Button className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800 py-6">
             Download <Download className="mr-2 h-7 w-6" />
          </Button>
        </div>
        <p className="text-gray-500 mb-6">
          Stay on Track with Your Class Schedule!
        </p>

        {/* Timetable */}
        <div className="overflow-x-auto border border-gray-300 rounded-t-3xl lg:h-[500px] 2xl:h-[790px] overflow-y-scroll">
          {/* Header Row */}
          <div
            className="grid sticky top-0 z-10"
            style={{ gridTemplateColumns: "103px repeat(5, 1fr)" }}
          >
            <div className="font-semibold text-center bg-[#FFFFFF] py-6">
              Time
            </div>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
              (day, index) => (
                <div
                  key={index}
                  className="font-semibold text-center bg-[#FFFFFF] py-6 border-l border-gray-300"
                >
                  {day}
                </div>
              )
            )}
          </div>

          {/* Time Rows and Subjects */}
          <div
            className="grid relative"
            style={{ gridTemplateColumns: "103px repeat(5, 1fr)" }}
          >
            {/* Time Column */}
            <div className=" left-0  bg-white">
              {["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM"].map(
                (time, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center border-b border-gray-300"
                    style={{ height: `${hourHeight}px` }}
                  >
                    {time}
                  </div>
                )
              )}
            </div>

            {/* Render "Break time" spanning all columns */}
            {subjects
              .filter((subject) => subject.name === "Break time")
              .map((breakTime, index) => {
                const topPosition = (breakTime.start - 8) * hourHeight + 65; // Offset from 8 AM
                const subjectHeight =
                  (breakTime.end - breakTime.start) * hourHeight - 16; // Height based on duration

                return (
                  <div
                    key={index}
                    className="absolute left-[103px] right-0 m-1 p-2 rounded shadow-md bg-yellow-100 flex items-center justify-center text-center"
                    style={{
                      top: `${topPosition}px`,
                      height: `${subjectHeight}px`,
                      gridColumn: "span 5", // Span across all 5 days
                    }}
                  >
                    <div>
                      <div className="font-semibold">{breakTime.name}</div>
                      <div className="text-sm text-gray-500">
                        {breakTime.start}:00 PM - {breakTime.end}:00 PM
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* Days Columns */}
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
              (day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="col-span-1 border-l border-gray-300 relative"
                >
                  {subjects
                    .filter((subject) => subject.day === day)
                    .map((subject, subjectIndex) => {
                      const topPosition =
                        (subject.start - 8) * hourHeight + 65; // Offset from 8 AM
                      const subjectHeight =
                        (subject.end - subject.start) * hourHeight - 16; // Height based on duration

                      return (
                        <div
                          key={subjectIndex}
                          className="absolute left-0 right-0 m-1 p-2 rounded shadow-md bg-gray-100 flex items-center justify-center text-center"
                          style={{
                            top: `${topPosition}px`,
                            height: `${subjectHeight}px`,
                          }}
                        >
                          <div>
                            <div className="font-semibold">{subject.name}</div>
                            <div className="text-sm text-gray-500">
                              {subject.start}:00 AM - {subject.end}:00 AM
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
