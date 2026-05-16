// services/timetable.service.ts
import { API_ENDPOINTS } from "@/lib/constants";
import { authFetch } from "@/lib/authFetch";

export const timetableService = {
  getTimetableByClass: async (classId: string, accessToken: string) => {
    try {
      const url = API_ENDPOINTS.TIMETABLE_BY_CLASS.replace(":classId", classId);
      const response = await authFetch(url, {
        method: "GET",
        accessToken,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      // console.log(await response.json())
      return await response.json();
    } catch (error) {
      console.error("Network error:", error);
      throw error;
    }
  },
};
