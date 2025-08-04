// pages/dashboard.tsx
"use client";

import { useState } from "react";
import { MetricCard } from "@/components/metric-card";
import Layout from "@/components/Layout";
import Image from "next/image";
import Timetable from "@/components/Timetable";
import { useAttendance } from "@/hooks/useAttendance";
import { useAuthContext } from "@/contexts/AuthContext";

const schedule = [
  { subject: "Mathematics", startTime: "08:00", endTime: "10:00" },
  { subject: "Civic Education", startTime: "10:00", endTime: "11:00" },
  { subject: "C.R.S", startTime: "11:00", endTime: "12:00" },
  { subject: "BREAK - TIME", startTime: "12:00", endTime: "01:00" },
  { subject: "English language", startTime: "01:00", endTime: "02:00" },
];

export default function DashboardPage() {
  const { user } = useAuthContext();
  const { attendanceData, isLoading } = useAttendance();

  // Metrics with dynamic attendance percentage
  const metrics = {
    subjects: { value: 15, message: "See more", link: "/subjects" },
    gradeScore: { value: 85, message: "See more", link: "/results" },
    attendancePercentage: {
      value: attendanceData ? attendanceData.attendancePercentage : "N/A",
      message: "See more",
      link: "/attendance",
    },
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="relative w-full sm:h-screen bg-[#F8F8F8] px-4 overflow-hidden">
        <div className="h-full mx-auto flex flex-col space-y-5 2xl:space-y-8">
          {/* Overview */}
          <div className="flex-grow">
            <h2 className="text-xl font-semibold my-4">Overview</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                icon={
                  <Image
                    src="/icons/dashboard/subject.svg"
                    width={52}
                    height={52}
                    alt="Subjects Icon"
                    className="h-[52px] w-[52px]"
                  />
                }
                value={metrics.subjects.value}
                label="Subjects Enrolled"
                message={metrics.subjects.message}
                link={metrics.subjects.link}
              />
              <MetricCard
                icon={
                  <img
                    src="/icons/dashboard/award.svg"
                    alt="Award Icon"
                    className="h-[52px] w-[52px]"
                  />
                }
                value={metrics.gradeScore.value}
                label="Grade Score"
                message={metrics.gradeScore.message}
                link={metrics.gradeScore.link}
              />
              <MetricCard
                icon={
                  <img
                    src="/icons/dashboard/calendar.svg"
                    alt="Calendar Icon"
                    className="h-[52px] w-[52px]"
                  />
                }
                value={metrics.attendancePercentage.value}
                label="Attendance Percentage"
                message={metrics.attendancePercentage.message}
                link={metrics.attendancePercentage.link}
              />
            </div>
          </div>

          {/* Schedule */}
          <div>
            <Timetable />
          </div>
        </div>
      </div>
    </Layout>
  );
}