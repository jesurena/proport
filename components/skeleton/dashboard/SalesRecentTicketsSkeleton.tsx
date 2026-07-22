'use client';

import React from 'react';
import { AppSkeleton } from '@/components/ui/skeleton';

export function SalesRecentTicketsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden border border-border/50 bg-card-bg shadow-sm rounded-2xl flex flex-col h-[264px]"
        >
          {/* Top cover image placeholder */}
          <AppSkeleton variant="rectangular" width="100%" height={144} className="bg-neutral/10" />

          {/* Card body content */}
          <div className="p-4 flex-1 flex flex-col gap-2 justify-between">
            <div className="flex items-start gap-2 text-left w-full">
              {/* Bookmark placeholder */}
              <AppSkeleton variant="circular" width={16} height={16} className="mt-0.5" />
              
              {/* Subject title lines */}
              <div className="flex-1 flex flex-col gap-1.5">
                <AppSkeleton variant="text" width="90%" height={13} className="rounded-md" />
                <AppSkeleton variant="text" width="60%" height={13} className="rounded-md" />
              </div>
            </div>

            {/* Bottom status chip placeholder */}
            <div className="mt-auto pt-2 flex">
              <AppSkeleton variant="text" width={60} height={18} className="rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
