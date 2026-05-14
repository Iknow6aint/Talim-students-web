import { API_ENDPOINTS } from "@/lib/constants";

type NotificationQuery = {
  page?: number;
  limit?: number;
  recipientId?: string;
  source?: string;
  category?: string;
  type?: string;
};

const buildQuery = (params: NotificationQuery = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

const request = async <T>(
  accessToken: string,
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || errorData?.error || `HTTP error! status: ${response.status}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};

export const notificationService = {
  getNotifications: async (
    accessToken: string,
    params: NotificationQuery = {},
  ) => {
    return request(
      accessToken,
      `${API_ENDPOINTS.NOTIFICATIONS}${buildQuery({
        page: 1,
        limit: 10,
        ...params,
      })}`,
    );
  },

  getAnnouncements: async (
    accessToken: string,
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) => {
    return request(
      accessToken,
      `${API_ENDPOINTS.NOTIFICATIONS}/announcements/receiver/${userId}${buildQuery({
        page,
        limit,
      })}`,
    );
  },

  markNotificationAsRead: async (
    accessToken: string,
    notificationId: string,
    userId: string,
  ) => {
    return request(
      accessToken,
      `${API_ENDPOINTS.NOTIFICATIONS}/${notificationId}/read`,
      {
        method: "PUT",
        body: JSON.stringify({ userId }),
      },
    );
  },

  markAnnouncementAsRead: async (
    accessToken: string,
    announcementId: string,
    userId: string,
  ) => {
    return request(
      accessToken,
      `${API_ENDPOINTS.NOTIFICATIONS}/announcements/${announcementId}/read`,
      {
        method: "PUT",
        body: JSON.stringify({ userId }),
      },
    );
  },
};
