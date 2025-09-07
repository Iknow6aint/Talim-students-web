// services/resource.service.ts
import { API_ENDPOINTS } from "@/lib/constants";

export interface Resource {
  _id: string;
  name: string;
  classId: {
    _id: string;
    name: string;
    schoolId: {
      _id: string;
      name: string;
      email: string;
      physicalAddress: string;
      location: {
        country: string;
        state: string;
        _id: string;
      };
      schoolPrefix: string;
      primaryContacts: Array<{
        name: string;
        phone: string;
        email: string;
        role: string;
        _id: string;
      }>;
      active: boolean;
      logo: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
    classDescription: string;
    assignedCourses: string[];
    classTeacherId: {
      _id: string;
      userId: {
        _id: string;
        email: string;
        firstName: string;
        lastName: string;
        id: string;
      };
      assignedClasses: string[];
      assignedCourses: string[];
      isFormTeacher: boolean;
      isActive: boolean;
      highestAcademicQualification: string;
      yearsOfExperience: number;
      specialization: string;
      employmentType: string;
      employmentRole: string;
      availabilityDays: string[];
      availableTime: string;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
  };
  courseId: {
    _id: string;
    description: string;
    id: string;
  } | null;
  uploadedBy: string | null;
  termId: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  uploadDate: string;
  image: string;
  files: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
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
