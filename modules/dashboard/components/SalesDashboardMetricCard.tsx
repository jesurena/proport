import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Inbox, Clock, Zap, ShieldAlert, BookOpen, CheckCircle } from 'lucide-react';
import { AppLabel, AppButton, AppCard } from '@/components/ui';
import type { Ticket as TicketType } from '@/lib/types';

interface SalesDashboardMetricCardProps {
  allTickets: TicketType[];
}

export default function SalesDashboardMetricCard({ allTickets }: SalesDashboardMetricCardProps) {
  const router = useRouter();
  const [showAllCards, setShowAllCards] = useState(false);

  // Active Sales User: 'user-7' (Jose Ramos)
  const salesUserId = 'user-7';
  const myTickets = allTickets.filter((t) => t.requesterId === salesUserId);

  // 1. New Tickets Today (created in the last 24 hours)
  const newTicketsTodayCount = allTickets.filter((t) => {
    const createdDate = new Date(t.createdAt);
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return createdDate >= oneDayAgo;
  }).length;

  // 2. My Pending Tickets (unassigned or assigned)
  const pendingCount = myTickets.filter((t) => t.status === 'unassigned' || t.status === 'assigned').length;

  // 3. My Focus Tickets
  const focusCount = myTickets.filter((t) => t.brandType === 'Focus').length;

  // 4. My Non Focus Tickets
  const nonFocusCount = myTickets.filter((t) => t.brandType !== 'Focus').length;

  // 5. My Open Tickets (status !== 'closed')
  const openCount = myTickets.filter((t) => t.status !== 'closed').length;

  // 6. My Closed Tickets (status === 'closed')
  const closedCount = myTickets.filter((t) => t.status === 'closed').length;

  const initialCards = [
    { label: 'New Tickets Today', count: newTicketsTodayCount, status: 'new', icon: <Inbox size={18} />, iconBg: 'bg-indigo-500/10', iconColor: 'text-indigo-600' },
    { label: 'My Pending Tickets', count: pendingCount, status: 'pending', icon: <Clock size={18} />, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-600' },
    { label: 'My Focus Tickets', count: focusCount, status: 'focus', icon: <Zap size={18} />, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-600' },
  ];

  const extraCards = [
    { label: 'My Non Focus Tickets', count: nonFocusCount, status: 'non-focus', icon: <ShieldAlert size={18} />, iconBg: 'bg-pink-500/10', iconColor: 'text-pink-600' },
    { label: 'My Open Tickets', count: openCount, status: 'open', icon: <BookOpen size={18} />, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-600' },
    { label: 'My Closed Tickets', count: closedCount, status: 'closed', icon: <CheckCircle size={18} />, iconBg: 'bg-slate-500/10', iconColor: 'text-slate-600' },
  ];

  const cardsToRender = showAllCards ? [...initialCards, ...extraCards] : initialCards;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <AppLabel as="h3" variant="subtitle">Status Overview</AppLabel>
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
            onClick={() => router.push(`/tickets?status=${status === 'new' ? 'all' : status}`)}
            className="p-4 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center ${iconColor} shrink-0`}>
                {icon}
              </div>
              <div>
                <AppLabel as="p" variant="info" className="text-[11px] font-semibold uppercase tracking-wider leading-none mb-1">
                  {count} inquiries
                </AppLabel>
                <AppLabel as="p" variant="subtitle" className="font-bold text-sm">
                  {label}
                </AppLabel>
              </div>
            </div>
            <AppButton
              variant="neutral"
              size="icon"
              className="!w-8 !h-8 rounded-full"
            >
              <ArrowRight size={13} />
            </AppButton>
          </AppCard>
        ))}
      </div>
    </div>
  );
}
