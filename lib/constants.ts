// lib/constants.ts
export const API_BASE_URL = "https://talimbe-v2-li38.onrender.com";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  INTROSPECT: `${API_BASE_URL}/auth/introspect`,
  STUDENTS_BY_USER: `${API_BASE_URL}/students/by-user/:userId`,
  ATTENDANCE_DASHBOARD: `${API_BASE_URL}/attendance/dashboard/:studentId`,
  NOTIFICATIONS: `${API_BASE_URL}/notifications`,
  TIMETABLE_BY_CLASS: `${API_BASE_URL}/timetable/class/:classId`,
} as const;