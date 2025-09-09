"use client";
import Layout from "@/components/Layout";
import { useAttendanceKPIs } from "@/hooks/useAttendanceKPIs";
import { AttendanceMetricCard } from "@/components/attendance/AttendanceMetricCard";
import { AttendanceOverview } from "@/components/attendance/AttendanceOverview";
import { AttendanceInsights } from "@/components/attendance/AttendanceInsights";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { EmptyState } from "@/components/EmptyState";
import { MetricCardSkeleton } from "@/components/CardSkelenton";
import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

function AttendancePage() {
  const { attendanceData, isLoading, error, refetch } = useAttendanceKPIs();

  // Determine error variant based on error message
  const getErrorVariant = (errorMessage: string) => {
    const lowerError = errorMessage.toLowerCase();
    if (
      lowerError.includes("network") ||
      lowerError.includes("fetch") ||
      lowerError.includes("connection")
    ) {
      return "network";
    }
    if (
      lowerError.includes("unauthorized") ||
      lowerError.includes("token") ||
      lowerError.includes("authentication")
    ) {
      return "auth";
    }
    if (lowerError.includes("500") || lowerError.includes("server")) {
      return "server";
    }
    return "default";
  };

  return (
    <Layout>
      <div className="h-full flex flex-col p-4 gap-6 overflow-y-auto bg-[#F8F8F8]">
        {/* Page Header */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-semibold">Attendance</h1>
            <p className="text-[#AAAAAA]">
              Track your school attendance records
            </p>
          </div>
        </div>

        {isLoading ? (
          /* Loading State */
          <div className="space-y-6">
            <Card className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-48"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex-1 flex items-center justify-center">
            <ErrorDisplay
              error={error}
              onRetry={refetch}
              title="Attendance Data Unavailable"
              variant={getErrorVariant(error)}
            />
          </div>
        ) : !attendanceData ? (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              title="No Attendance Data"
              message="Your attendance records will appear here once they're available."
              actionLabel="Refresh Data"
              onAction={refetch}
              icon={<BookOpen className="h-12 w-12" />}
            />
          </div>
        ) : (
          /* Main Content */
          <div className="space-y-6">
            {/* Student Overview */}
            <AttendanceOverview data={attendanceData} />

            {/* Metrics Grid - Only 4 cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <AttendanceMetricCard
                type="attendance-rate"
                value={attendanceData.attendanceRate}
                label="Attendance Rate"
                subtitle="Overall performance"
              />
              <AttendanceMetricCard
                type="present"
                value={attendanceData.presentDays}
                label="Present Days"
                subtitle={`Out of ${attendanceData.totalDays} days`}
                percentage={
                  (attendanceData.presentDays / attendanceData.totalDays) * 100
                }
              />
              <AttendanceMetricCard
                type="absent"
                value={attendanceData.absentDays}
                label="Absent Days"
                subtitle={`${(
                  (attendanceData.absentDays / attendanceData.totalDays) *
                  100
                ).toFixed(1)}% of total`}
                percentage={
                  (attendanceData.absentDays / attendanceData.totalDays) * 100
                }
              />
              <AttendanceMetricCard
                type="total"
                value={attendanceData.totalDays}
                label="Total School Days"
                subtitle={`In ${
                  attendanceData.termInfo?.name || attendanceData.classInfo.name
                }`}
              />
            </div>

            {/* Attendance Insights */}
            <AttendanceInsights data={attendanceData} />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AttendancePage;
