import { API_BASE_URL } from "@/lib/constants";

export interface AttendanceKPIData {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  userAvatar?: string;
  classInfo: {
    id: string;
    name: string;
  };
  attendanceRate: number;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  termInfo?: {
    id: string;
    name: string;
  };
}

export interface ClassAttendanceStatus {
  classId: string;
  className: string;
  date: string;
  totalStudents: number;
  attendanceMarked: number;
  attendanceNotMarked: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  students: Array<{
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    userAvatar?: string;
    attendanceMarked: boolean;
    attendanceStatus?: "Present" | "Absent" | "Late" | "Excused";
    recordedBy?: {
      id: string;
      name: string;
    };
    recordedAt?: string;
  }>;
}

// services/attendance.service.ts
export const attendanceService = {
  getDashboard: async (schoolId: string, accessToken: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/attendance/dashboard/${schoolId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("API Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error response:", errorData);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("API Success response:", data);
      return data;
    } catch (error) {
      console.error("Network error:", error);
      throw error;
    }
  },

  getAttendanceKPIs: async (
    studentId: string,
    accessToken: string
  ): Promise<AttendanceKPIData> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/attendance/student/${studentId}/kpis`,
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

  getClassAttendanceStatus: async (
    classId: string,
    date: string,
    accessToken: string
  ): Promise<ClassAttendanceStatus> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/attendance/class/${classId}/status?date=${date}`,
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
