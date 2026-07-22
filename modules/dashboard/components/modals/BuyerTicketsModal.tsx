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
    <AppModal open={open} onClose={onClose} width="920px" centered>
      <AppModal.Body className="!p-0 overflow-hidden">
        <div className="flex h-[70vh]">
          <div className="w-[30%] shrink-0 border-r border-border/60 bg-neutral/30 p-5 flex flex-col">
            <div className="flex flex-col items-center text-center gap-3 pt-2">
              <AppAvatar
                name={buyerName}
                src={queryStats?.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${buyerName}`}
                size={96}
                className="shrink-0 rounded-full ring-2 ring-border/50 shadow-sm"
              />
              <div className="space-y-1">
                <AppLabel as="h3" variant="title" className="text-base font-bold text-foreground leading-tight">
                  {buyerName}
                </AppLabel>
                {queryStats?.user?.group && (
                  <AppLabel as="p" variant="description" className="text-[11px] font-medium flex items-center justify-center gap-1 text-text-info/80">
                    <UserCheck size={12} />
                    {queryStats.user.group}
                  </AppLabel>
                )}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                  <Calendar size={11} />
                  {buyerPeriod === 'today' ? 'Today' : 'This Week'}
                </span>
              </div>
            </div>

            <div className="my-5 h-px bg-border/60" />

            <div className="space-y-2">
              <AppLabel as="p" className="text-[10px] uppercase font-bold text-text-info/60 tracking-wider mb-2">Statistics</AppLabel>
              <div className="px-3.5 py-2.5 rounded-xl bg-card-bg border border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  <AppLabel as="p" className="text-xs font-semibold text-text-info">Assigned</AppLabel>
                </div>
                <AppLabel as="p" className="text-lg font-bold text-foreground">{totalTickets}</AppLabel>
              </div>
              <div className="px-3.5 py-2.5 rounded-xl bg-card-bg border border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <AppLabel as="p" className="text-xs font-semibold text-text-info">Answered</AppLabel>
                </div>
                <AppLabel as="p" className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{answeredCount}</AppLabel>
              </div>
              <div className="px-3.5 py-2.5 rounded-xl bg-card-bg border border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <AppLabel as="p" className="text-xs font-semibold text-text-info">Pending</AppLabel>
                </div>
                <AppLabel as="p" className="text-lg font-bold text-amber-600 dark:text-amber-400">{pendingCount}</AppLabel>
              </div>
            </div>
          </div>

          {/* Right content – 70% */}
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <AppTabs
              tabs={tabItems}
              activeTab={activeTab}
              onChange={setActiveTab}
              variant="pills"
            />

            <div className="flex-1 overflow-y-auto mt-3 max-h-[55vh]">
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
          </div>
        </div>
      </AppModal.Body>
    </AppModal>
  );
}
