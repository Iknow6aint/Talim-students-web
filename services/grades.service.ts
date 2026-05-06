import { API_BASE_URL } from "@/lib/constants";

export interface AssessmentGradeRecord {
  _id?: string;
  assessmentId:
    | string
    | { _id: string; title?: string; name?: string; type?: string };
  actualScore?: number;
  score?: number;
  maxScore: number;
  assessmentName?: string;
  assessmentType?: string;
  weightPercentage?: number;
  gradeDate?: string;
  feedback?: string;
}

export interface CourseGradeRecord {
  _id?: string;
  courseId:
    | string
    | null
    | { _id: string; name?: string; code?: string; creditHours?: number };
  studentId?: string | object;
  termId?: string | { _id: string; name?: string };
  assessmentGradeRecords?: AssessmentGradeRecord[];
  assessments?: AssessmentGradeRecord[];
  courseName?: string;
  courseCode?: string;
  creditHours?: number;
  courseAverage?: number;
  letterGrade?: string;
  gradePoints?: number;
  status?: "completed" | "in_progress" | "not_started";
  percentage?: number;
  cumulativeScore?: number;
  gradeLevel?: string;
  maxScore?: number;
  isActive?: boolean;
}

export interface StudentCumulativeGrade {
  _id: string;
  termId: { _id: string; name: string } | string;
  totalScore: number;
  percentage: number;
  grade: string;
  position: number;
  remarks?: string;
  isActive: boolean;
}

function extractArray<T>(json: unknown): T[] {
  if (Array.isArray(json)) return json as T[];
  if (json && typeof json === "object") {
    const p = json as { data?: T[] };
    if (Array.isArray(p.data)) return p.data;
  }
  return [];
}

async function apiFetch<T>(url: string, accessToken: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? `HTTP ${res.status}`
    );
  }

  return res.json();
}

export const gradesService = {
  /** All course grade records for the authenticated student in a given term */
  getCourseGradesByTerm: async (
    termId: string,
    accessToken: string
  ): Promise<CourseGradeRecord[]> => {
    const json = await apiFetch(
      `${API_BASE_URL}/grade-records/student/me/course-grades/term/${termId}`,
      accessToken
    );
    return extractArray<CourseGradeRecord>(json);
  },

  /** Cumulative grade record for the authenticated student for a given term */
  getCumulativeGradeByTerm: async (
    termId: string,
    accessToken: string
  ): Promise<StudentCumulativeGrade | null> => {
    const json = await apiFetch<StudentCumulativeGrade | null>(
      `${API_BASE_URL}/grade-records/student/me/cumulative-grades/${termId}`,
      accessToken
    );
    return json;
  },

  /** All cumulative term grade records for the authenticated student */
  getAllCumulativeGrades: async (
    accessToken: string
  ): Promise<StudentCumulativeGrade[]> => {
    const json = await apiFetch(
      `${API_BASE_URL}/grade-records/student/me/cumulative-grades`,
      accessToken
    );
    return extractArray<StudentCumulativeGrade>(json);
  },

  /** Assessment grade records for the authenticated student on one assessment */
  getAssessmentGrades: async (
    assessmentId: string,
    accessToken: string
  ): Promise<AssessmentGradeRecord[]> => {
    const json = await apiFetch(
      `${API_BASE_URL}/grade-records/student/me/assessments/${assessmentId}`,
      accessToken
    );
    return extractArray<AssessmentGradeRecord>(json);
  },
};
