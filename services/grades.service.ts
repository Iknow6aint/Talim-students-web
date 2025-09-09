import { API_BASE_URL } from "@/lib/constants";

export interface CourseGradeRecord {
  courseId: string;
  courseName: string;
  courseCode: string;
  creditHours: number;
  assessments: Array<{
    assessmentId: string;
    assessmentName: string;
    assessmentType: string;
    maxScore: number;
    weightPercentage: number;
    score?: number;
    gradeDate?: string;
    feedback?: string;
  }>;
  courseAverage: number;
  letterGrade: string;
  gradePoints: number;
  status: "completed" | "in_progress" | "not_started";
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

export const gradesService = {
  getCourseGradeRecords: async (
    studentId: string,
    termId: string,
    accessToken: string
  ): Promise<CourseGradeRecord[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/grade-records/course-grade-records/student/${studentId}/term/${termId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw error;
    }
  },

  getStudentKPIs: async (
    studentId: string,
    accessToken: string
  ): Promise<StudentKPIData> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/students/${studentId}/dashboard/kpis`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw error;
    }
  },
};
