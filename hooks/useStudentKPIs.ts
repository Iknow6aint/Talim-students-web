import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { studentService } from "@/services/student.service";

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
  attendancePercentage: number;
  additionalMetrics: {
    totalAssessments: number;
    completedAssessments: number;
    currentTerm: {
      id: string;
      name: string;
    };
    classRank: number;
    totalStudentsInClass: number;
  };
}

export const useStudentKPIs = (studentId?: string, termId?: string) => {
  const [kpiData, setKpiData] = useState<StudentKPIData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, accessToken } = useAuthContext();

  useEffect(() => {
    const fetchKPIs = async () => {
      if (!accessToken) {
        setError("No access token available");
        setIsLoading(false);
        return;
      }

      // Use provided studentId or get from user context
      // Priority: explicit studentId > user.studentId > user.id > user.userId
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

        const data = await studentService.getDashboardKPIs(
          targetStudentId,
          accessToken,
          termId
        );

        setKpiData(data);
      } catch (err) {
        console.error("Error fetching student KPIs:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch student KPIs"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchKPIs();
  }, [accessToken, studentId, user?.studentId, user?.id, user?.userId, termId]);

  const refetch = () => {
    const targetStudentId =
      studentId || user?.studentId || user?.id || user?.userId;
    if (accessToken && targetStudentId) {
      setIsLoading(true);
      studentService
        .getDashboardKPIs(targetStudentId, accessToken, termId)
        .then(setKpiData)
        .catch((err) =>
          setError(
            err instanceof Error ? err.message : "Failed to fetch student KPIs"
          )
        )
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
