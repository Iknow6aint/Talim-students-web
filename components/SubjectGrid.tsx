// components/SubjectGrid.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurriculum } from "@/hooks/useCurriculum";
import { API_BASE_URL } from "@/lib/constants";
import { Course } from "@/services/curriculum.service";
import { BookOpen, Users, Calendar, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingCard from "@/components/LoadingCard";

interface SubjectCardProps {
  course: Course;
  onViewCurriculum: (course: Course) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  course,
  onViewCurriculum,
}) => {
  const { getSubjectNameByCourse, getTeacherNameByCourse } = useCurriculum();

  const handleViewCurriculum = () => {
    onViewCurriculum(course);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-[#003366] group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#003366] to-[#004080] rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-[#003366] transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              {getSubjectNameByCourse(course)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-[#003366]">
            {course.courseCode}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 text-sm leading-relaxed">
          {course.description || "No description available"}
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {getTeacherNameByCourse(course)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {course.classId?.name || "All Classes"}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button
          onClick={handleViewCurriculum}
          className="bg-[#003366] hover:bg-[#002244] text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <span>View Curriculum</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

interface ClassCourse {
  _id: string;
  title: string;
  description: string;
  courseCode: string;
  teacherId: string;
  subjectId: string;
  classId: string;
}

interface ClassData {
  _id: string;
  name: string;
  schoolId: string;
  classTeacherId: string;
  courses: ClassCourse[];
}

const SubjectGrid: React.FC<{ classId?: string }> = ({ classId }) => {
  const router = useRouter();
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, isAuthenticated } =
    require("@/contexts/AuthContext").useAuthContext();
  // Get classId from localStorage user object if not provided
  let effectiveClassId = classId;
  if (!effectiveClassId) {
    try {
      const userStr =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (userStr) {
        const userObj = JSON.parse(userStr);
        effectiveClassId = userObj.classId;
      }
    } catch (e) {
      // fallback: leave effectiveClassId undefined
    }
  }

  useEffect(() => {
    const id = effectiveClassId || "507f1f77bcf86cd799439011"; // fallback for demo
    if (!isAuthenticated || !accessToken) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${API_BASE_URL}/classes/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch class data");
        return res.json();
      })
      .then((data) => {
        setClassData(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setClassData(null);
      })
      .finally(() => setLoading(false));
  }, [effectiveClassId, accessToken, isAuthenticated]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses =
    classData?.courses?.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    }) || [];

  if (loading) {
    return (
      <div className="px-6 py-4 h-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-[#030E18]">Loading...</h2>
          <p className="text-gray-600">
            Explore your course curriculum and materials
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingCard key={i} height="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-4 h-full">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load Class
          </h3>
          <p className="text-gray-600 text-center max-w-md mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#003366] hover:bg-[#002244] text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!classData || classData.courses.length === 0) {
    return (
      <div className="px-6 py-4 h-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-[#030E18]">No Courses</h2>
          <p className="text-gray-600">No courses found for this class.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-[#030E18]">
          {classData?.name || "Class"}
        </h2>
        <p className="text-gray-600">
          Explore your course curriculum and materials
        </p>
      </div>
      {/* Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search courses or codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent"
          />
        </div>
      </div>
      {/* Results count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredCourses.length} of {classData?.courses.length || 0}{" "}
          courses
        </p>
      </div>
      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <SubjectCard
            key={course._id}
            course={{
              ...course,
              createdAt: "",
              updatedAt: "",
              subjectId:
                typeof course.subjectId === "string"
                  ? { _id: course.subjectId, name: "", code: "" }
                  : course.subjectId,
              teacherId:
                typeof course.teacherId === "string"
                  ? {
                      _id: course.teacherId,
                      firstName: "",
                      lastName: "",
                      email: "",
                    }
                  : course.teacherId,
              classId:
                typeof course.classId === "string"
                  ? { _id: course.classId, name: "", level: "" }
                  : course.classId,
            }}
            onViewCurriculum={() =>
              router.push(`/subjects/curriculum?courseId=${course._id}`)
            }
          />
        ))}
      </div>
      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Results Found
          </h3>
          <p className="text-gray-600 text-center max-w-md">
            Try adjusting your search terms to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default SubjectGrid;
