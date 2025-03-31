import type { ReactNode } from "react"
export interface MetricCardProps {
    icon?: ReactNode;
    value: string | number
    label: string
    message: React.ReactNode;
    link?: string
  }
  
  export interface ScheduleItem {
    subject: string
    startTime: string
    endTime: string
  }
  
  export interface ScheduleTimelineProps {
    schedule: ScheduleItem[]
    currentTime: string
  }
  
  export interface DashboardProps {
    metrics: {
      subjects: number
      gradeScore: number
      attendancePercentage: number
    }
  }
  
  