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
import { AuthUser } from '@/modules/auth/types/user';

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

interface SubItemConfig {
  name: string;
  href: string;
  checkVisibility?: (user: AuthUser | null, role: string) => boolean;
}

interface ItemConfig {
  name: string;
  icon: React.ComponentType<any>;
  href?: string;
  isWip?: boolean;
  subItems?: SubItemConfig[];
  checkVisibility?: (user: AuthUser | null, role: string) => boolean;
}

interface SidebarGroupConfig {
  title: string;
  items: ItemConfig[];
}

const SIDEBAR_STRUCTURE: SidebarGroupConfig[] = [
  {
    title: 'Navigation',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'All Tickets', href: '/tickets', icon: Ticket },
      {
        name: 'Reports',
        href: '/reports',
        icon: FileBarChart,
        isWip: true,
      },
    ],
  },
  {
    title: 'Status Filtering',
    items: [
      {
        name: 'Focus',
        icon: Award,
        subItems: [
          { name: 'Pending Tickets', href: '/tickets?tab=focus&status=pending' },
          { name: 'Answered Tickets', href: '/tickets?tab=focus&status=answered' },
          { name: 'Closed Tickets', href: '/tickets?tab=focus&status=closed' },
          {
            name: 'Reassigned Tickets',
            href: '/tickets?tab=focus&status=reassigned',
            checkVisibility: (user, role) => ['buyer', 'admin', 'super_user'].includes(role),
          },
        ],
      },
      {
        name: 'Non Focus',
        icon: Box,
        subItems: [
          {
            name: 'BU Head Approval',
            href: '/tickets?tab=bu-approval',
            checkVisibility: (user, role) => {
              return !!user?.is_head || ['admin', 'buyer', 'super_user'].includes(role);
            },
          },
          {
            name: 'Declined by BU Head',
            href: '/tickets?tab=bu-declined',
            checkVisibility: (user, role) => {
              return !!user?.is_head || ['admin', 'buyer', 'super_user'].includes(role);
            },
          },
          {
            name: 'Final Approval',
            href: '/tickets?tab=final-approval',
            checkVisibility: (user, role) => {
              const isAdelGroup = ['BU1', 'BU2', 'BU5', 'BU10', 'CE01'].includes(
                user?.AccountGroup || ''
              );
              return isAdelGroup || !!user?.is_adel || ['admin', 'buyer', 'super_user'].includes(role);
            },
          },
          {
            name: 'Declined by Adel',
            href: '/tickets?tab=adel-declined',
            checkVisibility: (user, role) => {
              const isAdelGroup = ['BU1', 'BU2', 'BU5', 'BU10', 'CE01'].includes(
                user?.AccountGroup || ''
              );
              return isAdelGroup || !!user?.is_adel || ['admin', 'buyer', 'super_user'].includes(role);
            },
          },
          { name: 'Pending Tickets', href: '/tickets?tab=non-focus&status=pending' },
          { name: 'Answered Tickets', href: '/tickets?tab=non-focus&status=answered' },
          { name: 'Closed Tickets', href: '/tickets?tab=non-focus&status=closed' },
          {
            name: 'Reassigned Tickets',
            href: '/tickets?tab=non-focus&status=reassigned',
            checkVisibility: (user, role) => ['buyer', 'admin', 'super_user'].includes(role),
          },
        ],
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        name: 'Brand Maintenance',
        href: '/brands',
        icon: Tag,
        checkVisibility: (user, role) => ['admin', 'buyer', 'super_user'].includes(role),
      },
    ],
  },
];

export function getSidebarGroups(user: AuthUser | null): SidebarGroup[] {
  const role = user?.role_name || 'buyer';

  return SIDEBAR_STRUCTURE.map((group) => {
    const filteredItems = group.items
      .filter((item) => !item.checkVisibility || item.checkVisibility(user, role))
      .map((item) => {
        const filteredSubItems = item.subItems
          ? item.subItems.filter(
            (sub) => !sub.checkVisibility || sub.checkVisibility(user, role)
          )
          : undefined;

        return {
          name: item.name,
          icon: item.icon,
          href: item.href,
          isWip: item.isWip,
          subItems: filteredSubItems
            ? filteredSubItems.map((s) => ({ name: s.name, href: s.href }))
            : undefined,
        };
      });

    return {
      title: group.title,
      items: filteredItems,
    };
  }).filter((group) => group.items.length > 0);
}
