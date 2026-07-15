'use client';

import React, { useState, useEffect } from 'react';
import { ProportNavbar } from '@/modules/sidebar';
import {
  SalesDashboard,
  BuyerDashboard,
  useDashboard
} from '@/modules/dashboard';

export default function DashboardPage() {
  const {
    totalCount,
    recentTickets,
    allTickets,
    getCount
  } = useDashboard();

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('proport_my_role');
    setRole(storedRole || 'super_user');
  }, []);

  return (
    <>
      <ProportNavbar title="Dashboard" />

      <div className="p-6 max-w-[1400px] mx-auto">
        {role === null ? (
          <div className="p-12 text-center text-text-info text-sm">
            Loading dashboard...
          </div>
        ) : role === 'sales' ? (
          <SalesDashboard
            totalCount={totalCount}
            recentTickets={recentTickets}
            allTickets={allTickets}
            getCount={getCount}
          />
        ) : (
          <BuyerDashboard
            totalCount={totalCount}
            recentTickets={recentTickets}
            allTickets={allTickets}
            getCount={getCount}
          />
        )}
      </div>
    </>
  );
}
