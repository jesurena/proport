'use client';

import React from 'react';
import { AppSkeleton } from '@/components/ui/skeleton';

export function BuyerActivityLogsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6 py-2">
      {/* Group Date Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <AppSkeleton variant="text" width={80} height={12} className="rounded-md" />
          <div className="flex-1 h-px bg-border/40" />
          <AppSkeleton variant="text" width={40} height={12} className="rounded-md" />
        </div>

        {/* Timeline wrapper */}
        <div className="relative ml-[18px]">
          {/* Vertical line connector */}
          <div className="absolute left-0 top-4 bottom-4 w-px bg-border/30" />

          <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="relative flex items-start pl-9">
                {/* Circular timeline dot */}
                <div className="absolute left-[-12px] top-2.5 w-6 h-6 rounded-full bg-neutral/20 border-2 border-card-bg shrink-0" />

                {/* Content body */}
                <div className="flex-1 flex items-start justify-between gap-3 p-2.5 border border-border/10 rounded-xl bg-neutral/5">
                  <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                    {/* Log action text placeholder */}
                    <AppSkeleton variant="text" width="65%" height={12} className="rounded-md" />
                    {/* Log detail (quote) placeholder */}
                    <AppSkeleton variant="text" width="80%" height={10} className="rounded-md" />
                    
                    {/* Timestamp metadata */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <AppSkeleton variant="text" width={40} height={10} className="rounded-md" />
                      <span className="text-text-info/30">•</span>
                      <AppSkeleton variant="text" width={100} height={10} className="rounded-md" />
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <div className="self-center shrink-0">
                    <AppSkeleton variant="circular" width={14} height={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
