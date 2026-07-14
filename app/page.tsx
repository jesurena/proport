'use client';

import React from 'react';
import { ProportNavbar } from '@/modules/sidebar';
import {
  DashboardWelcomeBanner,
  DashboardMetricCard,
  DashboardSupplierInquiries,
  DashboardTable,
  DashboardFocusBreakdown,
  DashboardTicketPerBuyer,
  useDashboard
} from '@/modules/dashboard';

export default function DashboardPage() {
  const {
    totalCount,
    recentTickets,
    allTickets,
    getCount
  } = useDashboard();

  return (
    <>
      <ProportNavbar title="Dashboard" />

      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Two-column layout */}
        <div className="flex flex-col xl:flex-row gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 min-w-0 space-y-6">
            <DashboardWelcomeBanner />
            <DashboardMetricCard totalCount={totalCount} getCount={getCount} />
            <DashboardSupplierInquiries recentTickets={recentTickets} />
            <DashboardTable recentTickets={recentTickets} />
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="xl:w-[300px] shrink-0 space-y-4">
            <DashboardFocusBreakdown allTickets={allTickets} />
            <DashboardTicketPerBuyer allTickets={allTickets} />
          </div>

        </div>
      </div>
    </>
  );
}
