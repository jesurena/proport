'use client';

import React, { useState } from 'react';
import { AppLabel, AppCard, AppButton } from '@/components/ui';
import { useFocusBreakdown } from '../hooks/useDashboard';
import { DashboardFocusBreakdownSkeleton } from '@/components/skeleton/dashboard';

const REQUEST_TYPE_LABELS: Record<string, string> = {
  cost: 'Cost Ticket',
  demo: 'Demo Unit',
  service: 'Service Schedule',
  eta: 'ETA Ticket',
};

const REQUEST_TYPE_COLORS: Record<string, string> = {
  cost: 'bg-indigo-600 dark:bg-indigo-500',
  demo: 'bg-blue-600 dark:bg-blue-500',
  service: 'bg-emerald-600 dark:bg-emerald-500',
  eta: 'bg-purple-600 dark:bg-purple-500',
  unknown: 'bg-neutral-500',
};

export default function DashboardFocusBreakdown() {
  const [showMore, setShowMore] = useState(false);
  const { data: breakdown, isLoading } = useFocusBreakdown();

  const focusCount = breakdown?.focus ?? 0;
  const nonFocusCount = breakdown?.non_focus ?? 0;

  const totalTickets = focusCount + nonFocusCount || 1;
  const focusPct = Math.round((focusCount / totalTickets) * 100);
  const nonFocusPct = 100 - focusPct;
  const circumference = 2 * Math.PI * 40; // r=40
  const dashOffset = circumference - (focusPct / 100) * circumference;

  return (
    <AppCard variant="default" padding="md" className="space-y-3">
      <div className="flex items-center justify-start">
        <div>
          <AppLabel as="h4" variant="title" className="!text-sm !font-bold">Ticket Focus Breakdown</AppLabel>
          <AppLabel as="p" variant="description" className="text-[10px] mt-0.5">Focus vs Non-Focus share in tickets</AppLabel>
        </div>
      </div>

      {isLoading ? (
        <DashboardFocusBreakdownSkeleton />
      ) : (
        <>
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

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="rounded-2xl border border-border/50 bg-hover/30 px-3 py-2 text-center">
              <AppLabel as="p" className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Focus</AppLabel>
              <AppLabel as="p" className="text-sm font-bold text-text mt-0.5">{focusCount} ({focusPct}%)</AppLabel>
            </div>
            <div className="rounded-2xl border border-border/50 bg-hover/30 px-3 py-2 text-center">
              <AppLabel as="p" className="text-[10px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">Non-Focus</AppLabel>
              <AppLabel as="p" className="text-sm font-bold text-text mt-0.5">{nonFocusCount} ({nonFocusPct}%)</AppLabel>
            </div>
          </div>

      {/* View More Button */}
      <div className="pt-2 text-center">
        <AppButton
          variant="link"
          size="sm"
          onClick={() => setShowMore(!showMore)}
          className="!text-xs select-none"
        >
          {showMore ? 'Show Less' : 'View More'}
        </AppButton>
      </div>

      {/* Tickets per Request Type Details */}
      {showMore && (
        <div className="border-t border-border/40 pt-4 mt-1 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <AppLabel as="span" className="text-[11px] font-bold text-text-info uppercase tracking-wider block mb-1">
            Tickets per Request Type
          </AppLabel>
          <div className="space-y-3">
            {breakdown?.request_types && breakdown.request_types.map((rt: any) => {
              const count = Number(rt.count_per_rtype) || 0;
              const pct = totalTickets > 0 ? Math.round((count / totalTickets) * 100) : 0;
              const typeKey = Object.keys(REQUEST_TYPE_LABELS).find(
                (key) => REQUEST_TYPE_LABELS[key].toLowerCase() === String(rt.request_type).toLowerCase()
              ) || 'unknown';
              const barColor = REQUEST_TYPE_COLORS[typeKey] || REQUEST_TYPE_COLORS.unknown;
              return (
                <div key={rt.request_type_id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-text">
                    <span className="truncate">{rt.request_type}</span>
                    <span>{count} ({pct}%)</span>
                  </div>
                  {/* Progress Bar Container */}
                  <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
        </>
      )}
    </AppCard>
  );
}
