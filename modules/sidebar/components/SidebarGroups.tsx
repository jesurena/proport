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
            { name: 'Pending Request', href: '/tickets?status=pending' },
            { name: 'Answered Request', href: '/tickets?status=answered' },
            { name: 'Closed Request', href: '/tickets?status=closed' },
          ],
        },
        {
          name: 'Non Focus',
          icon: Layers,
          subItems: [
            { name: 'BU Head Approval', href: '/tickets?status=bu-approval' },
            { name: 'Declined by BU Head', href: '/tickets?status=bu-declined' },
            { name: 'Pending Request', href: '/tickets?status=pending' },
            { name: 'Answered Request', href: '/tickets?status=answered' },
            { name: 'Closed Request', href: '/tickets?status=closed' },
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
            { name: 'Pending Request', href: '/tickets?status=pending' },
            { name: 'Answered Request', href: '/tickets?status=answered' },
            { name: 'Closed Request', href: '/tickets?status=closed' },
            { name: 'Reassigned Request', href: '/tickets?status=reassigned' },
          ],
        },
        {
          name: 'Non Focus',
          icon: Layers,
          subItems: [
            { name: 'BU Head Approval', href: '/tickets?status=bu-approval' },
            { name: 'Declined by BU Head', href: '/tickets?status=bu-declined' },
            { name: 'Final Approval', href: '/tickets?status=final-approval' },
            { name: 'Declined by Adel', href: '/tickets?status=adel-declined' },
            { name: 'Pending Request', href: '/tickets?status=pending' },
            { name: 'Answered Request', href: '/tickets?status=answered' },
            { name: 'Closed Request', href: '/tickets?status=closed' },
            { name: 'Reassigned Request', href: '/tickets?status=reassigned' },
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
