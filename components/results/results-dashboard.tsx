"use client";

import { useCourseGradeRecords } from "@/hooks/useCourseGradeRecords";
import { useStudentGradeKPIs } from "@/hooks/useStudentGradeKPIs";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { EmptyState } from "@/components/EmptyState";
import { MetricCardSkeleton } from "@/components/CardSkelenton";
import {
  BookOpen,
  Award,
  TrendingUp,
  Users,
  FileText,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";

export default function ResultsDashboard() {
  const {
    gradeRecords,
    isLoading: recordsLoading,
    error: recordsError,
    refetch: refetchRecords,
  } = useCourseGradeRecords();
  const {
    kpiData,
    isLoading: kpiLoading,
    error: kpiError,
    refetch: refetchKPIs,
  } = useStudentGradeKPIs();

  const isLoading = recordsLoading || kpiLoading;
  const error = recordsError || kpiError;

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

  const refetch = () => {
    refetchRecords();
    refetchKPIs();
  };

  return (
    <div className="h-full flex flex-col p-4 gap-6 overflow-y-auto bg-[#F8F8F8]">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-xl font-semibold">Results</h1>
          <p className="text-[#AAAAAA]">
            Track your academic performance and grades
          </p>
        </div>
      </div>

      {isLoading ? (
        /* Loading State */
        <div className="space-y-6">
          {/* KPI Cards Loading */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </div>

          {/* Content Loading */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="p-6 border border-[#F0F0F0] shadow-none">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </Card>
            <Card className="p-6 border border-[#F0F0F0] shadow-none">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : error ? (
        /* Error State */
        <div className="flex-1 flex items-center justify-center">
          <ErrorDisplay
            error={error}
            onRetry={refetch}
            title="Academic Data Unavailable"
            variant={getErrorVariant(error)}
          />
        </div>
      ) : !kpiData ? (
        /* Empty State - No KPI Data */
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            title="No Academic Data"
            message="Your academic performance data will appear here once available."
            actionLabel="Refresh Data"
            onAction={refetch}
            icon={<BookOpen className="h-12 w-12" />}
          />
        </div>
      ) : (
        /* Main Content */
        <div className="space-y-6">
          {/* Performance Overview Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Percentage Card */}
            <Card className="overflow-hidden border border-[#F0F0F0] shadow-none">
              <CardContent className="pt-6 pb-4">
                <div className="space-y-2 flex mb-6 justify-start items-center gap-2 flex-row">
                  <div className="flex justify-center items-center text-blue-600">
                    <Award className="h-[52px] w-[52px]" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-medium text-[#030E18]">
                      {gradeRecords && gradeRecords[0]?.percentage
                        ? `${gradeRecords[0].percentage.toFixed(1)}%`
                        : "N/A%"}
                    </div>
                    <p className="text-sm text-[#6F6F6F]">Overall Percentage</p>
                  </div>
                </div>
                <div className="h-px -mx-6 bg-gray-200" />
                <div className="mt-4 text-sm text-[#606060]">
                  Current performance
                </div>
              </CardContent>
            </Card>

            {/* Cumulative Score Card */}
            <Card className="overflow-hidden border border-[#F0F0F0] shadow-none">
              <CardContent className="pt-6 pb-4">
                <div className="space-y-2 flex mb-6 justify-start items-center gap-2 flex-row">
                  <div className="flex justify-center items-center text-blue-600">
                    <TrendingUp className="h-[52px] w-[52px]" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-medium text-[#030E18]">
                      {gradeRecords && gradeRecords[0]?.cumulativeScore
                        ? gradeRecords[0].cumulativeScore
                        : "N/A"}{" "}
                      <span className="text-[#6F6F6F] text-[18px]">
                        / {gradeRecords && gradeRecords[0]?.maxScore}
                      </span>
                    </div>
                    <p className="text-sm text-[#6F6F6F]">Cumulative Score</p>
                  </div>
                </div>
                <div className="h-px -mx-6 bg-gray-200" />
                <div className="mt-4 text-sm text-[#606060]">
                  Total score this term
                </div>
              </CardContent>
            </Card>

            {/* Grade Level Card */}
            <Card className="overflow-hidden border border-[#F0F0F0] shadow-none">
              <CardContent className="pt-6 pb-4">
                <div className="space-y-2 flex mb-6 justify-start items-center gap-2 flex-row">
                  <div className="flex justify-center items-center text-blue-600">
                    <Award className="h-[52px] w-[52px]" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-medium text-[#030E18]">
                      {gradeRecords && gradeRecords[0]?.gradeLevel
                        ? gradeRecords[0].gradeLevel
                        : "N/A"}
                    </div>
                    <p className="text-sm text-[#6F6F6F]">Grade Level</p>
                  </div>
                </div>
                <div className="h-px -mx-6 bg-gray-200" />
                <div className="mt-4 text-sm text-[#606060]">
                  Current grade level
                </div>
              </CardContent>
            </Card>

            {/* Max Score Card */}
            <Card className="overflow-hidden border border-[#F0F0F0] shadow-none">
              <CardContent className="pt-6 pb-4">
                <div className="space-y-2 flex mb-6 justify-start items-center gap-2 flex-row">
                  <div className="flex justify-center items-center text-blue-600">
                    <TrendingUp className="h-[52px] w-[52px]" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-medium text-[#030E18]">
                      {gradeRecords && gradeRecords[0]?.maxScore
                        ? gradeRecords[0].maxScore
                        : "N/A"}
                    </div>
                    <p className="text-sm text-[#6F6F6F]">Max Score</p>
                  </div>
                </div>
                <div className="h-px -mx-6 bg-gray-200" />
                <div className="mt-4 text-sm text-[#606060]">
                  Maximum possible score
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Subject Grades */}
            <Card className="lg:col-span-2 border border-[#F0F0F0] shadow-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#030E18] mb-4">
                  Subject Performance
                </h3>
                <div className="space-y-4">
                  {!gradeRecords || gradeRecords.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="text-[#6F6F6F] text-sm">
                        No grade records available for this term yet.
                      </div>
                      <div className="text-[#6F6F6F] text-xs mt-1">
                        Your grades will appear here once assessments are
                        completed.
                      </div>
                    </div>
                  ) : (
                    gradeRecords.map((record) => (
                      <div
                        key={record.courseId}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-[#030E18]">
                              {record.courseName}
                            </div>
                            <div className="text-sm text-[#6F6F6F]">
                              {record.courseCode} • {record.creditHours} credits
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-[#030E18]">
                            {typeof record.courseAverage === "number" &&
                            !isNaN(record.courseAverage)
                              ? `${record.courseAverage.toFixed(1)}%`
                              : "N/A%"}
                          </div>
                          <div className="text-sm text-[#6F6F6F]">
                            {record.letterGrade}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Academic Summary */}
            <Card className="border border-[#F0F0F0] shadow-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#030E18] mb-4">
                  Academic Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-[#030E18]">
                        Current Term
                      </div>
                      <div className="text-sm text-[#6F6F6F]">
                        {kpiData.currentTerm.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-[#030E18]">
                        {kpiData.gradeLevel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-[#030E18]">
                        Class Information
                      </div>
                      <div className="text-sm text-[#6F6F6F]">
                        {kpiData.classInfo.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-[#030E18]">
                        #{kpiData.classPosition}
                      </div>
                      <div className="text-xs text-[#6F6F6F]">Position</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-[#030E18]">
                        Assessments Completed
                      </div>
                      <div className="text-sm text-[#6F6F6F]">This term</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-[#030E18]">
                        {kpiData.completedAssessments}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
