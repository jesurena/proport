import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { AppChip, AppButton, AppEmptyState, AppLabel } from '@/components/ui';
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
    <div className="space-y-6 py-2 pr-2">
      {isLogsLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-text-info space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-accent-1 opacity-80" />
          <AppLabel as="p" className="text-xs font-semibold tracking-wide">
            Fetching activity logs...
          </AppLabel>
        </div>
      ) : groupedLogs.length > 0 ? (
        groupedLogs.map(([dateLabel, items]) => (
          <div key={dateLabel} className="space-y-3">
            <div className="flex items-center gap-2 ml-1 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-1 shrink-0" />
              <AppLabel as="h4" className="text-[10px] font-black text-foreground/80 tracking-wider uppercase leading-none">
                {dateLabel}
              </AppLabel>
            </div>
            <div className="relative pl-8 border-l-2 border-border/30 ml-4 py-2 space-y-6">
              {items.map((item) => {
                const { icon: LogIcon, colorClass } = getLogCategoryMeta(item.actionText);

                return (
                  <div key={item.id} className="relative flex items-start select-none">
                    <div className={`absolute -left-[48px] top-2 w-8 h-8 rounded-full flex items-center justify-center bg-card-bg ${colorClass}`}>
                      <LogIcon size={14} className="text-white" />
                    </div>
                    {item.ticketId ? (
                      <Link
                        href={`/tickets/${item.ticketId}`}
                        onClick={onClose}
                        className="group flex-1 hover:bg-neutral/5 p-2.5 rounded-2xl border border-transparent hover:border-border/30 hover:shadow-sm transition-all flex items-start justify-between gap-4 cursor-pointer"
                      >
                        <div className="min-w-0 flex-1">
                          <AppLabel as="p" className="text-xs text-foreground leading-snug">
                            {formatActivityText(item.actionText)}
                          </AppLabel>

                          {item.detail && (
                            <AppLabel as="p" variant="description" className="text-[11px] line-clamp-1 italic mt-0.5 opacity-90">
                              "{item.detail.replace(/<[^>]*>?/gm, '')}"
                            </AppLabel>
                          )}

                          <AppLabel as="p" variant="description" className="text-[10px] mt-0.5 flex items-center gap-1.5 opacity-70">
                            <span>{timeAgo(item.timestamp)}</span>
                            <span>•</span>
                            <span className="truncate max-w-[260px]">{item.subject}</span>
                          </AppLabel>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-center">
                          <AppButton
                            variant="neutral"
                            size="icon"
                            className="!w-8 !h-8 rounded-full opacity-0 group-hover:opacity-100 hover:!bg-accent-1 hover:!text-white hover:!border-accent-1 transition-all duration-200 shadow-sm shrink-0"
                          >
                            <ArrowRight size={13} />
                          </AppButton>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex-1 p-2.5 rounded-2xl border border-transparent flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <AppLabel as="p" className="text-xs text-foreground leading-snug">
                            {formatActivityText(item.actionText)}
                          </AppLabel>

                          {item.detail && (
                            <AppLabel as="p" variant="description" className="text-[11px] line-clamp-1 italic mt-0.5 opacity-90">
                              "{item.detail.replace(/<[^>]*>?/gm, '')}"
                            </AppLabel>
                          )}

                          <AppLabel as="p" variant="description" className="text-[10px] mt-0.5 flex items-center gap-1.5 opacity-70">
                            <span>{timeAgo(item.timestamp)}</span>
                            <span>•</span>
                            <span className="truncate max-w-[260px]">{item.subject}</span>
                          </AppLabel>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
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
