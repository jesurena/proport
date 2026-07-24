'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AppLabel } from '@integrated-computer-system/ui-kit';
import { AppEmptyState } from '@/components/ui';
import { UserProfileActivityLogsSkeleton } from '@/components/skeleton';
import { timeAgo, formatActivityDateKey } from '@/components/utils/time';
import { formatActivityText, getLogCategoryMeta } from '@/modules/dashboard/utils/activity';

interface ProfileActivityLogsTabProps {
  logs?: any[];
  isLoading: boolean;
  onClose: () => void;
}

export function ProfileActivityLogsTab({ logs, isLoading, onClose }: ProfileActivityLogsTabProps) {
  const groupedLogs = useMemo(() => {
    if (!logs) return [];
    const logsArray = Array.isArray(logs) ? logs : (logs as any).data || [];
    const groups: { [key: string]: any[] } = {};

    logsArray.forEach((item: any) => {
      const groupKey = formatActivityDateKey(item.timestamp);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });

    return Object.entries(groups);
  }, [logs]);

  if (isLoading) {
    return <UserProfileActivityLogsSkeleton count={4} />;
  }

  if (groupedLogs.length === 0) {
    return (
      <AppEmptyState
        title="No Activity Logs"
        description="No logs found for this user's account."
        imageSrc="/aria-mascott-sad.svg"
        imageSize={120}
        bordered
      />
    );
  }

  return (
    <div className="space-y-5 pr-1">
      {groupedLogs.map(([dateLabel, items]) => (
        <div key={dateLabel}>
          <div className="flex items-center gap-3 mb-3">
            <AppLabel as="h4" className="text-[10px] font-bold text-text-info/50 tracking-widest uppercase whitespace-nowrap">
              {dateLabel}
            </AppLabel>
            <div className="flex-1 h-px bg-border/40" />
            <AppLabel as="span" className="text-[10px] font-medium text-text-info/40">
              {items.length} {items.length === 1 ? 'entry' : 'entries'}
            </AppLabel>
          </div>

          <div className="relative ml-[18px]">
            <div className="absolute left-0 top-4 bottom-4 w-px bg-border/40" />
            <div className="space-y-1">
              {items.map((item) => {
                const { icon: LogIcon, colorClass } = getLogCategoryMeta(item.actionText);

                const content = (
                  <>
                    <div className="min-w-0 flex-1">
                      <AppLabel as="p" className="text-xs text-foreground leading-snug font-medium">
                        {formatActivityText(item.actionText)}
                      </AppLabel>
                      <div className="flex items-center gap-1.5 mt-1">
                        <AppLabel as="span" variant="description" className="text-[10px] text-text-info/50">
                          {timeAgo(item.timestamp)}
                        </AppLabel>
                        {item.ticketNumber && (
                          <>
                            <span className="text-text-info/30">·</span>
                            <AppLabel as="span" variant="description" className="text-[10px] text-text-info/50 font-bold">
                              {item.ticketNumber}
                            </AppLabel>
                          </>
                        )}
                      </div>
                    </div>

                    {item.ticketId && (
                      <div className="flex items-center gap-1.5 shrink-0 self-center">
                        <ArrowRight size={12} className="text-text-info/30 group-hover:text-accent-1 transition-colors" />
                      </div>
                    )}
                  </>
                );

                return (
                  <div key={item.id} className="relative flex items-start pl-9">
                    <div className={`absolute left-[-12px] top-2.5 w-6 h-6 rounded-full flex items-center justify-center ${colorClass} ring-2 ring-card-bg`}>
                      <LogIcon size={12} className="text-white" />
                    </div>

                    {item.ticketId ? (
                      <Link
                        href={`/tickets/${item.ticketId}`}
                        onClick={onClose}
                        className="group flex-1 flex items-start justify-between gap-3 p-2.5 rounded-xl border border-transparent hover:bg-neutral/40 hover:border-border/30 transition-all cursor-pointer"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div className="flex-1 flex items-start justify-between gap-3 p-2.5 rounded-xl">
                        {content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
