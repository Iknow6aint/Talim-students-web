// services/resource.service.ts
import { API_ENDPOINTS } from "@/lib/constants";

export interface Resource {
  _id: string;
  name: string;
  subject: string;
  uploadDate: string;
  uploadedBy: string;
  type: "pdf" | "img" | "vid" | "txt";
}

export const ResourceServices = {
  getResourceDetails: async (classId: string, accessToken: string) => {
    try {
      const url = API_ENDPOINTS.RESOURCES_BY_CLASS.replace(":classId", classId);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

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
