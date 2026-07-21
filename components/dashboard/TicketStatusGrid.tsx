'use client';

import React from 'react';
import { cn } from '@integrated-computer-system/ui-kit';
import { AppCard, AppLabel } from '@/components/ui';
import { StatusCount, STATUS_META, TicketStatus } from '@/lib/types';
import {
  Inbox,
  CircleDot,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRightLeft,
} from 'lucide-react';

const STATUS_ICONS: Partial<Record<TicketStatus, React.ReactNode>> = {
  unassigned: <Inbox size={18} />,
  assigned: <CircleDot size={18} />,
  pending: <Clock size={18} />,
  answered: <CheckCircle2 size={18} />,
  closed: <XCircle size={18} />,
  escalated: <AlertTriangle size={18} />,
  reassigned: <ArrowRightLeft size={18} />,
  'bu-approval': <CircleDot size={18} />,
  'bu-declined': <XCircle size={18} />,
  'final-approval': <CheckCircle2 size={18} />,
  'adel-declined': <XCircle size={18} />,
};

interface TicketStatusGridProps {
  counts: StatusCount[];
  onStatusClick?: (status: TicketStatus) => void;
}

export default function TicketStatusGrid({ counts, onStatusClick }: TicketStatusGridProps) {
  return (
    <AppCard variant="default" padding="md">
      <AppLabel as="h3" variant="title" className="!text-sm !font-semibold mb-4">
        Inquiries by Status
      </AppLabel>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {counts.map((item) => {
          const meta = STATUS_META[item.status] || { label: item.status, color: '#6b7280', chipVariant: 'default' };
          const icon = STATUS_ICONS[item.status] || <CircleDot size={18} />;
          return (
            <button
              key={item.status}
              onClick={() => onStatusClick?.(item.status)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border border-border/40',
                'transition-all duration-200 hover:border-border hover:bg-hover/40',
                'text-left cursor-pointer group'
              )}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
              >
                {icon}
              </div>
              <div className="flex flex-col min-w-0">
                <AppLabel as="span" className="text-lg font-bold text-text">
                  {item.count}
                </AppLabel>
                <AppLabel as="span" variant="description" className="text-[11px] font-medium text-text-info truncate">
                  {meta.label}
                </AppLabel>
              </div>
            </button>
          );
        })}
      </div>
    </AppCard>
  );
}
