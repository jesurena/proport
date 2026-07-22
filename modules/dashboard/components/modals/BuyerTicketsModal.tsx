'use client';

import React, { useState } from 'react';
import { Calendar, UserCheck } from 'lucide-react';
import { AppAvatar, AppLabel, AppModal } from '@integrated-computer-system/ui-kit';
import { AppTabs, AppButton } from '@/components/ui';
import { useBuyerTicketsStats } from '@/modules/dashboard/hooks/useDashboard';
import { BuyerActivityLogsTab, BuyerTicketsTab } from '../tabs';

interface BuyerTicketsModalProps {
  open: boolean;
  onClose: () => void;
  buyerId: string | number;
  buyerName: string;
  buyerPeriod: 'today' | 'week';
}

export default function BuyerTicketsModal({
  open,
  onClose,
  buyerId,
  buyerName,
  buyerPeriod,
}: BuyerTicketsModalProps) {
  const [activeTab, setActiveTab] = useState<string>('activity');
  const { data: queryStats } = useBuyerTicketsStats(String(buyerId), buyerPeriod, open);
  const totalTickets = queryStats?.total ?? 0;
  const answeredCount = queryStats?.answered ?? 0;
  const pendingCount = queryStats?.pending ?? 0;
  const tabItems = [
    {
      id: 'activity',
      label: (
        <span className="flex items-center gap-1.5 font-bold text-xs">
          Activity Feed
        </span>
      ),
    },
    {
      id: 'tickets',
      label: (
        <span className="flex items-center gap-1.5 font-bold text-xs">
          Assigned Tickets
        </span>
      ),
    },
  ];

  return (
    <AppModal open={open} onClose={onClose} width="850px" centered>
      <AppModal.Body className="space-y-4">
        <div className="bg-neutral/20 border border-border/40 rounded-2xl p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <AppAvatar
                name={buyerName}
                src={queryStats?.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${buyerName}`}
                size={52}
                className="shrink-0 rounded-full ring-2 ring-border/40 shadow-sm"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <AppLabel as="h3" variant="title" className="text-base font-bold text-foreground">
                    {buyerName}
                  </AppLabel>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <Calendar size={11} />
                    {buyerPeriod === 'today' ? 'Today' : 'This Week'}
                  </span>
                </div>
                {queryStats?.user?.group && (
                  <AppLabel as="p" variant="description" className="text-[11px] font-medium flex items-center gap-1 text-text-info/80">
                    <UserCheck size={12} />
                    {queryStats.user.group}
                  </AppLabel>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="px-3 py-1.5 rounded-xl bg-card-bg border border-border/40 text-center min-w-[64px]">
                <AppLabel as="p" className="text-[9px] uppercase font-bold text-text-info">Assigned</AppLabel>
                <AppLabel as="p" className="text-xs font-bold text-foreground">{totalTickets}</AppLabel>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center min-w-[64px]">
                <AppLabel as="p" className="text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Answered</AppLabel>
                <AppLabel as="p" className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{answeredCount}</AppLabel>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center min-w-[64px]">
                <AppLabel as="p" className="text-[9px] uppercase font-bold text-amber-600 dark:text-amber-400">Pending</AppLabel>
                <AppLabel as="p" className="text-xs font-bold text-amber-600 dark:text-amber-400">{pendingCount}</AppLabel>
              </div>
            </div>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          <AppTabs
            tabs={tabItems}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="pills"
          />

          {activeTab === 'activity' && (
            <BuyerActivityLogsTab
              buyerId={buyerId}
              buyerPeriod={buyerPeriod}
              open={open}
              onClose={onClose}
            />
          )}

          {activeTab === 'tickets' && (
            <BuyerTicketsTab
              buyerId={buyerId}
              buyerPeriod={buyerPeriod}
              open={open}
            />
          )}
        </div>
      </AppModal.Body>
      <AppModal.Footer>
        <AppButton variant="neutral" onClick={onClose}>
          Close
        </AppButton>
      </AppModal.Footer>
    </AppModal>
  );
}
