"use client";

import { useState } from "react";
import { useCourseGradeRecords } from "@/hooks/useCourseGradeRecords";
import { useStudentGradeKPIs } from "@/hooks/useStudentGradeKPIs";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { EmptyState } from "@/components/EmptyState";
import type { CourseGradeRecord, AssessmentGradeRecord } from "@/services/grades.service";
import {
  BookOpen,
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Trophy,
  CheckCircle2,
  BarChart3,
  Users,
} from "lucide-react";

// ─── helpers ───────────────────────────────────────────────────────────────

function gradeBadgeClass(grade: string) {
  const g = (grade || "").toUpperCase();
  if (g === "A+" || g === "A") return "bg-emerald-100 text-emerald-700";
  if (g === "B+" || g === "B") return "bg-blue-100 text-blue-700";
  if (g === "C+" || g === "C") return "bg-amber-100 text-amber-700";
  if (g === "D+" || g === "D") return "bg-orange-100 text-orange-700";
  if (g === "E") return "bg-red-100 text-red-500";
  if (g === "F") return "bg-red-200 text-red-800";
  return "bg-gray-100 text-gray-500";
}

function progressColor(pct: number) {
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 70) return "bg-blue-500";
  if (pct >= 60) return "bg-amber-400";
  if (pct >= 45) return "bg-orange-500";
  return "bg-red-500";
}

function getErrorVariant(msg: string): "network" | "auth" | "server" | "default" {
  const m = msg.toLowerCase();
  if (m.includes("network") || m.includes("fetch") || m.includes("connection")) return "network";
  if (m.includes("unauthorized") || m.includes("token") || m.includes("authentication")) return "auth";
  if (m.includes("500") || m.includes("server")) return "server";
  return "default";
}

/** Resolve course name from either the flat or the populated-object shape */
function resolveCourse(r: CourseGradeRecord) {
  if (r.courseId && typeof r.courseId === "object") {
    return {
      name: r.courseId.name ?? r.courseName ?? "Unnamed Course",
      code: r.courseId.code ?? r.courseCode,
      credits: r.courseId.creditHours ?? r.creditHours,
      key: r.courseId._id ?? r._id ?? Math.random().toString(),
    };
  }
  return {
    name: r.courseName ?? "Unnamed Course",
    code: r.courseCode,
    credits: r.creditHours,
    key: (r.courseId as string) ?? r._id ?? Math.random().toString(),
  };
}

/** Normalize assessments from either shape */
function resolveAssessments(r: CourseGradeRecord): AssessmentGradeRecord[] {
  return (r.assessmentGradeRecords ?? r.assessments ?? []);
}

function assessmentLabel(a: AssessmentGradeRecord, index: number): string {
  if (a.assessmentName) return a.assessmentName;
  if (a.assessmentId && typeof a.assessmentId === "object") {
    return a.assessmentId.title ?? a.assessmentId.name ?? `Assessment ${index + 1}`;
  }
  return `Assessment ${index + 1}`;
}

function assessmentType(a: AssessmentGradeRecord): string | null {
  if (a.assessmentType) return a.assessmentType;
  if (a.assessmentId && typeof a.assessmentId === "object") {
    return a.assessmentId.type ?? null;
  }
  return null;
}

// ─── sub-components ────────────────────────────────────────────────────────

