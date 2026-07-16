'use client';

import React, { useState, useEffect } from 'react';
import { ProportNavbar } from '@/modules/sidebar';
import {
  SalesDashboard,
  BuyerDashboard,
  useDashboard,
  useDashboardStats
} from '@/modules/dashboard';
import { useAuthStore } from '@/modules/auth';

export default function DashboardPage() {
  const { allTickets, recentTickets, isLoading } = useDashboard();
  const { totalCount, getCount } = useDashboardStats(allTickets);

  const [role, setRole] = useState<string | null>(null);
  const { user } = useAuthStore();
  const isDeveloper = user?.isDeveloper ?? false;
  const actualRole = user?.role_name ?? 'buyer';

  useEffect(() => {
    const storedRole = localStorage.getItem('proport_my_role');
    if (isDeveloper && storedRole) {
      setRole(storedRole);
    } else {
      setRole(actualRole);
    }
  }, [isDeveloper, actualRole]);

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
