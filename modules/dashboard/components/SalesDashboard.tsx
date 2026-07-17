import React from 'react';
import DashboardWelcomeBanner from './DashboardWelcomeBanner';
import DashboardMetricCard from './DashboardMetricCard';
import SalesRecentTickets from './SalesRecentTickets';
import DashboardTicketCountAo from './DashboardTicketCountAo';
import DashboardFocusBreakdown from './DashboardFocusBreakdown';
import DashboardBookmarkedTickets from './DashboardBookmarkedTickets';

interface SalesDashboardProps {
  counts?: any;
  totalCount: number;
  recentTickets: any[];
  allTickets: any[];
  getCount: (status: string) => number;
}

export default function SalesDashboard({
  counts,
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
        <DashboardMetricCard allTickets={allTickets} counts={counts} />
        <SalesRecentTickets />
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
