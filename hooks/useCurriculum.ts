// hooks/useCurriculum.ts
'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { curriculumService, Course, Curriculum, Subject } from '@/services/curriculum.service';
import { studentService } from '@/services/student.service';
import { toast } from 'react-hot-toast';
import { AcademicResponse } from '@/types/auth';

export const useCurriculum = () => {
  const { accessToken, isAuthenticated, user } = useAuthContext();
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
  const [studentClassId, setStudentClassId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch student details to get class ID
  const fetchStudentDetails = async () => {
    if (!accessToken || !isAuthenticated || !user?.id) return;

    try {
      console.log(`Hook: Fetching student details for user: ${user.id}`);
      const studentData: AcademicResponse = await studentService.getAcademicDetails(user.id, accessToken);
      console.log(`Hook: Student data received:`, studentData);
      
      const classId = studentData.data[0]?.classId;
      console.log(`Hook: Extracted class ID: ${classId}`);
      
      if (classId) {
        setStudentClassId(classId);
        console.log(`Hook: Set student class ID to: ${classId}`);
      } else {
        console.error('Hook: No class ID found in student data');
      }
    } catch (err: any) {
      console.error('Hook: Failed to fetch student details:', err);
      setError(err.message || 'Failed to fetch student details');
    }
  };

  // Fetch courses by student's class ID
  const fetchCoursesByClass = async () => {
    if (!accessToken || !isAuthenticated || !studentClassId) {
      console.log('Hook: Missing requirements for fetching courses by class', {
        accessToken: !!accessToken,
        isAuthenticated,
        studentClassId
      });
      return;
    }

    console.log(`Hook: Fetching courses for class ID: ${studentClassId}`);
    setIsLoading(true);
    setError(null);

    try {
      const coursesData = await curriculumService.getCoursesByClass(accessToken, studentClassId);
      console.log(`Hook: Received ${coursesData.length} courses:`, coursesData);
      setCourses(coursesData);
    } catch (err: any) {
      console.error('Hook: Error fetching courses by class:', err);
      setError(err.message || 'Failed to fetch courses');
      toast.error(err.message || 'Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all courses for the school (fallback)
  const fetchCourses = async () => {
    if (!accessToken || !isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const coursesData = await curriculumService.getCourses(accessToken);
      setCourses(coursesData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch courses');
      toast.error(err.message || 'Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all subjects for the school
  const fetchSubjects = async () => {
    if (!accessToken || !isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const subjectsData = await curriculumService.getSubjects(accessToken);
      setSubjects(subjectsData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch subjects');
      toast.error(err.message || 'Failed to fetch subjects');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch curriculum for a specific course
  const fetchCurriculumByCourse = async (courseId: string) => {
    if (!accessToken || !isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const curriculumData = await curriculumService.getCurriculumByCourse(courseId, accessToken);
      setCurricula(curriculumData);
      return curriculumData;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch curriculum');
      toast.error(err.message || 'Failed to fetch curriculum');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch curriculum by ID
  const fetchCurriculumById = async (curriculumId: string) => {
    if (!accessToken || !isAuthenticated) return null;

    setIsLoading(true);
    setError(null);

    try {
      const curriculumData = await curriculumService.getCurriculumById(curriculumId, accessToken);
      setSelectedCurriculum(curriculumData);
      return curriculumData;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch curriculum');
      toast.error(err.message || 'Failed to fetch curriculum');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all curricula
  const fetchAllCurricula = async () => {
    if (!accessToken || !isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const curriculumData = await curriculumService.getAllCurricula(accessToken);
      setCurricula(curriculumData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch curricula');
      toast.error(err.message || 'Failed to fetch curricula');
    } finally {
      setIsLoading(false);
    }
  };

  // Group courses by subject
  const getCoursesBySubject = () => {
    const grouped: { [key: string]: Course[] } = {};
    
    courses.forEach(course => {
      const subjectName = course.subjectId?.name || 'Unknown Subject';
      if (!grouped[subjectName]) {
        grouped[subjectName] = [];
      }
      grouped[subjectName].push(course);
    });

    return grouped;
  };

  // Get subject name by course
  const getSubjectNameByCourse = (course: Course) => {
    return course.subjectId?.name || 'Unknown Subject';
  };

  // Get teacher name by course
  const getTeacherNameByCourse = (course: Course) => {
    if (course.teacherId) {
      return `${course.teacherId.firstName} ${course.teacherId.lastName}`;
    }
    return 'Unknown Teacher';
  };

  // Initialize data on mount
  // Fetch student details on mount
  useEffect(() => {
    if (isAuthenticated && accessToken && user?.id) {
      fetchStudentDetails();
    }
  }, [isAuthenticated, accessToken, user?.id]);

  // Fetch courses by class when student class ID is available
  useEffect(() => {
    if (studentClassId) {
      fetchCoursesByClass();
    }
  }, [studentClassId]);

  // Fetch subjects when authenticated
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      fetchSubjects();
    }
  }, [isAuthenticated, accessToken]);

  return {
    courses,
    subjects,
    curricula,
    selectedCourse,
    selectedCurriculum,
    studentClassId,
    isLoading,
    error,
    fetchCourses,
    fetchCoursesByClass,
    fetchSubjects,
    fetchCurriculumByCourse,
    fetchCurriculumById,
    fetchAllCurricula,
    setSelectedCourse,
    setSelectedCurriculum,
    getCoursesBySubject,
    getSubjectNameByCourse,
    getTeacherNameByCourse
  };
};
