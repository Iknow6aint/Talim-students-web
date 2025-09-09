import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { gradesService, StudentKPIData } from "@/services/grades.service";

export const useStudentGradeKPIs = () => {
  const [kpiData, setKpiData] = useState<StudentKPIData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, accessToken } = useAuthContext();

  useEffect(() => {
    const fetchStudentKPIs = async () => {
      if (!accessToken) {
        setError("No access token available");
        setIsLoading(false);
        return;
      }

      const studentId = user?.studentId;

      if (!studentId) {
        setError("Student ID not available");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const data = await gradesService.getStudentKPIs(studentId, accessToken);

        setKpiData(data);
      } catch (err) {
        console.error("Error fetching student KPIs:", err);

        let errorMessage = "Failed to fetch academic performance data";

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
            errorMessage = "Academic data not found. Please contact support.";
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

    fetchStudentKPIs();
  }, [accessToken, user?.studentId]);

  const refetch = () => {
    const studentId = user?.studentId;

    if (accessToken && studentId) {
      setIsLoading(true);
      setError(null);

      gradesService
        .getStudentKPIs(studentId, accessToken)
        .then(setKpiData)
        .catch((err) => {
          console.error("Error refetching student KPIs:", err);

          let errorMessage = "Failed to refresh academic performance data";

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
              errorMessage = "Academic data not found. Please contact support.";
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
    kpiData,
    isLoading,
    error,
    refetch,
  };
};
