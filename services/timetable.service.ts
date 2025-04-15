// services/timetable.service.ts
import { API_ENDPOINTS } from "@/lib/constants";

export const timetableService = {
  getTimetableByClass: async (classId: string, accessToken: string) => {
    try {
      const url = API_ENDPOINTS.TIMETABLE_BY_CLASS.replace(":classId", classId);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw error;
    }
  },
};