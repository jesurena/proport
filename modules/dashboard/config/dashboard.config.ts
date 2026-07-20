import React from 'react';
import DashboardWelcomeBanner from '../components/DashboardWelcomeBanner';
import DashboardMetricCard from '../components/DashboardMetricCard';
import DashboardTicketCountAo from '../components/DashboardTicketCountAo';
import SalesRecentTickets from '../components/SalesRecentTickets';
import DashboardFocusBreakdown from '../components/DashboardFocusBreakdown';
import DashboardBookmarkedTickets from '../components/DashboardBookmarkedTickets';
import DashboardTicketPerBuyer from '../components/DashboardTicketPerBuyer';

export interface WidgetConfig {
  component: React.ComponentType<any>;
  props?: (ctx: any) => any;
}

export interface DashboardLayoutConfig {
  left: WidgetConfig[];
  right: WidgetConfig[];
}

export const DASHBOARD_LAYOUTS: Record<string, DashboardLayoutConfig> = {
  buyer: {
    left: [
      {
        component: DashboardWelcomeBanner,
        props: (ctx) => ({ role: ctx.role }),
      },
      {
        component: DashboardMetricCard,
        props: (ctx) => ({ counts: ctx.counts }),
      },
      {
        component: DashboardTicketCountAo,
      },
    ],
    right: [
      {
        component: DashboardFocusBreakdown,
      },
      {
        component: DashboardBookmarkedTickets,
      },
      {
        component: DashboardTicketPerBuyer,
      },
    ],
  },
  sales: {
    left: [
      {
        component: DashboardWelcomeBanner,
        props: (ctx) => ({ role: ctx.role }),
      },
      {
        component: DashboardMetricCard,
        props: (ctx) => ({ counts: ctx.counts }),
      },
      {
        component: SalesRecentTickets,
      },
      {
        component: DashboardTicketCountAo,
      },
    ],
    right: [
      {
        component: DashboardFocusBreakdown,
      },
      {
        component: DashboardBookmarkedTickets,
      },
    ],
  },
};
