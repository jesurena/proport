import React from 'react';
import { useAuthStore } from '@/modules/auth';
import BuyerDashboard from './BuyerDashboard';
import SalesDashboard from './SalesDashboard';
import AdelDashboard from './AdelDashboard';
import BUHeadDashboard from './BUHeadDashboard';

interface DashboardProps {
  role: string;
}

export default function Dashboard({ role }: DashboardProps) {
  const { is_adel, is_head } = useAuthStore();

  if (role === 'buyer' || role === 'admin' || role === 'super_user') {
    return <BuyerDashboard role={role} />;
  }
  if (is_adel) {
    return <AdelDashboard />;
  }
  if (is_head) {
    return <BUHeadDashboard />;
  }
  if (role === 'requestor') {
    return <SalesDashboard />;
  }

  // Fallback
  return <SalesDashboard />;
}
