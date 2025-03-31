import Layout from "@/components/Layout";
import CustomCalendar from "@/components/attendance/AttendanceCalendar";
import { MetricCard } from "@/components/attendance/MetricCard";
import React from "react";

function page() {
  const metrics = {
    daysPresent: {
      value: 105,
      message: (
        <span>
          Improved by <span className="text-[#050505] font-[500]">2 days</span>{" "}
          this month
        </span>
      ),
    },
    daysAbsent: {
      value: 85,
      message: (
        <span>
          Reduced by <span className="text-[#050505] font-[500]">2 days</span>{" "}
          this month
        </span>
      ),
    },
    attendancePercentage: {
      value: 95,
      message: "1.39% increase in this",
    },
  };

  return (
    <Layout>
      <div className="h-full flex flex-col p-4 gap-4 overflow-y-auto">
        <p>Attendance</p>
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              value={metrics.daysPresent.value}
              label="Present Days"
              message={metrics.daysPresent.message}
            />{" "}
            <MetricCard
              value={metrics.daysAbsent.value}
              label="Present Days"
              message={metrics.daysAbsent.message}
            />{" "}
            <MetricCard
              value={metrics.attendancePercentage.value}
              label="Present Days"
              message={metrics.attendancePercentage.message}
            />
          </div>
          <CustomCalendar />
        </div>
      </div>
    </Layout>
  );
}

export default page;
