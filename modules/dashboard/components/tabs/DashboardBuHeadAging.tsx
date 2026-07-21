'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { AppAvatar, AppButton } from '@/components/ui';
import { useBuHeadAging } from '../../hooks/useBuHead';

export default function DashboardBuHeadAging() {
  const { data: agingData, isLoading } = useBuHeadAging();

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* SLA Threshold Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="text-xs text-foreground/60 font-medium block">On Track (&lt;48 Hours)</span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {agingData?.on_track_count ?? 0} Pending
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/15 text-red-500 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
            <div>
              <span className="text-xs text-foreground/60 font-medium block">Overdue (&gt;48 Hours)</span>
              <span className="text-xl font-bold text-red-600 dark:text-red-400">
                {agingData?.overdue_count ?? 0} Overdue
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Items Table */}
      <div className="border border-border/60 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-neutral/10 border-b border-border/60 flex items-center justify-between">
          <span className="text-xs font-bold text-foreground">
            Overdue Approval Requests (&gt;48 Hours)
          </span>
          <span className="text-[11px] text-foreground/50">
            Requires immediate action
          </span>
        </div>

        <div className="divide-y divide-border/40 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-xs text-foreground/50">Loading SLA data...</div>
          ) : (agingData?.overdue_tickets?.length ?? 0) > 0 ? (
            agingData?.overdue_tickets.map((t) => (
              <div key={t.ticket_id} className="p-3 hover:bg-hover/40 flex items-center justify-between gap-3 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <AppAvatar
                    name={t.requestor_name}
                    src={t.requestor_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${t.requestor_name}`}
                    size={28}
                    className="shrink-0"
                  />
                  <div className="min-w-0">
                    <Link href={`/tickets/${t.ticket_id}`} className="font-semibold text-xs text-foreground hover:text-accent-1 transition-colors block truncate">
                      #{String(t.ticket_id).padStart(4, '0')} — {t.subject}
                    </Link>
                    <span className="text-[11px] text-foreground/50 block">
                      Requested by {t.requestor_name} • {t.date_created}
                    </span>
                  </div>
                </div>

                <Link href={`/tickets/${t.ticket_id}`} className="shrink-0">
                  <AppButton variant="ghost" size="sm" className="!text-xs hover:text-accent-1" rightIcon={<ArrowRight size={12} />}>
                    Review
                  </AppButton>
                </Link>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-foreground/50">
              🎉 Excellent! No approval requests are over 48 hours overdue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
