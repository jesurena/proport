'use client';

import React from 'react';
import { AppSkeleton } from '@/components/ui/skeleton';

export function DashboardGroupTicketCreationsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2 pr-1 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-2.5 rounded-xl border border-border/40 bg-neutral/5"
        >
          {/* Requestor Avatar placeholder */}
          <AppSkeleton variant="circular" width={32} height={32} />

          {/* Ticket ID, Subject & Requestor placeholder */}
          <div className="min-w-0 flex-1 flex flex-col gap-1.5">
            {/* ID placeholder */}
            <AppSkeleton variant="text" width={40} height={10} className="rounded-md font-mono" />
            {/* Subject placeholder */}
            <AppSkeleton variant="text" width="85%" height={12} className="rounded-md" />
            {/* Requestor placeholder */}
            <AppSkeleton variant="text" width="50%" height={10} className="rounded-md" />
          </div>

          {/* Date Display placeholder */}
          <AppSkeleton variant="text" width={65} height={11} className="rounded-md shrink-0 font-mono" />
        </div>
      ))}
    </div>
  );
}
