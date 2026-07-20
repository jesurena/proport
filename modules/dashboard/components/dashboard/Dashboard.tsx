import React from 'react';
import { useAuthStore } from '@/modules/auth';
import BuyerDashboard from './BuyerDashboard';
import SalesDashboard from './SalesDashboard';
import AdelDashboard from './AdelDashboard';
import BUHeadDashboard from './BUHeadDashboard';

interface DashboardProps {
  role: string;
  counts: any;
}

export default function Dashboard({ role, counts }: DashboardProps) {
  const { is_adel, is_head } = useAuthStore();

  if (role === 'buyer' || role === 'admin' || role === 'super_user') {
    return <BuyerDashboard role={role} counts={counts} />;
  }
  if (is_adel) {
    return <AdelDashboard counts={counts} />;
  }
  if (is_head) {
    return <BUHeadDashboard counts={counts} />;
  }
  if (role === 'sales' || role === 'requestor') {
    return <SalesDashboard counts={counts} />;
  }

  // Fallback
  return <SalesDashboard counts={counts} />;
}
