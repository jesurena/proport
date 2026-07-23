'use client';

import React from 'react';
import { AppTabs } from '@/components/ui';
import { AuthUser } from '@/modules/auth/types/user';
import { getTicketTabs } from '../../config/ticket-tabs.config';

interface TicketTabsProps {
  activeTab: string;
  onChange: (tabId: string) => void;
  user: AuthUser | null;
  role: string;
}

export function TicketTabs({ activeTab, onChange, user, role }: TicketTabsProps) {
  const displayedTabs = React.useMemo(() => {
    return getTicketTabs(user, role);
  }, [user, role]);

  return (
    <AppTabs
      tabs={displayedTabs}
      activeTab={activeTab}
      onChange={onChange}
    />
  );
}
