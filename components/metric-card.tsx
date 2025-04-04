import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { MetricCardProps } from "@/types/dashboard";

export function MetricCard({ icon, value, label, message, link }: MetricCardProps) {
  return (
    <Card className="overflow-hidden border border-[#F0F0F0] shadow-none">
      <CardContent className="pt-6 pb-4">
        <div className="space-y-2 flex mb-6 justify-start items-center gap-2 flex-row">
          <div className="flex justify-center items-center text-blue-600">
            {icon}
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-medium text-[#030E18]">{value}</div>
            <p className="text-sm text-[#6F6F6F]">{label}</p>
          </div>
        </div>
        {/* Horizontal line */}
        <div className="h-px -mx-6 bg-gray-200" />
        
        {/* Conditionally render link */}
        {link ? (
          <Link href={link} className="mt-4 inline-flex w-full justify-between items-center text-sm text-[#606060] hover:text-gray-900">
            {message}
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <button className="mt-4 inline-flex w-full justify-between items-center text-sm text-[#606060] hover:text-gray-900">
            {message}
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </CardContent>
    </Card>
  );
}
