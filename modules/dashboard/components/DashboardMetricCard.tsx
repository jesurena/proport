import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Inbox, Clock, Zap, ShieldAlert, BookOpen, CheckCircle } from 'lucide-react';
import { AppLabel, AppButton, AppCard } from '@/components/ui';
import { useAuthStore } from '@/modules/auth';
import type { Ticket as TicketType } from '@/lib/types';

import { DashboardMetricCardSkeleton } from '@/components/skeleton/dashboard';

interface DashboardMetricCardProps {
  counts?: any;
  isLoading?: boolean;
}

export default function DashboardMetricCard({ counts, isLoading }: DashboardMetricCardProps) {
  const router = useRouter();
  const [showAllCards, setShowAllCards] = useState(false);
  const { is_adel, is_head } = useAuthStore();

  const cardsToRender = showAllCards
    ? [
        { label: (is_adel || is_head) ? 'My Groups Tickets Today' : 'New Tickets Today', count: counts?.ticket_today ?? 0, status: 'new', icon: <Inbox size={18} />, iconBg: 'bg-indigo-500/10', iconColor: 'text-indigo-600' },
        { label: (is_adel || is_head) ? 'My Groups Pending Tickets' : 'My Pending Tickets', count: counts?.ticket_pending ?? 0, status: 'pending', icon: <Clock size={18} />, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-600' },
        { label: (is_adel || is_head) ? 'My Groups Focus Tickets' : 'My Focus Tickets', count: counts?.focus_ticket ?? 0, status: 'focus', icon: <Zap size={18} />, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-600' },
        { label: (is_adel || is_head) ? 'My Groups Non Focus Tickets' : 'My Non Focus Tickets', count: counts?.nf_ticket ?? 0, status: 'non-focus', icon: <ShieldAlert size={18} />, iconBg: 'bg-pink-500/10', iconColor: 'text-pink-600' },
        { label: (is_adel || is_head) ? 'My Groups Open Tickets' : 'My Open Tickets', count: counts?.ticket_open ?? 0, status: 'open', icon: <BookOpen size={18} />, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-600' },
        { label: (is_adel || is_head) ? 'My Groups Closed Tickets' : 'My Closed Tickets', count: counts?.ticket_closed ?? 0, status: 'closed', icon: <CheckCircle size={18} />, iconBg: 'bg-slate-500/10', iconColor: 'text-slate-600' },
      ]
    : [
        { label: (is_adel || is_head) ? 'My Groups Tickets Today' : 'New Tickets Today', count: counts?.ticket_today ?? 0, status: 'new', icon: <Inbox size={18} />, iconBg: 'bg-indigo-500/10', iconColor: 'text-indigo-600' },
        { label: (is_adel || is_head) ? 'My Groups Pending Tickets' : 'My Pending Tickets', count: counts?.ticket_pending ?? 0, status: 'pending', icon: <Clock size={18} />, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-600' },
        { label: (is_adel || is_head) ? 'My Groups Focus Tickets' : 'My Focus Tickets', count: counts?.focus_ticket ?? 0, status: 'focus', icon: <Zap size={18} />, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-600' },
      ];

  return (
    isLoading || !counts ? (
      <DashboardMetricCardSkeleton cardsCount={showAllCards ? 6 : 3} />
    ) : (
      <div className="space-y-3">
      <div className="flex items-center justify-between">
        <AppLabel as="h3" variant="subtitle">
          {is_adel || is_head ? 'My Group Status Overview' : 'Status Overview'}
        </AppLabel>
        <AppButton
          variant="link"
          size="sm"
          onClick={() => setShowAllCards(!showAllCards)}
          className="!text-xs select-none"
        >
          {showAllCards ? 'Show Less' : 'View More'}
        </AppButton>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 transition-all duration-300">
        {cardsToRender.map(({ label, count, status, icon, iconBg, iconColor }) => (
          <AppCard
            key={status}
            variant="default"
            padding="none"
            onClick={() => {
              if (status === 'new') {
                router.push('/tickets');
              } else if (status === 'focus') {
                router.push('/tickets?tab=focus');
              } else if (status === 'non-focus') {
                router.push('/tickets?tab=non-focus');
              } else {
                router.push(`/tickets?status=${status}`);
              }
            }}
            className="p-4 flex items-center justify-between cursor-pointer group transition-all duration-200 hover:border-accent-1/40 hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center ${iconColor} shrink-0`}>
                {icon}
              </div>
              <div>
                <AppLabel as="p" variant="info" className="text-[11px] font-semibold uppercase tracking-wider leading-none mb-1">
                  {count} {count === 1 ? 'ticket' : 'tickets'}
                </AppLabel>
                <AppLabel as="p" variant="subtitle" className="font-bold text-sm group-hover:text-accent-1 transition-colors duration-200">
                  {label}
                </AppLabel>
              </div>
            </div>
            <AppButton
              variant="neutral"
              size="icon"
              className="!w-8 !h-8 rounded-full group-hover:!bg-accent-1 group-hover:!text-white group-hover:!border-accent-1 transition-colors duration-200"
            >
              <ArrowRight size={13} />
            </AppButton>
          </AppCard>
        ))}
      </div>
      </div>
    )
  );
}
