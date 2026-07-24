'use client';

import React from 'react';
import { AppSkeleton } from '@/components/ui/skeleton';

export function UserProfileBrandsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3.5 p-1">
      {/* Search and Header bar skeleton */}
      <div className="flex items-center justify-between gap-3">
        <AppSkeleton variant="text" height={36} className="flex-1 rounded-lg" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 gap-2.5">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="p-3 rounded-xl bg-card-bg border border-border/40 flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <AppSkeleton variant="rectangular" width={32} height={32} className="rounded-lg shrink-0" />
              <AppSkeleton variant="text" width={80} height={14} className="rounded-md" />
            </div>

            <AppSkeleton variant="text" width={52} height={20} className="rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
