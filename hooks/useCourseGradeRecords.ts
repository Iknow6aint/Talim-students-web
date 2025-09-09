import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { gradesService, CourseGradeRecord } from "@/services/grades.service";

export const useCourseGradeRecords = () => {
  const [gradeRecords, setGradeRecords] = useState<CourseGradeRecord[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, accessToken } = useAuthContext();

  useEffect(() => {
    const fetchGradeRecords = async () => {
      if (!accessToken) {
        setError("No access token available");
        setIsLoading(false);
        return;
      }

      // Get studentId and termId from user context
      const studentId = user?.studentId;
      const termId = user?.termId;

      if (!studentId || !termId) {
        setError("Student ID or Term ID not available");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const data = await gradesService.getCourseGradeRecords(
          studentId,
          termId,
          accessToken
        );

        setGradeRecords(data);
      } catch (err) {
        console.error("Error fetching grade records:", err);

        let errorMessage = "Failed to fetch grade records";

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
            errorMessage = "Grade records not found. Please contact support.";
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

    fetchGradeRecords();
  }, [accessToken, user?.studentId, user?.termId]);

  const refetch = () => {
    const studentId = user?.studentId;
    const termId = user?.termId;

    if (accessToken && studentId && termId) {
      setIsLoading(true);
      setError(null);

      gradesService
        .getCourseGradeRecords(studentId, termId, accessToken)
        .then(setGradeRecords)
        .catch((err) => {
          console.error("Error refetching grade records:", err);

          let errorMessage = "Failed to refresh grade records";

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
              errorMessage = "Grade records not found. Please contact support.";
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
    gradeRecords,
    isLoading,
    error,
    refetch,
  };
};
