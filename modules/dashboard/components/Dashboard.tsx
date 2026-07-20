'use client';

import React from 'react';
import { DASHBOARD_LAYOUTS } from '../config/dashboard.config';

interface DashboardProps {
  role: string;
  counts: any;
}

export default function Dashboard({ role, counts }: DashboardProps) {
  const layoutKey = ['buyer', 'admin', 'super_user'].includes(role) ? 'buyer' : 'sales';
  const config = DASHBOARD_LAYOUTS[layoutKey] || DASHBOARD_LAYOUTS.sales;

  const context = { role, counts };

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* ── LEFT COLUMN ── */}
      <div className="flex-1 min-w-0 space-y-6">
        {config.left.map((item, idx) => {
          const Component = item.component;
          return (
            <Component
              key={`${Component.displayName || Component.name || idx}-left`}
              {...item.props?.(context)}
            />
          );
        })}
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="xl:w-[300px] shrink-0 space-y-4">
        {config.right.map((item, idx) => {
          const Component = item.component;
          return (
            <Component
              key={`${Component.displayName || Component.name || idx}-right`}
              {...item.props?.(context)}
            />
          );
        })}
      </div>
    </div>
  );
}