function StatCard({
  icon,
  value,
  label,
  sub,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  sub?: string;
}) {
  return (
    <Card className="border border-[#F0F0F0] shadow-none rounded-2xl">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-2xl font-bold text-[#030E18] leading-tight tabular-nums">
              {value}
            </div>
            <div className="text-sm font-medium text-[#6F6F6F] mt-1">{label}</div>
            {sub && <div className="text-xs text-[#AAAAAA] mt-0.5">{sub}</div>}
          </div>
          <div className="flex-shrink-0 p-2.5 bg-[#003366]/10 rounded-xl text-[#003366]">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryRow({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#F5F5F5] last:border-0">
      <span className="text-sm text-[#6F6F6F]">{label}</span>
      <div className="text-right">
        <div className="text-sm font-semibold text-[#030E18]">{value}</div>
        {sub && <div className="text-xs text-[#AAAAAA]">{sub}</div>}
      </div>
    </div>
  );
}

function CourseCard({
  record,
  isExpanded,
  onToggle,
}: {
  record: CourseGradeRecord;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { name, code, credits } = resolveCourse(record);
  const assessments = resolveAssessments(record);
  const pct = record.percentage ?? record.courseAverage ?? 0;
  const grade = record.gradeLevel ?? record.letterGrade ?? "";

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden transition-shadow hover:shadow-sm">
      {/* Header row — always visible */}
      <button
        className="w-full text-left p-5 focus:outline-none"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#003366]/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#003366]" />
          </div>

          {/* Course info */}
          <div className="flex-1 min-w-0 text-left">
            <div className="font-semibold text-[#030E18] truncate">{name}</div>
            <div className="text-xs text-[#AAAAAA] mt-0.5 flex flex-wrap gap-x-2">
              {code && <span>{code}</span>}
              {credits != null && <span>{credits} credit{credits !== 1 ? "s" : ""}</span>}
              {assessments.length > 0 && (
                <span className="text-[#003366] font-medium">
                  {assessments.length} assessment{assessments.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {/* Score + grade + chevron */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-base font-bold text-[#030E18]">
                {typeof pct === "number" && !isNaN(pct)
                  ? `${pct.toFixed(1)}%`
                  : "N/A"}
              </div>
              {record.cumulativeScore != null && record.maxScore != null && (
                <div className="text-xs text-[#AAAAAA]">
                  {record.cumulativeScore}/{record.maxScore}
                </div>
              )}
            </div>
            {grade && (
              <span
                className={`text-sm font-bold px-2.5 py-1 rounded-lg ${gradeBadgeClass(grade)}`}
              >
                {grade}
              </span>
            )}
            <div className="text-[#CCCCCC]">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#AAAAAA]">Score</span>
            <span className="text-xs font-medium text-[#030E18] sm:hidden">
              {typeof pct === "number" && !isNaN(pct) ? `${pct.toFixed(1)}%` : "N/A"}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor(pct)}`}
              style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
            />
          </div>
        </div>
      </button>

      {/* Expanded: assessment breakdown */}
      {isExpanded && (
        <div className="border-t border-[#F0F0F0] px-5 pb-5 pt-4">
          {assessments.length === 0 ? (
            <p className="text-sm text-[#AAAAAA] text-center py-3">
              No assessment records available yet
            </p>
          ) : (
            <>
              <div className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider mb-3">
                Assessment Breakdown
              </div>
              <div className="space-y-2">
                {assessments.map((a, i) => {
                  const score = a.actualScore ?? a.score ?? null;
                  const max = a.maxScore ?? null;
                  const aPct = score != null && max ? (score / max) * 100 : null;
                  const type = assessmentType(a);

                  return (
                    <div
                      key={a._id ?? (typeof a.assessmentId === "string" ? a.assessmentId : a.assessmentId?._id) ?? i}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[#030E18] truncate">
                          {assessmentLabel(a, i)}
                        </div>
                        {type && (
                          <div className="text-xs text-[#AAAAAA] capitalize">{type}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {aPct != null && (
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-md ${gradeBadgeClass(
                              aPct >= 90
                                ? "A+"
                                : aPct >= 80
                                ? "A"
                                : aPct >= 75
                                ? "B+"
                                : aPct >= 70
                                ? "B"
                                : aPct >= 65
                                ? "C+"
                                : aPct >= 60
                                ? "C"
                                : aPct >= 55
                                ? "D+"
                                : aPct >= 50
                                ? "D"
                                : aPct >= 45
                                ? "E"
                                : "F"
                            )}`}
                          >
                            {aPct.toFixed(0)}%
                          </span>
                        )}
                        <div className="text-sm font-semibold text-[#030E18] tabular-nums">
                          {score != null ? score : "—"}
                          {max != null ? <span className="text-[#AAAAAA] font-normal">/{max}</span> : ""}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-xl ${className ?? ""}`} />
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} className="border border-[#F0F0F0] shadow-none rounded-2xl">
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-2xl border border-[#F0F0F0] p-5 space-y-4"
            >
              <div className="flex gap-3 items-center">
                <Skeleton className="w-10 h-10 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-12 flex-shrink-0" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="animate-pulse bg-white rounded-2xl border border-[#F0F0F0] p-5 space-y-4 h-64" />
        </div>
      </div>
    </div>
  );
}

// ─── main component ─────────────────────────────────────────────────────────

const GRADE_SCALE = [
  { grade: "A+", range: "≥ 90%", cls: "bg-emerald-100 text-emerald-700" },
  { grade: "A", range: "≥ 80%", cls: "bg-emerald-100 text-emerald-700" },
  { grade: "B+", range: "≥ 75%", cls: "bg-blue-100 text-blue-700" },
  { grade: "B", range: "≥ 70%", cls: "bg-blue-100 text-blue-700" },
  { grade: "C+", range: "≥ 65%", cls: "bg-amber-100 text-amber-700" },
  { grade: "C", range: "≥ 60%", cls: "bg-amber-100 text-amber-700" },
  { grade: "D+", range: "≥ 55%", cls: "bg-orange-100 text-orange-700" },
  { grade: "D", range: "≥ 50%", cls: "bg-orange-100 text-orange-700" },
  { grade: "E", range: "≥ 45%", cls: "bg-red-100 text-red-500" },
  { grade: "F", range: "< 45%", cls: "bg-red-200 text-red-800" },
];

export default function ResultsDashboard() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetchRecords();
    refetchKPIs();
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const toggleCourse = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const hasData = kpiData || (gradeRecords && gradeRecords.length > 0);

  return (
    <div className="min-h-full p-5 sm:p-6 bg-[#F8F8F8] space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#030E18]">Results</h1>
          <p className="text-sm text-[#AAAAAA] mt-0.5">
            {kpiData?.currentTerm?.name
              ? `${kpiData.currentTerm.name} · `
              : ""}
            Academic performance overview
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#003366] bg-white border border-[#F0F0F0] rounded-xl hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50 flex-shrink-0"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* ── States ── */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="flex items-center justify-center py-24">
          <ErrorDisplay
            error={error}
            onRetry={handleRefresh}
            title="Academic Data Unavailable"
            variant={getErrorVariant(error)}
          />
        </div>
      ) : !hasData ? (
        <div className="flex items-center justify-center py-24">
          <EmptyState
            title="No Academic Data Yet"
            message="Your results will appear here once your teachers have submitted grades."
            actionLabel="Refresh"
            onAction={handleRefresh}
            icon={<BookOpen className="h-12 w-12" />}
          />
        </div>
      ) : (
        <>
          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<BarChart3 className="w-5 h-5" />}
              value={
                kpiData?.gradeScore != null ? `${kpiData.gradeScore}%` : "—"
              }
              label="Grade Score"
              sub="This term"
            />
            <StatCard
              icon={<Trophy className="w-5 h-5" />}
              value={
                kpiData?.classPosition != null
                  ? `#${kpiData.classPosition}`
                  : "—"
              }
              label="Class Position"
              sub={
                kpiData?.totalStudentsInClass
                  ? `of ${kpiData.totalStudentsInClass} students`
                  : undefined
              }
            />
            <StatCard
              icon={<BookOpen className="w-5 h-5" />}
              value={
                kpiData?.subjectsEnrolled ?? gradeRecords?.length ?? "—"
              }
              label="Subjects"
              sub="Enrolled"
            />
            <StatCard
              icon={<CheckCircle2 className="w-5 h-5" />}
              value={kpiData?.completedAssessments ?? "—"}
              label="Assessments"
              sub="Completed"
            />
          </div>

          {/* ── Main content ── */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Subject performance (left, wider) */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-[#030E18]">
                  Subject Performance
                </h2>
                {gradeRecords && gradeRecords.length > 0 && (
                  <span className="text-xs text-[#AAAAAA]">
                    {gradeRecords.length} subject
                    {gradeRecords.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {!gradeRecords || gradeRecords.length === 0 ? (
                <Card className="border border-[#F0F0F0] shadow-none rounded-2xl">
                  <CardContent className="py-14 text-center">
                    <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-[#6F6F6F] font-medium text-sm">
                      No course grades yet
                    </p>
                    <p className="text-xs text-[#AAAAAA] mt-1">
                      Grades appear here once teachers submit them
                    </p>
                  </CardContent>
                </Card>
              ) : (
                gradeRecords.map((record) => {
                  const { key } = resolveCourse(record);
                  return (
                    <CourseCard
                      key={key}
                      record={record}
                      isExpanded={expanded.has(key)}
                      onToggle={() => toggleCourse(key)}
                    />
                  );
                })
              )}
            </div>

            {/* Right sidebar */}
            <div className="space-y-4">
              {/* Academic summary */}
              <h2 className="text-base font-semibold text-[#030E18]">
                Academic Summary
              </h2>

              <Card className="border border-[#F0F0F0] shadow-none rounded-2xl">
                <CardContent className="p-5 space-y-4">
                  {kpiData ? (
                    <>
                      {/* Overall grade hero */}
                      <div className="flex items-center justify-between p-4 bg-[#003366]/5 rounded-xl">
                        <div>
                          <div className="text-xs text-[#AAAAAA] font-medium uppercase tracking-wider">
                            Overall Grade
                          </div>
                          <div className="text-sm font-medium text-[#030E18] mt-0.5">
                            {kpiData.gradeScore}% score
                          </div>
                        </div>
                        <div
                          className={`text-2xl font-bold px-4 py-2 rounded-xl ${gradeBadgeClass(
                            kpiData.gradeLevel
                          )}`}
                        >
                          {kpiData.gradeLevel || "—"}
                        </div>
                      </div>

                      {/* Info rows */}
                      <div>
                        <SummaryRow
                          label="Current Term"
                          value={kpiData.currentTerm?.name || "—"}
                        />
                        <SummaryRow
                          label="Class"
                          value={kpiData.classInfo?.name || "—"}
                        />
                        <SummaryRow
                          label="Class Rank"
                          value={
                            kpiData.classPosition != null
                              ? `#${kpiData.classPosition}`
                              : "—"
                          }
                          sub={
                            kpiData.totalStudentsInClass
                              ? `of ${kpiData.totalStudentsInClass} students`
                              : undefined
                          }
                        />
                        <SummaryRow
                          label="Assessments Done"
                          value={String(kpiData.completedAssessments ?? "—")}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-[#AAAAAA] text-center py-6">
                      Summary data unavailable
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Grade scale reference */}
              <Card className="border border-[#F0F0F0] shadow-none rounded-2xl">
                <CardContent className="p-5">
                  <div className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wider mb-3">
                    Grade Scale
                  </div>
                  <div className="space-y-1.5">
                    {GRADE_SCALE.map(({ grade, range, cls }) => (
                      <div
                        key={grade}
                        className="flex items-center justify-between"
                      >
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-md min-w-[32px] text-center ${cls}`}
                        >
                          {grade}
                        </span>
                        <span className="text-xs text-[#AAAAAA]">{range}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
