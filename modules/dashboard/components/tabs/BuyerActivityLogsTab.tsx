import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { AppChip, AppEmptyState, AppLabel } from '@/components/ui';
import { useBuyerLogs } from '@/modules/dashboard/hooks/useDashboard';
import { timeAgo, formatActivityDateKey } from '@/components/utils/time';
import { formatActivityText, getLogCategoryMeta } from '../../utils/activity';
import type { ActivityItem } from '../../types/dashboard';

interface BuyerActivityLogsTabProps {
  buyerId: string | number;
  buyerPeriod: 'today' | 'week';
  open: boolean;
  onClose: () => void;
}

export default function BuyerActivityLogsTab({
  buyerId,
  buyerPeriod,
  open,
  onClose,
}: BuyerActivityLogsTabProps) {
  const { data: logsData, isLoading: isLogsLoading } = useBuyerLogs(String(buyerId), buyerPeriod, open);

  const logsArray = useMemo(() => {
    if (!logsData) return [];
    if (Array.isArray(logsData)) return logsData;
    if (typeof logsData === 'object' && Array.isArray((logsData as any).data)) {
      return (logsData as any).data;
    }
    return [];
  }, [logsData]);

  const groupedLogs = useMemo(() => {
    const groups: { [key: string]: ActivityItem[] } = {};

    logsArray.forEach((item: any) => {
      const groupKey = formatActivityDateKey(item.timestamp);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });

    return Object.entries(groups);
  }, [logsArray]);

  return (
    <div className="py-2 pr-1">
      {isLogsLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-text-info space-y-3">
          <Loader2 className="w-7 h-7 animate-spin text-accent-1 opacity-80" />
          <AppLabel as="p" className="text-[11px] font-semibold tracking-wide text-text-info/70">
            Fetching activity logs...
          </AppLabel>
        </div>
      ) : groupedLogs.length > 0 ? (
        <div className="space-y-5">
          {groupedLogs.map(([dateLabel, items]) => (
            <div key={dateLabel}>
              {/* Date group header */}
              <div className="flex items-center gap-3 mb-3">
                <AppLabel as="h4" className="text-[10px] font-bold text-text-info/50 tracking-widest uppercase whitespace-nowrap">
                  {dateLabel}
                </AppLabel>
                <div className="flex-1 h-px bg-border/40" />
                <AppLabel as="span" className="text-[10px] font-medium text-text-info/40">
                  {items.length} {items.length === 1 ? 'entry' : 'entries'}
                </AppLabel>
              </div>

              {/* Timeline */}
              <div className="relative ml-[18px]">
                {/* Vertical connector line */}
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

                          {item.detail && (
                            <AppLabel as="p" variant="description" className="text-[11px] line-clamp-1 mt-0.5 text-text-info/60">
                              &ldquo;{item.detail.replace(/<[^>]*>?/gm, '')}&rdquo;
                            </AppLabel>
                          )}

                          <div className="flex items-center gap-1.5 mt-1">
                            <AppLabel as="span" variant="description" className="text-[10px] text-text-info/50">
                              {timeAgo(item.timestamp)}
                            </AppLabel>
                            {item.subject && (
                              <>
                                <span className="text-text-info/30">·</span>
                                <AppLabel as="span" variant="description" className="text-[10px] text-text-info/50 truncate max-w-[220px]">
                                  {item.subject}
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
                        {/* Timeline dot */}
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
      ) : (
        <AppEmptyState
          title="No Activity Found"
          description="No recent activity found for this period."
          imageSrc="/aria-mascott-sad.svg"
          imageSize={120}
          bordered
        />
      )}
    </div>
  );
}
