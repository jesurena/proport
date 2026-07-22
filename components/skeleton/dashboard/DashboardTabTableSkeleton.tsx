'use client';

import React from 'react';
import { AppSkeleton } from '@/components/ui/skeleton';

export function DashboardTabTableSkeleton() {
  return (
    <div className="border border-border/60 rounded-2xl bg-card-bg shadow-sm overflow-hidden w-full">
      {/* Table Header Row */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral/50 border-b border-border/40">
        <div className="w-[180px] shrink-0">
          <AppSkeleton variant="text" width={60} height={12} className="rounded" />
        </div>
        <div className="flex-1 flex justify-around gap-4">
          <AppSkeleton variant="text" width={40} height={12} className="rounded" />
          <AppSkeleton variant="text" width={75} height={12} className="rounded" />
          <AppSkeleton variant="text" width={75} height={12} className="rounded" />
          <AppSkeleton variant="text" width={75} height={12} className="rounded" />
          <AppSkeleton variant="text" width={80} height={12} className="rounded" />
          <AppSkeleton variant="text" width={80} height={12} className="rounded" />
        </div>
      </div>

      {/* Table Body Rows */}
      <div className="divide-y divide-border/30">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3.5">
            {/* First column: Avatar + Name layout */}
            <div className="w-[180px] shrink-0 flex items-center gap-2.5">
              <AppSkeleton variant="circular" width={24} height={24} />
              <AppSkeleton variant="text" width={100} height={14} className="rounded" />
            </div>
            
            {/* Value columns */}
            <div className="flex-1 flex justify-around gap-4">
              <AppSkeleton variant="text" width={25} height={14} className="rounded" />
              <AppSkeleton variant="text" width={25} height={14} className="rounded" />
              <AppSkeleton variant="text" width={25} height={14} className="rounded" />
              <AppSkeleton variant="text" width={25} height={14} className="rounded" />
              <AppSkeleton variant="text" width={25} height={14} className="rounded" />
              <AppSkeleton variant="text" width={25} height={14} className="rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Table Pagination Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border/40 bg-card-bg">
        <AppSkeleton variant="text" width={100} height={12} className="rounded" />
        <div className="flex items-center gap-1.5">
          <AppSkeleton variant="circular" width={24} height={24} />
          <AppSkeleton variant="circular" width={24} height={24} />
          <AppSkeleton variant="circular" width={24} height={24} />
        </div>
      </div>
    </div>
  );
}
