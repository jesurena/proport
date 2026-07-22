'use client';

import React from 'react';
import { AppSkeleton } from '@/components/ui/skeleton';

export function BrandTableSkeleton() {
  return (
    <div className="border border-border/60 rounded-2xl bg-card-bg shadow-sm overflow-hidden w-full">
      {/* Table Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-neutral/50 border-b border-border/40">
        <div className="w-1/3 text-left">
          <AppSkeleton variant="text" width={80} height={12} className="rounded-md" />
        </div>
        <div className="w-1/3 flex justify-center">
          <AppSkeleton variant="text" width={70} height={12} className="rounded-md" />
        </div>
        <div className="w-1/3 flex justify-center">
          <AppSkeleton variant="text" width={50} height={12} className="rounded-md" />
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-border/30">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-6 py-4">
            {/* Brand Name Column */}
            <div className="w-1/3 text-left">
              <AppSkeleton variant="text" width={140} height={14} className="rounded-md" />
            </div>

            {/* Brand Type Chip Column */}
            <div className="w-1/3 flex justify-center">
              <AppSkeleton variant="text" width={90} height={24} className="rounded-xl" />
            </div>

            {/* Action Column */}
            <div className="w-1/3 flex justify-center">
              <AppSkeleton variant="circular" width={28} height={28} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
