'use client';

import React from 'react';
import { AppTabs } from '@/components/ui';

const STATUS_TABS = [
  { id: 'all', label: 'All' },
  { id: 'focus', label: 'Focus' },
  { id: 'non-focus', label: 'Non Focus' },
  { id: 'bu-approval', label: 'BU Head Approval' },
  { id: 'bu-declined', label: 'BU Head Declined' },
  { id: 'final-approval', label: 'Final Approval' },
  { id: 'adel-declined', label: 'Declined by Adel' },
];

interface TicketTabsProps {
  activeTab: string;
  onChange: (tabId: string) => void;
  role: string;
}

export function TicketTabs({ activeTab, onChange, role }: TicketTabsProps) {
  const displayedTabs = React.useMemo(() => {
    if (role === 'sales') {
      return STATUS_TABS.filter(
        (tab) => tab.id !== 'final-approval' && tab.id !== 'adel-declined'
      );
    }
    return STATUS_TABS;
  }, [role]);

  return (
    <AppTabs
      tabs={displayedTabs}
      activeTab={activeTab}
      onChange={onChange}
    />
  );
}
