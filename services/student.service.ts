import { API_BASE_URL } from "@/lib/constants";
import { authFetch } from "@/lib/authFetch";

// services/student.service.ts
export const studentService = {
  getAcademicDetails: async (userId: string, accessToken: string) => {
    const response = await authFetch(`${API_BASE_URL}/students/by-user/${userId}`, {
      method: "GET",
      accessToken,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch academic details");
    }

    return response.json();
  },

  getDashboardKPIs: async (
    studentId: string,
    accessToken: string,
    termId?: string
  ) => {
    const url = new URL(`${API_BASE_URL}/students/${studentId}/dashboard/kpis`);
    if (termId) {
      url.searchParams.append("termId", termId);
    }

    const response = await authFetch(url.toString(), {
      method: "GET",
      accessToken,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch dashboard KPIs");
    }

    return response.json();
  },
};
