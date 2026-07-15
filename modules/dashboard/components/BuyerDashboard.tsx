import React from 'react';
import DashboardWelcomeBanner from './DashboardWelcomeBanner';
import DashboardMetricCard from './DashboardMetricCard';
import DashboardTable from './DashboardTable';
import DashboardTicketPerBuyer from './DashboardTicketPerBuyer';
import DashboardFocusBreakdown from './DashboardFocusBreakdown';
import DashboardPinnedTickets from './DashboardPinnedTickets';

interface BuyerDashboardProps {
  totalCount: number;
  recentTickets: any[];
  allTickets: any[];
  getCount: (status: string) => number;
}

export default function BuyerDashboard({
  totalCount,
  recentTickets,
  allTickets,
  getCount,
}: BuyerDashboardProps) {
  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* ── LEFT COLUMN ── */}
      <div className="flex-1 min-w-0 space-y-6">
        <DashboardWelcomeBanner role="buyer" />
        <DashboardMetricCard totalCount={totalCount} getCount={getCount} />
        <DashboardTable recentTickets={recentTickets} />
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="xl:w-[300px] shrink-0 space-y-4">
        <DashboardFocusBreakdown allTickets={allTickets} />
        <DashboardPinnedTickets allTickets={allTickets} />
        <DashboardTicketPerBuyer allTickets={allTickets} />
      </div>
    </div>
  );
}
