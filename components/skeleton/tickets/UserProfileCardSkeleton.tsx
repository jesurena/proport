'use client';

import React from 'react';
import { AppSkeleton } from '@/components/ui/skeleton';

export function UserProfileCardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Top Header Row */}
      <div className="flex items-start gap-3.5 pt-1">
        {/* Avatar Skeleton */}
        <AppSkeleton variant="circular" width={92} height={92} />

        {/* Info Rows */}
        <div className="flex-1 space-y-2.5 pt-1">
          {/* Name */}
          <AppSkeleton variant="text" width="65%" height={20} className="mb-3" />

          {/* Group */}
          <div className="flex items-center gap-2">
            <AppSkeleton variant="circular" width={14} height={14} />
            <AppSkeleton variant="text" width="75%" height={12} />
          </div>

          {/* Role */}
          <div className="flex items-center gap-2">
            <AppSkeleton variant="circular" width={14} height={14} />
            <AppSkeleton variant="text" width="60%" height={12} />
          </div>

          {/* Email */}
          <div className="flex items-center gap-2">
            <AppSkeleton variant="circular" width={14} height={14} />
            <AppSkeleton variant="text" width="85%" height={12} />
          </div>

          {/* Tickets count */}
          <div className="flex items-center gap-2 pt-0.5">
            <AppSkeleton variant="rounded" width={14} height={14} />
            <AppSkeleton variant="text" width="50%" height={12} />
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex items-center gap-2 pt-1">
        <AppSkeleton variant="rounded" height={36} className="flex-1" />
        <AppSkeleton variant="rounded" width={36} height={36} />
      </div>
    </div>
  );
}
