import React from 'react';
import {
  LayoutDashboard,
  Ticket,
  FileBarChart,
  Mail,
  Layers,
  Tag,
} from 'lucide-react';

export interface SidebarItem {
  name: string;
  icon: React.ComponentType<any>;
  href?: string;
  badge?: number;
  subItems?: { name: string; href: string }[];
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
        { name: 'All Request', href: '/tickets', icon: Ticket, badge: totalOpen },
      ],
    },
    {
      title: 'Status Filtering',
      items: [
        {
          name: 'Focus',
          icon: Mail,
          subItems: [
            { name: 'Pending Request', href: '/tickets?tab=focus&status=pending' },
            { name: 'Answered Request', href: '/tickets?tab=focus&status=answered' },
            { name: 'Closed Request', href: '/tickets?tab=focus&status=closed' },
          ],
        },
        {
          name: 'Non Focus',
          icon: Layers,
          subItems: [
            { name: 'BU Head Approval', href: '/tickets?tab=bu-approval' },
            { name: 'Declined by BU Head', href: '/tickets?tab=bu-declined' },
            { name: 'Pending Request', href: '/tickets?tab=non-focus&status=pending' },
            { name: 'Answered Request', href: '/tickets?tab=non-focus&status=answered' },
            { name: 'Closed Request', href: '/tickets?tab=non-focus&status=closed' },
          ],
        },
      ],
    },
  ] : [
    {
      title: 'Navigation',
      items: [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'All Inquiries', href: '/tickets', icon: Ticket, badge: totalOpen },
        { name: 'Reports', href: '/reports', icon: FileBarChart },
      ],
    },
    {
      title: 'Status Filtering',
      items: [
        {
          name: 'Focus',
          icon: Mail,
          subItems: [
            { name: 'Pending Request', href: '/tickets?tab=focus&status=pending' },
            { name: 'Answered Request', href: '/tickets?tab=focus&status=answered' },
            { name: 'Closed Request', href: '/tickets?tab=focus&status=closed' },
            { name: 'Reassigned Request', href: '/tickets?tab=focus&status=reassigned' },
          ],
        },
        {
          name: 'Non Focus',
          icon: Layers,
          subItems: [
            { name: 'BU Head Approval', href: '/tickets?tab=bu-approval' },
            { name: 'Declined by BU Head', href: '/tickets?tab=bu-declined' },
            { name: 'Final Approval', href: '/tickets?tab=non-focus&status=final-approval' },
            { name: 'Declined by Adel', href: '/tickets?tab=non-focus&status=adel-declined' },
            { name: 'Pending Request', href: '/tickets?tab=non-focus&status=pending' },
            { name: 'Answered Request', href: '/tickets?tab=non-focus&status=answered' },
            { name: 'Closed Request', href: '/tickets?tab=non-focus&status=closed' },
            { name: 'Reassigned Request', href: '/tickets?tab=non-focus&status=reassigned' },
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
