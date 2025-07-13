// components/LoadingCard.tsx
import React from 'react';

interface LoadingCardProps {
  height?: string;
}

const LoadingCard: React.FC<LoadingCardProps> = ({ height = "h-48" }) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 animate-pulse ${height}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
          <div>
            <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </div>
      <div className="mb-4">
        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </div>
      <div className="h-10 bg-gray-300 rounded w-32"></div>
    </div>
  );
};

export default LoadingCard;
