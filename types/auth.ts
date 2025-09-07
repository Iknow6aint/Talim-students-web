// types/auth.ts
export interface LoginCredentials {
  email: string;
  password: string;
  deviceToken: string;
  platform: string;
}

export interface User {
  id?: string; // For backward compatibility
  userId?: string; // From introspect response
  firstName: string;
  lastName: string;
  email: string;
  name?: string;
  phoneNumber?: string;
  role?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  schoolId?: string;
  schoolName?: string;
  studentId?: string; // The actual student profile ID
  [key: string]: any;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface StudentDetails {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  schoolId: string;
  phoneNumber: string;
  isActive: boolean;
  isEmailVerified: boolean;
}

export interface IntrospectResponse {
  active: boolean;
  exp: number;
  iat: number;
  user: StudentDetails;
}

export interface ParentContact {
  fullName: string;
  phoneNumber: string;
  email: string;
  relationship: string;
  _id: string;
}

export interface ClassDetails {
  _id: string;
  name: string;
}

export interface AcademicDetails {
  _id: string;
  userId: string;
  classId: string;
  gradeLevel: string;
  parentContact: ParentContact;
  isActive: boolean;
  userDetails: {
    _id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  classDetails: ClassDetails;
}

export interface AcademicResponse {
  data: AcademicDetails[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
}

export interface AttendanceDashboard {
  studentId: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  attendancePercentage: string;
  records: any[];
}

export interface Sender {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  id: string;
}

export interface TargetSchool {
  _id: string;
  name: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  attachments: string[];
  senderId: Sender;
  recipientRoles: string[];
  targetSchools: TargetSchool[];
  status: string;
  priority: string;
  readBy: string[];
  isScheduled: boolean;
  scheduledFor: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NotificationsResponse {
  data: Notification[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
}

export interface TimetableEntry {
  time: string;
  startTIme: string; // API typo, keeping as is
  endTime: string;
  course: string;
  subject: string;
  class: string;
}

export interface Timetable {
  Monday?: TimetableEntry[];
  Tuesday?: TimetableEntry[];
  Wednesday?: TimetableEntry[];
  Thursday?: TimetableEntry[];
  Friday?: TimetableEntry[];
  Saturday?: TimetableEntry[];
  Sunday?: TimetableEntry[];
}
