import { Book, Award, Calendar } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import type { MetricCardProps } from "@/types/dashboard"

const icons = {
  book: Book,
  award: Award,
  calendar: Calendar,
}

export function MetricCard({ icon, value, label }: MetricCardProps) {
  const Icon = icons[icon]

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-2 flex justify-start items-center gap-2 flex-row">
          <Icon className="h-6 w-6 text-blue-600" />
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-gray-900">{value}</div>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        </div>
        <button className="mt-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          See more
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </CardContent>
    </Card>
  )
}

