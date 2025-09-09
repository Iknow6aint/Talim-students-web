import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  attendanceService,
  AttendanceKPIData,
} from "@/services/attendance.service";

export const useAttendanceKPIs = (studentId?: string) => {
  const [attendanceData, setAttendanceData] =
    useState<AttendanceKPIData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, accessToken } = useAuthContext();

  useEffect(() => {
    const fetchAttendanceKPIs = async () => {
      if (!accessToken) {
        setError("No access token available");
        setIsLoading(false);
        return;
      }

      // Use provided studentId or get from user context
      const targetStudentId =
        studentId || user?.studentId || user?.id || user?.userId;

      if (!targetStudentId) {
        setError("No student ID available");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const data = await attendanceService.getAttendanceKPIs(
          targetStudentId,
          accessToken
        );

        setAttendanceData(data);
      } catch (err) {
        console.error("Error fetching attendance KPIs:", err);

        // Provide more specific error messages
        let errorMessage = "Failed to fetch attendance data";

        if (err instanceof Error) {
          if (err.message.includes("fetch")) {
            errorMessage =
              "Unable to connect to the server. Please check your internet connection.";
          } else if (
            err.message.includes("401") ||
            err.message.includes("unauthorized")
          ) {
            errorMessage = "Your session has expired. Please log in again.";
          } else if (err.message.includes("403")) {
            errorMessage = "You don't have permission to access this data.";
          } else if (err.message.includes("404")) {
            errorMessage = "Attendance data not found. Please contact support.";
          } else if (err.message.includes("500")) {
            errorMessage = "Server error. Please try again later.";
          } else {
            errorMessage = err.message;
          }
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceKPIs();
  }, [accessToken, studentId, user?.studentId, user?.id, user?.userId]);

  const refetch = () => {
    const targetStudentId =
      studentId || user?.studentId || user?.id || user?.userId;
    if (accessToken && targetStudentId) {
      setIsLoading(true);
      setError(null);

      attendanceService
        .getAttendanceKPIs(targetStudentId, accessToken)
        .then(setAttendanceData)
        .catch((err) => {
          console.error("Error refetching attendance KPIs:", err);

          let errorMessage = "Failed to refresh attendance data";

          if (err instanceof Error) {
            if (err.message.includes("fetch")) {
              errorMessage =
                "Unable to connect to the server. Please check your internet connection.";
            } else if (
              err.message.includes("401") ||
              err.message.includes("unauthorized")
            ) {
              errorMessage = "Your session has expired. Please log in again.";
            } else if (err.message.includes("403")) {
              errorMessage = "You don't have permission to access this data.";
            } else if (err.message.includes("404")) {
              errorMessage =
                "Attendance data not found. Please contact support.";
            } else if (err.message.includes("500")) {
              errorMessage = "Server error. Please try again later.";
            } else {
              errorMessage = err.message;
            }
          }

          setError(errorMessage);
        })
        .finally(() => setIsLoading(false));
    }
  };

  return {
    attendanceData,
    isLoading,
    error,
    refetch,
  };
};
