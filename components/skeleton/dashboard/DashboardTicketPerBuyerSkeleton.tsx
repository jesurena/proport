'use client';

import React from 'react';
import { AppSkeleton } from '@/components/ui/skeleton';

export function DashboardTicketPerBuyerSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2 mt-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-2.5 rounded-xl border border-border/40 bg-neutral/5"
        >
          <div className="flex items-center gap-2.5">
            {/* Avatar circle placeholder */}
            <AppSkeleton variant="circular" width={32} height={32} />
            <div className="flex flex-col gap-1.5">
              {/* Name text placeholder */}
              <AppSkeleton variant="text" width={100} height={12} className="rounded-md" />
              {/* Count detail placeholder */}
              <AppSkeleton variant="text" width={60} height={10} className="rounded-md" />
            </div>
          </div>
          {/* Arrow button placeholder */}
          <AppSkeleton variant="circular" width={14} height={14} />
        </div>
      ))}
    </div>
  );
}
