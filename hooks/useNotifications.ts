// hooks/useNotifications.ts
"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { NotificationsResponse } from "@/types/auth";
import { notificationService } from "@/services/notification.service";

export const useNotifications = (page: number = 1, limit: number = 10) => {
  const { accessToken, isAuthenticated } = useAuthContext();
  const [notifications, setNotifications] = useState<NotificationsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!isAuthenticated || !accessToken) {
      toast.error("User not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications(accessToken, page, limit);
      setNotifications(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load notifications";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [accessToken, isAuthenticated, page, limit]);

  return { notifications, isLoading };
};