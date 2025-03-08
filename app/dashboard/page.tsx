"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MetricCard } from "@/components/metric-card"
import { ScheduleTimeline } from "@/components/schedule-timeline"
import Layout from '@/components/Layout'
import Image from 'next/image';
import { Header } from '@/components/header'
import nookies from "nookies";

const schedule = [
  { subject: "Mathematics", startTime: "08:00", endTime: "10:00" },
  { subject: "Civic Education", startTime: "10:00", endTime: "11:00" },
  { subject: "C.R.S", startTime: "11:00", endTime: "12:00" },
  { subject: "BREAK - TIME", startTime: "12:00", endTime: "01:00" },
  { subject: "English language", startTime: "01:00", endTime: "02:00" },
]

const metrics = {
  subjects: 15,
  gradeScore: 85,
  attendancePercentage: 95,
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const cookies = nookies.get(null);
        const accessToken = cookies.access_token;
        console.log('Checking auth token:', accessToken ? 'Token exists' : 'No token');

        if (!accessToken) {
          console.log('No access token found, redirecting to login...');
          window.location.href = '/';
          return false;
        }

        return true;
      } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/';
        return false;
      }
    };

    const isAuthenticated = checkAuth();
    if (isAuthenticated) {
      console.log('User is authenticated, showing dashboard');
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="relative w-full h-full bg-[#F8F8F8] px-4 overflow-hidden">
        <div className="h-full mx-auto flex flex-col space-y-5 2xl:space-y-8">
          {/* Header */}
          <Header/>
          {/* Overview */}
          <div className="flex-grow ">
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                icon={<Image src="/icons/dashboard/subject.svg" width={52} height={52} alt="Subjects Icon" className="h-[52px] w-[52px]" />}
                value={metrics.subjects}
                label="Subjects Enrolled"
              />
              <MetricCard
                icon={<img src="/icons/dashboard/award.svg" alt="Award Icon" className="h-[52px] w-[52px]" />}
                value={`${metrics.gradeScore}%`}
                label="Grade Score"
              />
              <MetricCard
                icon={<img src="/icons/dashboard/calendar.svg" alt="Award Icon" className="h-[52px] w-[52px]" />}
                value={`${metrics.attendancePercentage}%`}
                label="Attendance Percentage"
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="flex-grow">
            <ScheduleTimeline schedule={schedule} currentTime="9:12" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
