import { API_BASE_URL } from "@/lib/constants";

export interface AssessmentGradeRecord {
  _id?: string;
  assessmentId: string | { _id: string; title?: string; name?: string; type?: string };
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
  termId?: string | object;
  // Flattened fields (legacy / API may return flat or nested)
  courseName?: string;
  courseCode?: string;
  creditHours?: number;
  // New-shape assessment records
  assessmentGradeRecords?: AssessmentGradeRecord[];
  // Legacy assessment shape
  assessments?: AssessmentGradeRecord[];
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

export interface StudentKPIData {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  classInfo: {
    id: string;
    name: string;
  };
  subjectsEnrolled: number;
  gradeScore: number;
  attendanceRate: number;
  currentTerm: {
    id: string;
    name: string;
  };
  gradeLevel: string;
  completedAssessments: number;
  classPosition: number;
  totalStudentsInClass: number;
}

function extractArray<T>(json: unknown): T[] {
  if (Array.isArray(json)) return json as T[];
  if (json && typeof json === "object") {
    const paginated = json as { data?: T[] };
    if (Array.isArray(paginated.data)) return paginated.data;
  }
  return [];
}

export const gradesService = {
  getCourseGradeRecords: async (
    studentId: string,
    termId: string,
    accessToken: string
  ): Promise<CourseGradeRecord[]> => {
    const response = await fetch(
      `${API_BASE_URL}/grade-records/course-grade-records/student/${studentId}/term/${termId}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        (errorData as { message?: string }).message ||
          `HTTP error! status: ${response.status}`
      );
    }

    const json = await response.json();
    return extractArray<CourseGradeRecord>(json);
  },

  getStudentKPIs: async (
    studentId: string,
    accessToken: string
  ): Promise<StudentKPIData> => {
    const response = await fetch(
      `${API_BASE_URL}/students/${studentId}/dashboard/kpis`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        (errorData as { message?: string }).message ||
          `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  },
};
