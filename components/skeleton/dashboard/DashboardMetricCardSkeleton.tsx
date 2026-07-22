'use client';

import React from 'react';
import { AppSkeleton } from '@/components/ui/skeleton';
import { AppCard } from '@/components/ui';

export function DashboardMetricCardSkeleton({ cardsCount = 3 }: { cardsCount?: number }) {
  return (
    <div className="space-y-3">
      {/* Header skeleton matching real component title */}
      <div className="flex items-center justify-between">
        <AppSkeleton variant="text" width={140} height={18} className="rounded-md" />
        <AppSkeleton variant="text" width={60} height={14} className="rounded-md" />
      </div>

      {/* Cards grid matching grid-cols-1 sm:grid-cols-3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Array.from({ length: cardsCount }).map((_, i) => (
          <AppCard
            key={i}
            variant="default"
            padding="none"
            className="p-4 flex items-center justify-between"
          >
            {/* Left Column: Icon and Text labels */}
            <div className="flex items-center gap-3">
              {/* Circular Icon placeholder (w-11 h-11) */}
              <AppSkeleton variant="circular" width={44} height={44} />

              <div className="flex flex-col gap-1.5">
                {/* Info Text (e.g. "X tickets") placeholder */}
                <AppSkeleton variant="text" width={60} height={11} className="rounded-md" />
                {/* Title text placeholder */}
                <AppSkeleton variant="text" width={110} height={14} className="rounded-md" />
              </div>
            </div>

            {/* Right Column: Arrow Button placeholder (w-8 h-8 circular) */}
            <AppSkeleton variant="circular" width={32} height={32} />
          </AppCard>
        ))}
      </div>
    </div>
  );
}
