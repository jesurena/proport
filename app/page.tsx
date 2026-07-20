'use client';

import React, { useState, useEffect } from 'react';
import { ProportNavbar } from '@/modules/sidebar';
import {
  Dashboard,
  useDashboard,
  useAdelCounts,
  useBuHeadCounts
} from '@/modules/dashboard';
import { useAuthStore } from '@/modules/auth';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const isAdel = user?.is_adel ?? false;
  const isHead = user?.is_head ?? false;

  const { counts: standardCounts } = useDashboard();
  const { data: adelCounts } = useAdelCounts();
  const { data: buHeadCounts } = useBuHeadCounts();

  const counts = isAdel ? adelCounts : (isHead ? buHeadCounts : standardCounts);

  const [role, setRole] = useState<string | null>(null);
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
        ) : (
          <Dashboard role={role} counts={counts} />
        )}
      </div>
    </>
  );
}
