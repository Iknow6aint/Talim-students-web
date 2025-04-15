// components/Timetable.tsx
"use client";

import { Download } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTimetable, TimetableSubject } from "@/hooks/useTimetable";

const Timetable = ({ buttonText }: { buttonText: string }) => {
  const hourHeight = 130; // Height for each hour (in pixels)
  const { subjects, isLoading } = useTimetable();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showIndicator, setShowIndicator] = useState(false);
  const [currentTimePosition, setCurrentTimePosition] = useState(0);
  const [schoolHours, setSchoolHours] = useState({ start: 8, end: 17 }); // Default values

  // Determine school hours based on timetable data
  useEffect(() => {
    if (subjects.length > 0) {
      const allStartTimes = subjects.map(subject => subject.start);
      const allEndTimes = subjects.map(subject => subject.end);
      
      const earliestStart = Math.floor(Math.min(...allStartTimes));
      const latestEnd = Math.ceil(Math.max(...allEndTimes));
      
      // Set school hours with 1 hour buffer before first class and after last class
      setSchoolHours({
        start: Math.max(earliestStart - 1, 7), // Don't go earlier than 7 AM
        end: Math.min(latestEnd + 1, 20) // Don't go later than 8 PM
      });
    }
  }, [subjects]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Calculate current time position and visibility
  useEffect(() => {
    const currentDecimalTime = currentTime.getHours() + currentTime.getMinutes() / 60;
    const { start, end } = schoolHours;
    
    if (currentDecimalTime >= start && currentDecimalTime <= end) {
      const timePosition = (currentDecimalTime - start) * hourHeight + 65;
      setCurrentTimePosition(timePosition);
      setShowIndicator(true);
    } else {
      setShowIndicator(false);
    }
  }, [currentTime, hourHeight, schoolHours]);

  if (isLoading) {
    return <div>Loading timetable...</div>;
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="sm:px-4 p-3 max-w-[95vw] overflow-hidden">
      <div className="mx-auto bg-[#F8F8F8] rounded-lg">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-semibold">Timetable</h1>
          <Button
            className={`py-6 hidden sm:flex ${
              buttonText === "See all"
                ? "bg-transparent border-none hover:bg-transparent shadow-none text-[#6F6F6F]"
                : "bg-[#003366] hover:bg-blue-800"
            }`}
          >
            {buttonText}
            {buttonText !== "See all" && <Download className="mr-2 h-7 w-6" />}
          </Button>
        </div>
        <p className="text-[#AAAAAA] mb-6">
          Stay on Track with Your Class Schedule!
        </p>

        <div className="overflow-x-auto border border-[#F0F0F0] rounded-t-3xl h-screen overflow-y-scroll">
          <div className="grid sticky top-0 z-30" style={{ gridTemplateColumns: "103px repeat(5, 1fr)" }}>
            <div className="font-semibold text-center bg-[#FFFFFF] py-6 border-b">Time</div>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day, index) => (
              <div
                key={index}
                className="font-semibold min-w-[114px] text-center bg-[#FFFFFF] py-6 border-l border-[#F0F0F0] border-b"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid relative" style={{ gridTemplateColumns: "103px repeat(5, 1fr)" }}>
            <div className="left-0 bg-white">
              {Array.from({ length: schoolHours.end - schoolHours.start + 1 }, (_, i) => {
                const hour = schoolHours.start + i;
                const timeStr = hour > 12 ? `${hour - 12} PM` : hour === 12 ? "12 PM" : `${hour} AM`;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-center border-b border-[#F0F0F0]"
                    style={{ height: `${hourHeight}px` }}
                  >
                    {timeStr}
                  </div>
                );
              })}
            </div>

            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="col-span-1 min-w-[114px] border-l border-[#F0F0F0] bg-white relative"
              >
                {subjects
                  .filter((subject) => subject.day === day)
                  .map((subject, subjectIndex) => {
                    const topPosition = (subject.start - schoolHours.start) * hourHeight + 65;
                    const subjectHeight = (subject.end - subject.start) * hourHeight;

                    return (
                      <div
                        key={subjectIndex}
                        className="absolute left-0 right-0 p-2 border-y border-[#F0F0F0] flex flex-col justify-center "
                        style={{
                          top: `${topPosition}px`,
                          height: `${subjectHeight}px`,
                        }}
                      >
                        <div className="font-semibold text-center">{subject.name}</div>
                        <div className="text-sm text-gray-500 text-center">
                          {subject.timeString}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}

            {showIndicator && (
              <div
                className="absolute left-[110px] w-[88%] 2xl:w-[93%]"
                style={{
                  top: `${currentTimePosition - 7}px`,
                  zIndex: 20,
                }}
              >
                <div className="absolute top-[-6px] left-[-105px] px-3 py-1 flex items-center justify-center bg-[#002B5B] text-white font-medium rounded-full">
                  {formatTime(currentTime)}
                </div>
                <div
                  className="absolute  left-[-8px] right-0 h-2 w-2 rounded-full bg-[#002B5B]"
                  style={{ top: `5.4px` }}
                />
                <div
                  className="absolute top-2 left-0 right-0 bg-[#002B5B]"
                  style={{ height: "3px" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;


{/* <div
className="absolute left-[110px] w-[88%] 2xl:w-[93%]"
style={{
  top: `${currentTimePosition - 7}px `, // Position based on the calculated time
  zIndex: 20,
}}
>
{/* Time Pill */}
// {/* <div className="absolute top-[-6px] left-[-87px] px-3 py-1 flex items-center justify-center bg-[#002B5B] text-white font-medium rounded-full">
//   {/* {manualTime} */}
// </div>

// {/* Blue Dot */}
// <div
//   className="absolute  left-[-8px] right-0 h-2 w-2 rounded-full bg-[#002B5B]"
//   style={{
//     top: `5.4px`, // Position based on the calculated time
//   }}
// /> */}

{/* Horizontal Line */}
{/* <div
  className="absolute top-2 left-0 right-0 bg-[#002B5B]"
  style={{
    height: "3px", // Line thickness
  }}
/>
// </div> */}