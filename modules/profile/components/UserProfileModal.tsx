'use client';

import React, { useState } from 'react';
import { UserCheck, User, Mail, Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/components/utils/clipboard';
import { AppAvatar, AppLabel, AppModal } from '@integrated-computer-system/ui-kit';
import { AppTabs, AppButton } from '@/components/ui';
import { useUserProfile, useUserTicketsStats, useUserLogs } from '@/modules/profile';
import { UserProfileModalProps } from '../types';
import { ProfileActivityLogsTab, ProfileTicketsTab } from './tabs';

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  open,
  onClose,
  userId,
  userName,
  period: initialPeriod = 'week',
}) => {
  const [activeTab, setActiveTab] = useState<string>('activity');
  const [period, setPeriod] = useState<'today' | 'week' | 'all'>(initialPeriod);
  const { copied, copy } = useCopyToClipboard();

  const { data: userProfile } = useUserProfile(String(userId), open);
  const { data: stats } = useUserTicketsStats(String(userId), period, open);
  const { data: logs, isLoading: isLogsLoading } = useUserLogs(String(userId), period === 'all' ? 'week' : period, open);

  const user = userProfile || stats?.user;

  return (
    <AppModal open={open} onClose={onClose} width="920px" centered>
      <AppModal.Body className="!p-0 overflow-hidden">
        <div className="flex h-[70vh]">
          {/* Left Panel */}
          <div className="w-[30%] shrink-0 border-r border-border/60 bg-neutral/30 p-5 flex flex-col justify-between">
            <div className="flex flex-col items-center text-center gap-3 pt-2">
              <AppAvatar
                name={userName}
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`}
                size={96}
                className="shrink-0 rounded-full ring-2 ring-border/50 shadow-sm"
              />
              <div className="space-y-1 w-full px-2">
                <AppLabel as="h3" variant="title" className="text-base font-bold text-foreground leading-tight truncate">
                  {userName}
                </AppLabel>

                <div className="flex flex-col items-center gap-1 mt-1 text-[11px] font-medium text-text-info/80">
                  {user?.group && (
                    <div className="flex items-center gap-1 justify-center max-w-full">
                      <UserCheck size={12} className="shrink-0 text-text-info/50" />
                      <span className="truncate">{user.group}</span>
                    </div>
                  )}

                  {user?.role && (
                    <div className="flex items-center gap-1 justify-center max-w-full">
                      <User size={12} className="shrink-0 text-text-info/50" />
                      <span className="truncate capitalize">
                        {user.role}
                      </span>
                    </div>
                  )}

                  {user?.email && (
                    <div
                      className="flex items-center gap-1 justify-center cursor-pointer text-accent-1 hover:underline group/email relative max-w-full"
                      onClick={() => user?.email && copy(user.email)}
                    >
                      <Mail size={12} className="shrink-0 text-text-info/50 group-hover/email:text-accent-1 transition-colors" />
                      <span className="truncate">{user.email}</span>
                      {copied ? (
                        <Check size={10} className="text-emerald-500 shrink-0 ml-1" />
                      ) : (
                        <Copy size={10} className="text-text-info/40 group-hover/email:text-accent-1 transition-colors shrink-0 ml-1" />
                      )}
                    </div>
                  )}
                </div>

                {/* Period toggles */}
                <div className="pt-1.5 flex gap-1 justify-center flex-wrap">
                  <AppButton
                    variant={period === 'today' ? 'primary' : 'neutral'}
                    size="sm"
                    className="!py-0.5 !px-2 !h-6 !text-[10px]"
                    onClick={() => setPeriod('today')}
                  >
                    Today
                  </AppButton>
                  <AppButton
                    variant={period === 'week' ? 'primary' : 'neutral'}
                    size="sm"
                    className="!py-0.5 !px-2 !h-6 !text-[10px]"
                    onClick={() => setPeriod('week')}
                  >
                    This Week
                  </AppButton>
                  <AppButton
                    variant={period === 'all' ? 'primary' : 'neutral'}
                    size="sm"
                    className="!py-0.5 !px-2 !h-6 !text-[10px]"
                    onClick={() => setPeriod('all')}
                  >
                    All Time
                  </AppButton>
                </div>
              </div>
            </div>

            <div className="my-5 h-px bg-border/60" />

            <div className="space-y-2 flex-1">
              <AppLabel as="p" className="text-[10px] uppercase font-bold text-text-info/60 tracking-wider mb-2">
                Statistics
              </AppLabel>
              <div className="px-3.5 py-2 rounded-xl bg-card-bg border border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  <AppLabel as="p" className="text-xs font-semibold text-text-info">Total Tickets</AppLabel>
                </div>
                <AppLabel as="p" className="text-base font-bold text-foreground">{stats?.total ?? 0}</AppLabel>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-card-bg border border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <AppLabel as="p" className="text-xs font-semibold text-text-info">Pending</AppLabel>
                </div>
                <AppLabel as="p" className="text-base font-bold text-amber-600 dark:text-amber-400">{stats?.pending ?? 0}</AppLabel>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-card-bg border border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <AppLabel as="p" className="text-xs font-semibold text-text-info">Answered / Closed</AppLabel>
                </div>
                <AppLabel as="p" className="text-base font-bold text-emerald-600 dark:text-emerald-400">{stats?.answered ?? 0}</AppLabel>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-card-bg border border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <AppLabel as="p" className="text-xs font-semibold text-text-info">Declined</AppLabel>
                </div>
                <AppLabel as="p" className="text-base font-bold text-rose-600 dark:text-rose-400">{stats?.declined ?? 0}</AppLabel>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <AppTabs
              tabs={[
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
                      Tickets
                    </span>
                  ),
                },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
              variant="pills"
            />

            <div className="flex-1 overflow-y-auto mt-3 max-h-[55vh]">
              {activeTab === 'activity' ? (
                <ProfileActivityLogsTab
                  logs={logs}
                  isLoading={isLogsLoading}
                  onClose={onClose}
                />
              ) : (
                <ProfileTicketsTab
                  userId={userId}
                  period={period}
                />
              )}
            </div>
          </div>
        </div>
      </AppModal.Body>
    </AppModal>
  );
};

export default UserProfileModal;
