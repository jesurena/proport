import { AuthUser } from '@/modules/auth/types/user';

export interface DashboardTabItem {
  id: 'ao' | 'bu' | 'buyer-date' | 'buyer-category' | 'aging' | 'sales-date';
  label: string;
  checkVisibility?: (user: AuthUser | null, role: string) => boolean;
}

export const DASHBOARD_TABS_CONFIG: DashboardTabItem[] = [
  {
    id: 'ao',
    label: 'Ticket Count per AO & Category',
    checkVisibility: (user, role) => ['buyer', 'admin', 'super_user'].includes(role),
  },
  {
    id: 'sales-date',
    label: 'Ticket Count per Sales & Date',
    checkVisibility: (user, role) => ['bu_head', 'adel', 'admin', 'super_user'].includes(role),
  },
  {
    id: 'bu',
    label: 'Tickets per BU',
    checkVisibility: (user, role) => ['buyer', 'adel', 'admin', 'super_user'].includes(role),
  },
  {
    id: 'buyer-date',
    label: 'Ticket Count per Buyer & Date',
    checkVisibility: (user, role) => ['buyer', 'admin', 'super_user'].includes(role),
  },
  {
    id: 'buyer-category',
    label: 'Ticket Count per Buyer & Category',
    checkVisibility: (user, role) => ['buyer', 'admin', 'super_user'].includes(role),
  },
];

export function getDashboardTabs(user: AuthUser | null, role: string): DashboardTabItem[] {
  return DASHBOARD_TABS_CONFIG.filter(
    (tab) => !tab.checkVisibility || tab.checkVisibility(user, role)
  );
}
