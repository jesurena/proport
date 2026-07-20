'use client';

import React from 'react';
import DashboardWelcomeBanner from '../DashboardWelcomeBanner';
import DashboardMetricCard from '../DashboardMetricCard';
import DashboardTicketCountAo from '../DashboardTicketCountAo';
import DashboardFocusBreakdown from '../DashboardFocusBreakdown';
import DashboardBookmarkedTickets from '../DashboardBookmarkedTickets';
import DashboardTicketPerBuyer from '../DashboardTicketPerBuyer';

interface BuyerDashboardProps {
  role: string;
  counts: any;
}

export default function BuyerDashboard({ role, counts }: BuyerDashboardProps) {
  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* ── LEFT COLUMN ── */}
      <div className="flex-1 min-w-0 space-y-6">
        <DashboardWelcomeBanner role={role} />
        <DashboardMetricCard counts={counts} />
        <DashboardTicketCountAo />
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="xl:w-[300px] shrink-0 space-y-4">
        <DashboardFocusBreakdown />
        <DashboardBookmarkedTickets />
        <DashboardTicketPerBuyer />
      </div>
    </div>
  );
}
