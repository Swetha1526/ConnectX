import React from 'react';

export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg ${className}`}
      {...props}
    />
  );
};

export const PostSkeleton = () => {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800/80 p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="w-28 h-3.5" />
          <Skeleton className="w-16 h-2.5" />
        </div>
      </div>
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-4/5 h-4" />
      <Skeleton className="w-full h-64 rounded-xl" />
      <div className="flex items-center gap-6 pt-2">
        <Skeleton className="w-16 h-5" />
        <Skeleton className="w-16 h-5" />
      </div>
    </div>
  );
};

export const UserCardSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-3.5 bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="w-24 h-3.5" />
          <Skeleton className="w-16 h-2.5" />
        </div>
      </div>
      <Skeleton className="w-20 h-8 rounded-lg" />
    </div>
  );
};

export default Skeleton;
