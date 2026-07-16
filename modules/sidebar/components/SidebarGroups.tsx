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

export function getSidebarGroups(role: string, totalOpen: number): SidebarGroup[] {
  return role === 'sales' ? [
    {
      title: 'Navigation',
      items: [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'All Tickets', href: '/tickets', icon: Ticket, badge: totalOpen },
        { name: 'Reports', href: '/reports', icon: FileBarChart, isWip: true },
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
          ],
        },
        {
          name: 'Non Focus',
          icon: Box,
          subItems: [
            { name: 'BU Head Approval', href: '/tickets?tab=bu-approval' },
            { name: 'Declined by BU Head', href: '/tickets?tab=bu-declined' },
            { name: 'Pending Tickets', href: '/tickets?tab=non-focus&status=pending' },
            { name: 'Answered Tickets', href: '/tickets?tab=non-focus&status=answered' },
            { name: 'Closed Tickets', href: '/tickets?tab=non-focus&status=closed' },
          ],
        },
      ],
    },
  ] : [
    {
      title: 'Navigation',
      items: [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'All Tickets', href: '/tickets', icon: Ticket, badge: totalOpen },
        { name: 'Reports', href: '/reports', icon: FileBarChart, isWip: true },
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
            { name: 'Reassigned Tickets', href: '/tickets?tab=focus&status=reassigned' },
          ],
        },
        {
          name: 'Non Focus',
          icon: Box,
          subItems: [
            { name: 'BU Head Approval', href: '/tickets?tab=bu-approval' },
            { name: 'Declined by BU Head', href: '/tickets?tab=bu-declined' },
            { name: 'Final Approval', href: '/tickets?tab=final-approval' },
            { name: 'Declined by Adel', href: '/tickets?tab=adel-declined' },
            { name: 'Pending Tickets', href: '/tickets?tab=non-focus&status=pending' },
            { name: 'Answered Tickets', href: '/tickets?tab=non-focus&status=answered' },
            { name: 'Closed Tickets', href: '/tickets?tab=non-focus&status=closed' },
            { name: 'Reassigned Tickets', href: '/tickets?tab=non-focus&status=reassigned' },
          ],
        },
      ],
    },
    {
      title: 'System',
      items: [
        { name: 'Brand Maintenance', href: '/brands', icon: Tag },
      ],
    },
  ];
}
