// lib/hooks/useResources.ts
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import { API_ENDPOINTS } from "@/lib/constants";

// Re‐use your shared Resource type if you have one, otherwise:
export interface Resource {
  _id: string;
  name: string;
  classId: string;
  termId: string;
  uploadDate: string;
  image: string;
  files: string[];
  createdAt: string;
  updatedAt: string;
}

export function useResources() {
  const { user, accessToken, isAuthenticated } = useAuthContext();

  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // only fetch once we know the user & token
    if (!isAuthenticated || !user?.id || !accessToken) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      setLoading(true);

      try {
        // 1) fetch student → classId
        const studentUrl = API_ENDPOINTS.STUDENTS_BY_USER.replace(
          ":userId",
          user.id
        );
        const studRes = await axios.get<{ data: Array<{ classId: string }> }>(
          studentUrl,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          }
        );

        const classId = studRes.data.data[0]?.classId;
        if (!classId) {
          throw new Error("No active class found for this user.");
        }

        // 2) fetch resources by class
        const resourcesUrl = API_ENDPOINTS.RESOURCES_BY_CLASS.replace(
          ":classId",
          classId
        );
        const resRes = await axios.get<Resource[]>(resourcesUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        });

        setResources(resRes.data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load resources";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user, accessToken, isAuthenticated]);

  return { resources, isLoading };
}
