'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAuthStore } from '@/modules/auth';
import { getDashboardTabs } from '../config/dashboard-tabs.config';
import {
  DashboardAoTable,
  DashboardSalesDateTable,
  DashboardBuChart,
  DashboardBuyerDateTable,
  DashboardBuyerCategoryTable,
} from './tabs';

export default function DashboardTabTable() {
  const [activeTab, setActiveTab] = useState<string>('ao');

  const { user } = useAuthStore();
  const [role, setRole] = useState<string>('super_user');

  useEffect(() => {
    const storedRole = typeof window !== 'undefined' ? localStorage.getItem('proport_my_role') : null;
    const isDeveloper = user?.is_developer ?? false;
    const actualRole = user?.role_name ?? 'buyer';

    if (isDeveloper && storedRole) {
      setRole(storedRole);
    } else {
      setRole(actualRole);
    }
  }, [user]);

  const tabs = useMemo(() => getDashboardTabs(user, role), [user, role]);

  useEffect(() => {
    if (tabs.length > 0 && !tabs.some((t) => t.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  return (
    <div className="space-y-4">
      {/* Tab Navigation Bar */}
      <div className="flex border-b border-border/40 select-none overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 hover:text-accent-1 cursor-pointer shrink-0 ${
              activeTab === tab.id
                ? 'border-accent-1 text-accent-1'
                : 'border-transparent text-text-info'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'ao' && <DashboardAoTable />}
      {activeTab === 'sales-date' && <DashboardSalesDateTable />}
      {activeTab === 'bu' && <DashboardBuChart />}
      {activeTab === 'buyer-date' && <DashboardBuyerDateTable />}
      {activeTab === 'buyer-category' && <DashboardBuyerCategoryTable />}
    </div>
  );
}
