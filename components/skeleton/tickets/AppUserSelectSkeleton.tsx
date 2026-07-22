'use client';

import React from 'react';
import { AppSkeleton } from '@/components/ui/skeleton';

export function AppUserSelectSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border border-border/60 rounded-2xl bg-card-bg shadow-sm overflow-hidden w-full">
      {/* Table Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-neutral/50 border-b border-border/40">
        {/* Checkbox placeholder */}
        <AppSkeleton variant="rectangular" width={16} height={16} className="rounded" />
        <div className="w-[180px] shrink-0 text-left">
          <AppSkeleton variant="text" width={60} height={12} className="rounded-md" />
        </div>
        <div className="flex-1 text-left">
          <AppSkeleton variant="text" width={50} height={12} className="rounded-md" />
        </div>
        <div className="w-[150px] text-left">
          <AppSkeleton variant="text" width={80} height={12} className="rounded-md" />
        </div>
      </div>

      {/* Table Body Rows */}
      <div className="divide-y divide-border/30">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            {/* Checkbox placeholder */}
            <AppSkeleton variant="rectangular" width={16} height={16} className="rounded" />

            {/* User Column (Avatar + Name) */}
            <div className="w-[180px] shrink-0 flex items-center gap-2.5">
              <AppSkeleton variant="circular" width={28} height={28} />
              <AppSkeleton variant="text" width={110} height={14} className="rounded-md" />
            </div>

            {/* Email Column */}
            <div className="flex-1 text-left">
              <AppSkeleton variant="text" width="80%" height={12} className="rounded-md" />
            </div>

            {/* Account Group Column */}
            <div className="w-[150px] text-left">
              <AppSkeleton variant="text" width={90} height={12} className="rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
