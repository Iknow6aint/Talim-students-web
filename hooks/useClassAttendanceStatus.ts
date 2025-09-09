import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  attendanceService,
  ClassAttendanceStatus,
} from "@/services/attendance.service";

export const useClassAttendanceStatus = (date?: string) => {
  const [classAttendanceData, setClassAttendanceData] =
    useState<ClassAttendanceStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, accessToken } = useAuthContext();

  useEffect(() => {
    const fetchClassAttendanceStatus = async () => {
      if (!accessToken) {
        setError("No access token available");
        setIsLoading(false);
        return;
      }

      // Get classId from user context
      const classId = user?.classId;

      if (!classId) {
        setError("No class ID available");
        setIsLoading(false);
        return;
      }

      // Use provided date or today's date
      const targetDate = date || new Date().toISOString().split("T")[0];

      try {
        setIsLoading(true);
        setError(null);

        const data = await attendanceService.getClassAttendanceStatus(
          classId,
          targetDate,
          accessToken
        );

        setClassAttendanceData(data);
      } catch (err) {
        console.error("Error fetching class attendance status:", err);

        // Provide more specific error messages
        let errorMessage = "Failed to fetch class attendance data";

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
            errorMessage = "Class attendance data not found.";
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

    fetchClassAttendanceStatus();
  }, [accessToken, user?.classId, date]);

  const refetch = (newDate?: string) => {
    const classId = user?.classId;
    const targetDate =
      newDate || date || new Date().toISOString().split("T")[0];

    if (accessToken && classId) {
      setIsLoading(true);
      setError(null);

      attendanceService
        .getClassAttendanceStatus(classId, targetDate, accessToken)
        .then(setClassAttendanceData)
        .catch((err) => {
          console.error("Error refetching class attendance status:", err);

          let errorMessage = "Failed to refresh class attendance data";

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
              errorMessage = "Class attendance data not found.";
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
    classAttendanceData,
    isLoading,
    error,
    refetch,
  };
};
