'use client';

import React, { useState, useEffect } from 'react';
import { ProportNavbar } from '@/modules/sidebar';
import {
  Dashboard
} from '@/modules/dashboard';
import { DashboardPageSkeleton } from '@/components/skeleton/dashboard';
import { useAuthStore } from '@/modules/auth';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const [role, setRole] = useState<string | null>(null);
  const isDeveloper = user?.is_developer ?? false;
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
          <DashboardPageSkeleton />
        ) : (
          <Dashboard role={role} />
        )}
      </div>
    </>
  );
}
