'use client';

import React from 'react';
import DashboardWelcomeBanner from '../DashboardWelcomeBanner';
import DashboardMetricCard from '../DashboardMetricCard';
import SalesRecentTickets from '../SalesRecentTickets';
import DashboardTicketCountAo from '../DashboardTicketCountAo';
import DashboardFocusBreakdown from '../DashboardFocusBreakdown';
import DashboardBookmarkedTickets from '../DashboardBookmarkedTickets';

interface SalesDashboardProps {
  counts: any;
}

export default function SalesDashboard({ counts }: SalesDashboardProps) {
  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* ── LEFT COLUMN ── */}
      <div className="flex-1 min-w-0 space-y-6">
        <DashboardWelcomeBanner role="sales" />
        <DashboardMetricCard counts={counts} />
        <SalesRecentTickets />
        <DashboardTicketCountAo />
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="xl:w-[300px] shrink-0 space-y-4">
        <DashboardFocusBreakdown />
        <DashboardBookmarkedTickets />
      </div>
    </div>
  );
}
