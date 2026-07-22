'use client';

import React from 'react';
import { AppSkeleton } from '@/components/ui/skeleton';

export function DashboardBookmarkedTicketsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-2.5 rounded-xl border border-border/40 bg-neutral/5"
        >
          {/* Left Column: Number and Title */}
          <div className="min-w-0 flex-1 pr-2">
            <div className="flex items-center gap-1.5 mb-1.5">
              {/* Ticket number placeholder */}
              <AppSkeleton variant="text" width={30} height={10} className="rounded-md" />
              {/* Status chip placeholder */}
              <AppSkeleton variant="text" width={45} height={14} className="rounded-md" />
            </div>
            {/* Subject text placeholder */}
            <AppSkeleton variant="text" width="85%" height={12} className="rounded-md" />
          </div>

          {/* Right Column: Arrow button placeholder */}
          <AppSkeleton variant="circular" width={24} height={24} />
        </div>
      ))}
    </div>
  );
}
