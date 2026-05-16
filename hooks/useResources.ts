// lib/hooks/useResources.ts
"use client";

import { useState, useEffect } from "react";
import { toast } from "@/components/CustomToast";
import { useAuthContext } from "@/contexts/AuthContext";
import { API_ENDPOINTS } from "@/lib/constants";
import { authFetch } from "@/lib/authFetch";

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
          user.id || user.userId || ""
        );
        const studRes = await authFetch(studentUrl, {
          accessToken,
          headers: {
            Accept: "application/json",
          },
        });

        if (!studRes.ok) {
          throw new Error("Failed to fetch student data");
        }

        const studentData = (await studRes.json()) as {
          data: Array<{ classId: string }>;
        };

        const classId = studentData.data[0]?.classId;
        if (!classId) {
          throw new Error("No active class found for this user.");
        }

        // 2) fetch resources by class
        const resourcesUrl = API_ENDPOINTS.RESOURCES_BY_CLASS.replace(
          ":classId",
          classId
        );
        const resRes = await authFetch(resourcesUrl, {
          accessToken,
          headers: {
            Accept: "application/json",
          },
        });

        if (!resRes.ok) {
          throw new Error("Failed to fetch resources");
        }

        setResources(await resRes.json());
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
