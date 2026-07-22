'use client';

import React from 'react';
import { AppSkeleton } from '@/components/ui/skeleton';

export function AppReassignSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_50px_1fr] gap-4 items-stretch">
      {/* Left Column: Assigned Buyers */}
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <AppSkeleton variant="text" width={110} height={14} className="rounded-md" />
          <AppSkeleton variant="text" width={40} height={10} className="rounded-md" />
        </div>
        <div className="border border-border/50 bg-neutral/5 rounded-xl p-3 h-[260px] flex flex-col gap-1.5 overflow-hidden">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 border border-border/30 rounded-lg py-2 px-3 bg-neutral/10">
              <AppSkeleton variant="circular" width={32} height={32} />
              <div className="flex-1 flex flex-col gap-1.5">
                <AppSkeleton variant="text" width={80} height={11} className="rounded-md" />
                <AppSkeleton variant="text" width={50} height={8} className="rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center: Spacer Indicators */}
      <div className="hidden md:flex flex-col items-center justify-center gap-2 opacity-20">
        <div className="w-4 h-4 rounded-full border-2 border-neutral-400" />
        <div className="h-px w-4 bg-neutral-400" />
        <div className="w-4 h-4 rounded-full border-2 border-neutral-400" />
      </div>

      {/* Right Column: Available Buyers */}
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <AppSkeleton variant="text" width={100} height={14} className="rounded-md" />
          <AppSkeleton variant="text" width={40} height={10} className="rounded-md" />
        </div>
        <div className="border border-border/50 bg-neutral/5 rounded-xl p-3 h-[260px] flex flex-col gap-1.5 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 border border-border/30 rounded-lg py-2 px-3 bg-neutral/10">
              <AppSkeleton variant="circular" width={32} height={32} />
              <div className="flex-1 flex flex-col gap-1.5">
                <AppSkeleton variant="text" width={90} height={11} className="rounded-md" />
                <AppSkeleton variant="text" width={45} height={8} className="rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
