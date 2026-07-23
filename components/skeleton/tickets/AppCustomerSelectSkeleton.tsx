'use client';

import React from 'react';
import { AppSkeleton } from '@/components/ui/skeleton';

export function AppCustomerSelectSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border border-border/60 rounded-2xl bg-card-bg shadow-sm overflow-hidden w-full">
      {/* Table Header */}
      <div className="flex items-center gap-4 px-4 py-3 bg-neutral/50 border-b border-border/40">
        <div className="w-[100px] shrink-0 text-left">
          <AppSkeleton variant="text" width={40} height={12} className="rounded-md" />
        </div>
        <div className="w-[280px] shrink-0 text-left">
          <AppSkeleton variant="text" width={100} height={12} className="rounded-md" />
        </div>
        <div className="w-[160px] shrink-0 text-left">
          <AppSkeleton variant="text" width={70} height={12} className="rounded-md" />
        </div>
        <div className="w-[180px] shrink-0 text-left">
          <AppSkeleton variant="text" width={60} height={12} className="rounded-md" />
        </div>
        <div className="flex-1" />
      </div>

      {/* Table Body Rows */}
      <div className="divide-y divide-border/30">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3.5">
            {/* ID Column */}
            <div className="w-[100px] shrink-0 text-left">
              <AppSkeleton variant="text" width={65} height={12} className="rounded-md font-mono" />
            </div>

            {/* Customer Name Column */}
            <div className="w-[280px] shrink-0 text-left">
              <AppSkeleton variant="text" width={220} height={14} className="rounded-md" />
            </div>

            {/* Sales Area Column */}
            <div className="w-[160px] shrink-0 text-left flex">
              <AppSkeleton variant="text" width={75} height={20} className="rounded-xl" />
            </div>

            {/* BU - AO Column */}
            <div className="w-[180px] shrink-0 text-left">
              <AppSkeleton variant="text" width={110} height={12} className="rounded-md" />
            </div>

            {/* Arrow Button placeholder */}
            <div className="flex-1 flex justify-end">
              <AppSkeleton variant="circular" width={28} height={28} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
