'use client';

import React from 'react';
import { AppSkeleton } from '@/components/ui/skeleton';

export function SearchTicketsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-1.5">
      {/* Category header placeholder */}
      <div className="px-1 mb-2">
        <AppSkeleton variant="text" width={100} height={12} className="rounded-md" />
      </div>

      <div className="flex flex-col gap-1.5">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 border border-border/40 bg-card-bg shadow-sm rounded-xl"
          >
            {/* Left Column: Icon and Texts */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Icon placeholder (w-8 h-8 rounded-lg) */}
              <AppSkeleton variant="rectangular" width={32} height={32} className="rounded-lg bg-neutral/10" />
              
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                {/* ID and Subject placeholder */}
                <div className="flex items-center gap-2">
                  <AppSkeleton variant="text" width={40} height={12} className="rounded-md shrink-0 font-mono" />
                  <AppSkeleton variant="text" width="70%" height={12} className="rounded-md" />
                </div>
                {/* Meta details placeholder */}
                <AppSkeleton variant="text" width="85%" height={10} className="rounded-md" />
              </div>
            </div>

            {/* Right Column: Arrow Button placeholder (w-6 h-6 circular) */}
            <AppSkeleton variant="circular" width={24} height={24} className="shrink-0 ml-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
