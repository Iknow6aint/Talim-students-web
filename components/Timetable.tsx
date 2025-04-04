"use client";
import { Download } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const Timetable = ({ buttonText }: { buttonText: string }) => {
  const hourHeight = 130; // Height for each hour (in pixels)
  const startHour = 8; // Start of the timetable (8 AM)

  // Set your custom time here (use a 24-hour format)
  const [manualTime, setManualTime] = useState("10:32");

  const [currentTimePosition, setCurrentTimePosition] = useState(0);

  useEffect(() => {
    // Parse the manually set time
    const [hours, minutes] = manualTime.split(":").map(Number);

    // Calculate the position based on hours and minutes
    const timePosition = (hours - startHour + minutes / 60) * hourHeight + 65;

    setCurrentTimePosition(timePosition);
  }, [manualTime, hourHeight]);

  const subjects = [
    { name: "Mathematics", day: "Monday", start: 8, end: 10 },
    { name: "Mathematics", day: "Tuesday", start: 8, end: 9 },
    { name: "English Studies", day: "Tuesday", start: 9, end: 10 },
    { name: "Social Studies", day: "Tuesday", start: 10, end: 11 },
    { name: "Civic Education", day: "Thursday", start: 9, end: 10 },
    { name: "Break time", day: "All", start: 12, end: 13 },
  ];

  return (
    <div className="sm:px-4 p-3 max-w-[95vw] overflow-hidden">
      <div className="mx-auto bg-[#F8F8F8] rounded-lg ">
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

        <div className="overflow-x-auto border border-[#F0F0F0] rounded-t-3xl h-screen 2xl:max-h-[full] overflow-y-scroll scrollbar-hide">
          <div
            className="grid sticky top-0 z-30"
            style={{ gridTemplateColumns: "103px repeat(5, 1fr)" }}
          >
            <div className="font-semibold text-center bg-[#FFFFFF] py-6 border-b">
              Time
            </div>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
              (day, index) => (
                <div
                  key={index}
                  className="font-semibold min-w-[114px] text-center bg-[#FFFFFF] py-6 border-l border-[#F0F0F0] border-b"
                >
                  {day}
                </div>
              )
            )}
          </div>

          <div
            className="grid relative"
            style={{ gridTemplateColumns: "103px repeat(5, 1fr)" }}
          >
            <div className="left-0 bg-white">
              {["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM"].map(
                (time, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center border-b border-[#F0F0F0]"
                    style={{ height: `${hourHeight}px` }}
                  >
                    {time}
                  </div>
                )
              )}
            </div>

            {subjects
              .filter((subject) => subject.name === "Break time")
              .map((breakTime, index) => {
                const topPosition =
                  (breakTime.start - startHour) * hourHeight + 65;
                const subjectHeight =
                  (breakTime.end - breakTime.start) * hourHeight - 16;

                return (
                  <div
                    key={index}
                    className="absolute left-[103px] right-0 m-1 p-2 rounded shadow-md bg-black flex items-center justify-center text-center"
                    style={{
                      top: `${topPosition}px`,
                      height: `${subjectHeight}px`,
                      gridColumn: "span 5",
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

            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
              (day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="col-span-1 min-w-[114px] border-l border-[#F0F0F0] bg-white relative"
                >
                  {subjects
                    .filter((subject) => subject.day === day)
                    .map((subject, subjectIndex) => {
                      const topPosition =
                        (subject.start - startHour) * hourHeight + 65;
                      const subjectHeight =
                        (subject.end - subject.start) * hourHeight;

                      return (
                        <div
                          key={subjectIndex}
                          className="absolute left-0 right-0 p-2 shadow-orange-800 border-y border-[#F0F0F0] flex items-center justify-center text-center"
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

            {/* Dynamic Time Indicator Based on Custom Time */}
            <div
              className="absolute left-[110px] w-[88%] 2xl:w-[93%]"
              style={{
                top: `${currentTimePosition - 7}px `, // Position based on the calculated time
                zIndex: 20,
              }}
            >
              {/* Time Pill */}
              <div className="absolute top-[-6px] left-[-87px] px-3 py-1 flex items-center justify-center bg-[#002B5B] text-white font-medium rounded-full">
                {manualTime}
              </div>

              {/* Blue Dot */}
              <div
                className="absolute  left-[-8px] right-0 h-2 w-2 rounded-full bg-[#002B5B]"
                style={{
                  top: `5.4px`, // Position based on the calculated time
                }}
              />

              {/* Horizontal Line */}
              <div
                className="absolute top-2 left-0 right-0 bg-[#002B5B]"
                style={{
                  height: "3px", // Line thickness
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
