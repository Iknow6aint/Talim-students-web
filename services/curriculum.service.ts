import { API_ENDPOINTS } from "@/lib/constants";

// services/curriculum.service.ts
export interface Course {
  _id: string;
  title: string;
  description: string;
  courseCode: string;
  subjectId?: {
    _id: string;
    name: string;
    code: string;
  };
  teacherId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  classId?: {
    _id: string;
    name: string;
    level: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  _id: string;
  name: string;
  code: string;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Curriculum {
  _id: string;
  course: {
    _id: string;
    title: string;
    description: string;
    courseCode: string;
  };
  term: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
  };
  content: string;
  attachments: string[];
  teacherId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

export const curriculumService = {
  // Get all courses for the school
  getCourses: async (accessToken: string): Promise<Course[]> => {
    const response = await fetch(API_ENDPOINTS.COURSES_BY_SCHOOL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch courses');
    }

    return response.json();
  },

  // Get courses by class ID
  getCoursesByClass: async (accessToken: string, classId: string): Promise<Course[]> => {
    console.log(`Service: Getting courses for class ID: ${classId}`);
    const endpoint = API_ENDPOINTS.COURSES_BY_CLASS.replace(':classId', classId);
    console.log(`Service: Endpoint: ${endpoint}`);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`Service: Response status: ${response.status}`);

    if (response.status === 401) {
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Service: Error response:`, errorData);
      throw new Error(errorData.message || 'Failed to fetch courses by class');
    }

    const data = await response.json();
    console.log(`Service: Received ${data.length} courses:`, data);
    return data;
  },

  // Get all subjects for the school
  getSubjects: async (accessToken: string): Promise<Subject[]> => {
    const response = await fetch(API_ENDPOINTS.SUBJECTS_BY_SCHOOL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch subjects');
    }

    return response.json();
  },

  // Get curriculum by course ID
  getCurriculumByCourse: async (courseId: string, accessToken: string): Promise<Curriculum[]> => {
    const url = API_ENDPOINTS.CURRICULUM_BY_COURSE.replace(':courseId', courseId);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch curriculum');
    }

    return response.json();
  },

  // Get curriculum by ID
  getCurriculumById: async (curriculumId: string, accessToken: string): Promise<Curriculum> => {
    const response = await fetch(`${API_ENDPOINTS.CURRICULUM_BASE}/${curriculumId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch curriculum');
    }

    return response.json();
  },

  // Get all curricula for the school
  getAllCurricula: async (accessToken: string): Promise<Curriculum[]> => {
    const response = await fetch(API_ENDPOINTS.CURRICULUM_BASE, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch curricula');
    }

    return response.json();
  }
};
