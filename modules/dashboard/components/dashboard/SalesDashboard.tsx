'use client';

import React from 'react';
import DashboardWelcomeBanner from '../DashboardWelcomeBanner';
import DashboardMetricCard from '../DashboardMetricCard';
import SalesRecentTickets from '../SalesRecentTickets';
import DashboardTabTable from '../DashboardTabTable';
import DashboardFocusBreakdown from '../DashboardFocusBreakdown';
import DashboardBookmarkedTickets from '../DashboardBookmarkedTickets';

import { useDashboard } from '../../hooks/useDashboard';

export default function SalesDashboard() {
  const { counts, isLoading } = useDashboard();

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* ── LEFT COLUMN ── */}
      <div className="flex-1 min-w-0 space-y-6">
        <DashboardWelcomeBanner role="sales" />
        <DashboardMetricCard counts={counts} isLoading={isLoading} />
        <SalesRecentTickets />
        <DashboardTabTable />
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="xl:w-[300px] shrink-0 space-y-4">
        <DashboardFocusBreakdown />
        <DashboardBookmarkedTickets />
      </div>
    </div>
  );
}
