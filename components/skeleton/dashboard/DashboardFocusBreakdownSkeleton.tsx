'use client';

import React from 'react';
import { AppSkeleton } from '@/components/ui/skeleton';

export function DashboardFocusBreakdownSkeleton() {
  return (
    <div className="space-y-3 mt-4">
      {/* Donut chart mock */}
      <div className="flex flex-col items-center gap-3 py-2 animate-pulse">
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Circular outline skeleton representing the donut chart */}
          <div className="w-24 h-24 rounded-full border-[10px] border-neutral/20 flex items-center justify-center">
            {/* Center ratio label skeleton */}
            <div className="w-16 h-16 rounded-full bg-neutral/30 flex flex-col items-center justify-center gap-1">
              <AppSkeleton variant="text" width={30} height={14} className="rounded-md" />
              <AppSkeleton variant="text" width={25} height={8} className="rounded-md" />
            </div>
          </div>
        </div>
        <div className="text-center flex flex-col items-center gap-1">
          <AppSkeleton variant="text" width={130} height={14} className="rounded-md" />
          <AppSkeleton variant="text" width={160} height={10} className="rounded-md" />
        </div>
      </div>

      {/* Split Cards Grid */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="rounded-2xl border border-border/50 bg-hover/30 px-3 py-2 flex flex-col items-center gap-1.5">
          <AppSkeleton variant="text" width={40} height={10} className="rounded-md" />
          <AppSkeleton variant="text" width={60} height={14} className="rounded-md" />
        </div>
        <div className="rounded-2xl border border-border/50 bg-hover/30 px-3 py-2 flex flex-col items-center gap-1.5">
          <AppSkeleton variant="text" width={60} height={10} className="rounded-md" />
          <AppSkeleton variant="text" width={60} height={14} className="rounded-md" />
        </div>
      </div>

      {/* View More Button placeholder */}
      <div className="pt-2 text-center flex justify-center">
        <AppSkeleton variant="text" width={70} height={12} className="rounded-md" />
      </div>
    </div>
  );
}
