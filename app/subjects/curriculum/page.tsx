'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurriculum } from '@/hooks/useCurriculum';
import { Curriculum } from '@/services/curriculum.service';
import { ArrowLeft, Download, Calendar, BookOpen, User, Clock, FileText, Paperclip, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { toast } from 'react-hot-toast';
import html2canvas from 'html2canvas';

interface CurriculumModalProps {
    isOpen: boolean;
    onClose: () => void;
    curriculum: Curriculum | null;
}

const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="mt-4 flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
            </div>
        ))}
    </div>
);

const CurriculumModal: React.FC<CurriculumModalProps> = ({ isOpen, onClose, curriculum }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    if (!isOpen || !curriculum) return null;

    const handleDownload = async () => {
        if (modalRef.current) {
            try {
                const canvas = await html2canvas(modalRef.current, {
                    background: '#ffffff',
                });
                const imgData = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = imgData;
                a.download = `${curriculum.course?.title || 'curriculum'}.png`;
                a.click();
                toast.success('Curriculum downloaded successfully!');
            } catch (error) {
                console.error('Failed to generate image:', error);
                toast.error('Failed to download curriculum');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4">
                <div ref={modalRef} className="space-y-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {curriculum.course?.title || 'Untitled Course'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <BookOpen className="w-5 h-5 text-[#003366]" />
                                <div>
                                    <p className="text-sm text-gray-600">Course Code</p>
                                    <p className="font-medium">{curriculum.course?.courseCode}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <User className="w-5 h-5 text-[#003366]" />
                                <div>
                                    <p className="text-sm text-gray-600">Teacher</p>
                                    <p className="font-medium">
                                        {curriculum.teacherId
                                            ? `${curriculum.teacherId.firstName} ${curriculum.teacherId.lastName}`
                                            : 'Unknown Teacher'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-[#003366]" />
                                <div>
                                    <p className="text-sm text-gray-600">Term</p>
                                    <p className="font-medium">{curriculum.term?.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-[#003366]" />
                                <div>
                                    <p className="text-sm text-gray-600">Last Updated</p>
                                    <p className="font-medium">
                                        {new Date(curriculum.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-[#003366]" />
                            <h3 className="text-lg font-semibold text-gray-900">Curriculum Content</h3>
                        </div>
                        <div
                            className="prose max-w-none break-words text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: curriculum.content }}
                        />
                    </div>

                    {curriculum.attachments && curriculum.attachments.length > 0 && (
                        <div className="border-t pt-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Paperclip className="w-5 h-5 text-[#003366]" />
                                <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
                            </div>
                            <div className="space-y-2">
                                {curriculum.attachments.map((attachment, index) => (
                                    <a
                                        key={index}
                                        href={attachment}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-[#003366] hover:text-[#002244] transition-colors"
                                    >
                                        <Paperclip className="w-4 h-4" />
                                        <span className="text-sm">Attachment {index + 1}</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-end gap-4 pt-6 border-t">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="px-6 py-2"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleDownload}
                        className="bg-[#003366] hover:bg-[#002244] text-white px-6 py-2 flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </Button>
                </div>
            </div>
        </div>
    );
};

const CurriculumPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { fetchCurriculumByCourse, isLoading, error } = useCurriculum();
    const [curricula, setCurricula] = useState<Curriculum[]>([]);
    const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const courseId = searchParams.get('courseId');
    const courseTitle = searchParams.get('courseTitle');
    const courseCode = searchParams.get('courseCode');

    useEffect(() => {
        if (courseId) {
            fetchCurriculumByCourse(courseId).then((data) => {
                if (data) {
                    setCurricula(data);
                }
            });
        }
    }, [courseId]);

    const handleCurriculumClick = (curriculum: Curriculum) => {
        setSelectedCurriculum(curriculum);
        setIsModalOpen(true);
    };

    const handleBackToSubjects = () => {
        router.push('/subjects');
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <Button
                                onClick={handleBackToSubjects}
                                variant="outline"
                                className="flex items-center gap-2 mb-4"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Subjects
                            </Button>
                            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                        </div>
                        <SkeletonLoader />
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                    <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <BookOpen className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Curriculum</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <div className="flex gap-3 justify-center">
                            <Button
                                onClick={handleBackToSubjects}
                                variant="outline"
                            >
                                Back to Subjects
                            </Button>
                            <Button
                                onClick={() => window.location.reload()}
                                className="bg-[#003366] hover:bg-[#002244] text-white"
                            >
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 p-8">
                <CurriculumModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    curriculum={selectedCurriculum}
                />

                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <Button
                            onClick={handleBackToSubjects}
                            variant="outline"
                            className="flex items-center gap-2 mb-4 hover:bg-gray-100"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Subjects
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {courseTitle ? decodeURIComponent(courseTitle) : 'Course Curriculum'}
                        </h1>
                        <p className="text-gray-600">
                            {courseCode ? `Course Code: ${decodeURIComponent(courseCode)}` : 'View and download curriculum materials'}
                        </p>
                    </div>

                    {curricula.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Curriculum Available</h3>
                            <p className="text-gray-600 mb-4">
                                There is no curriculum content available for this course yet.
                            </p>
                            <Button
                                onClick={handleBackToSubjects}
                                className="bg-[#003366] hover:bg-[#002244] text-white"
                            >
                                Back to Subjects
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {curricula.map((curriculum) => (
                                <div
                                    key={curriculum._id}
                                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-[#003366] cursor-pointer group"
                                    onClick={() => handleCurriculumClick(curriculum)}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-[#003366] to-[#004080] rounded-lg flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 group-hover:text-[#003366] transition-colors">
                                                    {curriculum.course?.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {curriculum.term?.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div
                                            className="text-gray-700 text-sm line-clamp-3"
                                            dangerouslySetInnerHTML={{
                                                __html: curriculum.content.substring(0, 150) + '...'
                                            }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            <span>
                                                {curriculum.teacherId
                                                    ? `${curriculum.teacherId.firstName} ${curriculum.teacherId.lastName}`
                                                    : 'Unknown'
                                                }
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {new Date(curriculum.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {curriculum.attachments && curriculum.attachments.length > 0 && (
                                        <div className="mt-3 pt-3 border-t">
                                            <div className="flex items-center gap-1 text-sm text-[#003366]">
                                                <Paperclip className="w-4 h-4" />
                                                <span>{curriculum.attachments.length} attachment(s)</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default CurriculumPage;
