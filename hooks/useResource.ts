"use client";
import { useAuthContext } from "@/contexts/AuthContext";
import { API_ENDPOINTS } from "@/lib/constants";
import { Resource, ResourceServices } from "@/services/resource.service";
import { AcademicResponse } from "@/types/auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useResources = () => {
  const { user, accessToken, isAuthenticated } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]); // Fetch from the interface

  const FetchResource = async () => {
    if (!isAuthenticated || !user?.userId || !accessToken) {
      toast.error("User not authenticated");
      return;
    }

    setIsLoading(true);

    try {
      // Fetch student details
      const studentUrl = API_ENDPOINTS.STUDENTS_BY_USER.replace(
        ":userId",
        user.userId
      );
      const studentResponse = await fetch(studentUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!studentResponse.ok) {
        throw new Error("Failed to fetch student data");
      }

      const studentData: AcademicResponse = await studentResponse.json();
      const classId = studentData.data[0]?.classId;

      if (!classId) {
        throw new Error("Class ID not found");
      }

      const resourceData = await ResourceServices.getResourceDetails(
        classId,
        accessToken
      );

      setResources(resourceData); // this one go store am for state
      console.log(resourceData);

      return resourceData;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load resource";
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    FetchResource();
  }, [user, accessToken, isAuthenticated]);

  return { isLoading, resources };
};
