import React from 'react';
import DashboardWelcomeBanner from './DashboardWelcomeBanner';
import SalesDashboardMetricCard from './SalesDashboardMetricCard';
import DashboardRecentTickets from './DashboardRecentTickets';
import DashboardTicketCountAo from './DashboardTicketCountAo';
import DashboardFocusBreakdown from './DashboardFocusBreakdown';
import DashboardBookmarkedTickets from './DashboardBookmarkedTickets';

interface SalesDashboardProps {
  totalCount: number;
  recentTickets: any[];
  allTickets: any[];
  getCount: (status: string) => number;
}

export default function SalesDashboard({
  totalCount,
  recentTickets,
  allTickets,
  getCount,
}: SalesDashboardProps) {
  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* ── LEFT COLUMN ── */}
      <div className="flex-1 min-w-0 space-y-6">
        <DashboardWelcomeBanner role="sales" />
        <SalesDashboardMetricCard allTickets={allTickets} />
        <DashboardRecentTickets />
        <DashboardTicketCountAo allTickets={allTickets} />
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="xl:w-[300px] shrink-0 space-y-4">
        <DashboardFocusBreakdown allTickets={allTickets} />
        <DashboardBookmarkedTickets allTickets={allTickets} />
      </div>
    </div>
  );
}
