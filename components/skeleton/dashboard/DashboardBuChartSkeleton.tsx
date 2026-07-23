'use client';

import React from 'react';
import { AppSkeleton } from '@/components/ui/skeleton';
import { AppCard, AppLabel } from '@/components/ui';

export function DashboardBuChartSkeleton() {
  return (
    <AppCard variant="default" padding="lg" className="py-6 space-y-5">
      {/* Title */}
      <AppLabel as="h4" className="text-sm font-bold text-text mb-2 text-center">
        Tickets per BU
      </AppLabel>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 px-4">
        {/* Left Side: SVG Pie Chart Skeleton */}
        <div className="relative w-80 h-80 shrink-0 flex items-center justify-center">
          {/* Solid circular skeleton representing the pie chart */}
          <AppSkeleton variant="circular" width={288} height={288} className="bg-neutral/10" />
        </div>

        {/* Right Side: Legend / Breakdown List Skeleton */}
        <div className="flex-1 w-full space-y-2 max-w-sm">
          {/* Legend Header */}
          <div className="flex items-center justify-between text-[11px] font-bold text-text-info uppercase tracking-wider border-b border-border/40 pb-1.5 px-2">
            <span>Business Unit</span>
            <span>Breakdown</span>
          </div>

          {/* Legend Items */}
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg border border-transparent"
              >
                {/* Color box and Name */}
                <div className="flex items-center gap-2.5">
                  <AppSkeleton variant="rectangular" width={12} height={12} className="rounded-xs" />
                  <AppSkeleton variant="text" width={110} height={12} className="rounded-md" />
                </div>
                {/* Count and Percentage */}
                <div className="flex items-center gap-3">
                  <AppSkeleton variant="text" width={55} height={12} className="rounded-md" />
                  <AppSkeleton variant="text" width={32} height={12} className="rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppCard>
  );
}
