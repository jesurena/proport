'use client';

import React from 'react';
import { AppSkeleton } from '@/components/ui/skeleton';
import { DashboardMetricCardSkeleton } from './DashboardMetricCardSkeleton';
import { DashboardFocusBreakdownSkeleton } from './DashboardFocusBreakdownSkeleton';
import { DashboardTicketPerBuyerSkeleton } from './DashboardTicketPerBuyerSkeleton';
import { DashboardTabTableSkeleton } from './DashboardTabTableSkeleton';

export function DashboardPageSkeleton() {
  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* ── LEFT COLUMN ── */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Welcome Banner Skeleton */}
        <div
          style={{
            borderRadius: '16px',
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <AppSkeleton variant="text" width={220} height={24} />
            <AppSkeleton variant="text" width={320} height={14} />
          </div>
          <AppSkeleton variant="circular" width={48} height={48} />
        </div>

        {/* Metric Cards Skeleton */}
        <DashboardMetricCardSkeleton />

        {/* Tab Table Skeleton */}
        <DashboardTabTableSkeleton />
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="xl:w-[300px] shrink-0 space-y-4">
        <DashboardFocusBreakdownSkeleton />
        <DashboardTicketPerBuyerSkeleton />
      </div>
    </div>
  );
}
