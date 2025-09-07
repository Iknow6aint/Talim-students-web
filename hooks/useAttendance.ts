// hooks/useAttendance.ts
"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { API_ENDPOINTS} from "@/lib/constants";
import { AttendanceDashboard, AcademicResponse  } from "@/types/auth";
import { attendanceService } from "@/services/attendance.service";

export const useAttendance = () => {
  const { user, accessToken } = useAuthContext();
  const [attendanceData, setAttendanceData] = useState<AttendanceDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAttendance = async () => {
    if (!user?.userId || !accessToken) {
      toast.error("User not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Step 1: Fetch student ID
      const studentUrl = API_ENDPOINTS.STUDENTS_BY_USER.replace(":userId", user.userId);
      const studentResponse = await fetch(studentUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      if (!studentResponse.ok) {
        throw new Error("Failed to fetch student data");
      }

      const studentData: AcademicResponse = await studentResponse.json();
      const studentId = studentData.data[0]?._id;

      if (!studentId) {
        throw new Error("Student ID not found");
      }

      // Step 2: Fetch attendance data using service
      const data = await attendanceService.getDashboard(studentId, accessToken);
      setAttendanceData(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load attendance data";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [user, accessToken]);

  return { attendanceData, isLoading };
};