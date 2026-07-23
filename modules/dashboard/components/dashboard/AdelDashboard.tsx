'use client';

import React from 'react';
import DashboardWelcomeBanner from '../DashboardWelcomeBanner';
import DashboardMetricCard from '../DashboardMetricCard';
import DashboardTabTable from '../DashboardTabTable';
import DashboardBookmarkedTickets from '../DashboardBookmarkedTickets';

import { useAdelCounts } from '../../hooks/useAdel';
import DashboardGroupTicketCreations from '../DashboardGroupTicketCreations';

export default function AdelDashboard() {
  const { data: counts, isLoading } = useAdelCounts();

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* ── LEFT COLUMN ── */}
      <div className="flex-1 min-w-0 space-y-6">
        <DashboardWelcomeBanner role="adel" counts={counts} />
        <DashboardMetricCard counts={counts} isLoading={isLoading} />
        <DashboardTabTable />
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="xl:w-[300px] shrink-0 space-y-4">
        <DashboardBookmarkedTickets />
        <DashboardGroupTicketCreations />
      </div>
    </div>
  );
}
