import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { AppLabel, AppCard } from '@/components/ui';
import type { Ticket as TicketType } from '@/lib/types';

interface DashboardFocusBreakdownProps {
  allTickets: TicketType[];
}

export default function DashboardFocusBreakdown({ allTickets }: DashboardFocusBreakdownProps) {
  const focusStatuses = ['pending', 'answered', 'closed', 'reassigned'];
  const focusCount = allTickets.filter((t) => focusStatuses.includes(t.status)).length;
  const nonFocusCount = allTickets.length - focusCount;
  const focusPct = allTickets.length > 0 ? Math.round((focusCount / allTickets.length) * 100) : 0;
  const nonFocusPct = 100 - focusPct;
  const circumference = 2 * Math.PI * 40; // r=40
  const dashOffset = circumference - (focusPct / 100) * circumference;

  return (
    <AppCard variant="default" padding="md">
      <div className="flex items-center justify-start">
        <div>
          <AppLabel as="h4" variant="title" className="!text-sm !font-bold">Ticket Focus Breakdown</AppLabel>
          <AppLabel as="p" variant="description" className="text-[10px] mt-0.5">Focus vs Non-Focus share in tickets</AppLabel>
        </div>
      </div>

      {/* Donut chart */}
      <div className="flex flex-col items-center gap-3 py-2">
        <div className="relative w-28 h-28">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            {/* Background circle represents the Non-Focus share (pink color) */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="#ec4899" strokeWidth="10" />
            {/* Foreground circle represents the Focus share (indigo color) */}
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke="#6366f1" strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-700"
            />
          </svg>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-base shadow-md select-none flex-col leading-none">
              <AppLabel as="span" className="text-white font-bold text-base leading-none">{focusPct}%</AppLabel>
              <AppLabel as="span" className="text-[9px] font-semibold text-white/80 mt-0.5 leading-none">Focus</AppLabel>
            </div>
          </div>
        </div>
        <div className="text-center">
          <AppLabel as="p" className="text-sm font-bold text-text">Demand split this week</AppLabel>
          <AppLabel as="p" variant="description" className="text-[11px] mt-0.5">Ratio of focused status vs other requests.</AppLabel>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="rounded-2xl border border-border/50 bg-hover/30 px-3 py-2 text-center">
          <AppLabel as="p" className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Focus</AppLabel>
          <AppLabel as="p" className="text-sm font-bold text-text mt-0.5">{focusCount} ({focusPct}%)</AppLabel>
        </div>
        <div className="rounded-2xl border border-border/50 bg-hover/30 px-3 py-2 text-center">
          <AppLabel as="p" className="text-[10px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">Non-Focus</AppLabel>
          <AppLabel as="p" className="text-sm font-bold text-text mt-0.5">{nonFocusCount} ({nonFocusPct}%)</AppLabel>
        </div>
      </div>
    </AppCard>
  );
}
