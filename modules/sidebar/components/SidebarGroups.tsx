'use client';

import React from 'react';
import {
  LayoutDashboard,
  Ticket,
  FileBarChart,
  Award,
  Box,
  Tag,
} from 'lucide-react';

export interface SidebarItem {
  name: string;
  icon: React.ComponentType<any>;
  href?: string;
  badge?: number;
  subItems?: { name: string; href: string }[];
  isWip?: boolean;
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

import { AuthUser } from '@/modules/auth/types/user';

export function getSidebarGroups(user: AuthUser | null, totalOpen: number): SidebarGroup[] {
  const role = user?.role_name || 'buyer';
  const group = user?.AccountGroup || '';

  const isAdelGroup = ['BU1', 'BU2', 'BU5', 'BU10', 'CE01'].includes(group);
  const showFinalApproval = isAdelGroup || ['admin', 'buyer', 'super_user'].includes(role);
  const showReassigned = ['buyer', 'admin'].includes(role);

  // 1. Navigation Group
  const navItems: SidebarItem[] = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'All Tickets', href: '/tickets', icon: Ticket, badge: totalOpen },
  ];

  // Reports visible if PMD or super_user
  if (group === 'PMD' || role === 'super_user') {
    navItems.push({ name: 'Reports', href: '/reports', icon: FileBarChart, isWip: true });
  }

  const groups: SidebarGroup[] = [
    {
      title: 'Navigation',
      items: navItems,
    },
  ];

  // 2. Status Filtering Group
  const focusSubItems = [
    { name: 'Pending Tickets', href: '/tickets?tab=focus&status=pending' },
    { name: 'Answered Tickets', href: '/tickets?tab=focus&status=answered' },
    { name: 'Closed Tickets', href: '/tickets?tab=focus&status=closed' },
  ];

  if (showReassigned) {
    focusSubItems.push({ name: 'Reassigned Tickets', href: '/tickets?tab=focus&status=reassigned' });
  }

  const nonFocusSubItems = [
    { name: 'BU Head Approval', href: '/tickets?tab=bu-approval' },
    { name: 'Declined by BU Head', href: '/tickets?tab=bu-declined' },
  ];

  if (showFinalApproval) {
    nonFocusSubItems.push(
      { name: 'Final Approval', href: '/tickets?tab=final-approval' },
      { name: 'Declined by Adel', href: '/tickets?tab=adel-declined' }
    );
  }

  nonFocusSubItems.push(
    { name: 'Pending Tickets', href: '/tickets?tab=non-focus&status=pending' },
    { name: 'Answered Tickets', href: '/tickets?tab=non-focus&status=answered' },
    { name: 'Closed Tickets', href: '/tickets?tab=non-focus&status=closed' }
  );

  if (showReassigned) {
    nonFocusSubItems.push({ name: 'Reassigned Tickets', href: '/tickets?tab=non-focus&status=reassigned' });
  }

  groups.push({
    title: 'Status Filtering',
    items: [
      {
        name: 'Focus',
        icon: Award,
        subItems: focusSubItems,
      },
      {
        name: 'Non Focus',
        icon: Box,
        subItems: nonFocusSubItems,
      },
    ],
  });

  // 3. System Group
  if (role === 'admin') {
    groups.push({
      title: 'System',
      items: [
        { name: 'Brand Maintenance', href: '/brands', icon: Tag },
      ],
    });
  }

  return groups;
}
