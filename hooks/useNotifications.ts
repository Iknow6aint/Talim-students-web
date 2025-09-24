// hooks/useNotifications.ts
"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
// Define AnnouncementResponse type inline or import from types if available
interface Notification {
  _id: string;
  title: string;
  content: string;
  createdBy: string;
  senderId: string;
  attachment?: string;
  targetAudience: string[];
  schoolId: string;
  status: string;
  reactions: Record<string, number>;
  userReactions: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  // ...other fields
}

interface NotificationResponse {
  data: Notification[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
}
import { notificationService } from "@/services/notification.service";

export const useNotifications = (page: number = 1, limit: number = 10) => {
  const { accessToken, isAuthenticated, user } = useAuthContext();
  const [notifications, setNotifications] =
    useState<NotificationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnnouncements = async () => {
    if (!isAuthenticated || !accessToken || !user?.userId) {
      toast.error("User not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await notificationService.getAnnouncements(
        accessToken,
        user.userId,
        page,
        limit
      );
      setNotifications(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load announcements";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [accessToken, isAuthenticated, user?.userId, page, limit]);

  return { notifications: notifications, isLoading };
};
