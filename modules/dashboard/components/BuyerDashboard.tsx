'use client';

import React from 'react';
import DashboardWelcomeBanner from './DashboardWelcomeBanner';
import DashboardMetricCard from './DashboardMetricCard';
import DashboardTicketCountAo from './DashboardTicketCountAo';
import DashboardTicketPerBuyer from './DashboardTicketPerBuyer';
import DashboardFocusBreakdown from './DashboardFocusBreakdown';
import DashboardBookmarkedTickets from './DashboardBookmarkedTickets';
import type { Ticket as TicketType } from '@/lib/types';

interface BuyerDashboardProps {
  totalCount: number;
  recentTickets: TicketType[];
  allTickets: TicketType[];
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
        <DashboardMetricCard allTickets={allTickets} />
        <DashboardTicketCountAo allTickets={allTickets} />
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="xl:w-[300px] shrink-0 space-y-4">
        <DashboardFocusBreakdown allTickets={allTickets} />
        <DashboardBookmarkedTickets allTickets={allTickets} />
        <DashboardTicketPerBuyer allTickets={allTickets} />
      </div>
    </div>
  );
}
