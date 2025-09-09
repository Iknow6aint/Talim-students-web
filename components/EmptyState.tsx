import { BookOpen, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "No Data Available",
  message = "There's no data to display right now.",
  actionLabel = "Refresh",
  onAction,
  icon,
}: EmptyStateProps) {
  const defaultIcon = (
    <div className="flex items-center space-x-1">
      <BookOpen className="h-6 w-6" />
      <TrendingUp className="h-6 w-6" />
      <Calendar className="h-6 w-6" />
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
      <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full">
        <div className="text-gray-400">{icon || defaultIcon}</div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 max-w-md">{message}</p>
      </div>

      {onAction && (
        <Button onClick={onAction} variant="outline" className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
