"use client";
// pages/attendance.tsx
import Layout from "@/components/Layout";
import CustomCalendar from "@/components/attendance/AttendanceCalendar";
import { MetricCard } from "@/components/attendance/MetricCard";
import { useAttendance } from "@/hooks/useAttendance";
import React from "react";

function AttendancePage() {
  const { attendanceData, isLoading } = useAttendance();

  const metrics = attendanceData
    ? {
        daysPresent: {
          value: attendanceData.presentDays,
          message: <span>Days present this term</span>,
        },
        daysAbsent: {
          value: attendanceData.absentDays,
          message: <span>Days absent this term</span>,
        },
        attendancePercentage: {
          value: parseFloat(attendanceData.attendancePercentage),
          message: "Attendance percentage",
        },
      }
    : {
        daysPresent: { value: 5, message: <span>Loading...</span> },
        daysAbsent: { value: 0, message: <span>Loading...</span> },
        attendancePercentage: { value: 0, message: "Loading..." },
      };

  return (
    <Layout>
      <div className="h-full flex flex-col p-4 gap-4 overflow-y-auto">
        <p>Attendance</p>
        <div className="flex flex-col gap-6">
          {isLoading ? (
            <p>Loading attendance data...</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                value={metrics.daysPresent.value}
                label="Present Days"
                message={metrics.daysPresent.message}
              />
              <MetricCard
                value={metrics.daysAbsent.value}
                label="Absent Days"
                message={metrics.daysAbsent.message}
              />
              <MetricCard
                value={metrics.attendancePercentage.value}
                label="Attendance Percentage"
                message={metrics.attendancePercentage.message}
              />
            </div>
          )}
          <CustomCalendar />
        </div>
      </div>
    </Layout>
  );
}

export default AttendancePage;