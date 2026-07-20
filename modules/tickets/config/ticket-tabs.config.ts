import { AuthUser } from '@/modules/auth/types/user';

export interface TicketTabItem {
  id: string;
  label: string;
  checkVisibility?: (user: AuthUser | null, role: string) => boolean;
}

export const TICKET_TABS_CONFIG: TicketTabItem[] = [
  { id: 'all', label: 'All' },
  { id: 'focus', label: 'Focus' },
  { id: 'non-focus', label: 'Non Focus' },
  {
    id: 'bu-approval',
    label: 'BU Head Approval',
    checkVisibility: (user, role) => {
      return !!user?.is_head || ['admin', 'buyer', 'super_user'].includes(role);
    },
  },
  {
    id: 'bu-declined',
    label: 'BU Head Declined',
    checkVisibility: (user, role) => {
      return !!user?.is_head || ['admin', 'buyer', 'super_user'].includes(role);
    },
  },
  {
    id: 'final-approval',
    label: 'Final Approval',
    checkVisibility: (user, role) => {
      const isAdelGroup = ['BU1', 'BU2', 'BU5', 'BU10', 'CE01'].includes(user?.AccountGroup || '');
      return isAdelGroup || !!user?.is_adel || ['admin', 'buyer', 'super_user'].includes(role);
    },
  },
  {
    id: 'adel-declined',
    label: 'Declined by Adel',
    checkVisibility: (user, role) => {
      const isAdelGroup = ['BU1', 'BU2', 'BU5', 'BU10', 'CE01'].includes(user?.AccountGroup || '');
      return isAdelGroup || !!user?.is_adel || ['admin', 'buyer', 'super_user'].includes(role);
    },
  },
];

export function getTicketTabs(user: AuthUser | null, role: string): { id: string; label: string }[] {
  return TICKET_TABS_CONFIG.filter(
    (tab) => !tab.checkVisibility || tab.checkVisibility(user, role)
  );
}
