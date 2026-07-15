import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Inbox, CircleDot, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { AppLabel, AppButton, AppCard } from '@/components/ui';

interface DashboardMetricCardProps {
  totalCount: number;
  getCount: (status: string) => number;
}

export default function DashboardMetricCard({ totalCount, getCount }: DashboardMetricCardProps) {
  const router = useRouter();
  const [showAllCards, setShowAllCards] = useState(false);

  const initialCards = [
    { label: 'Unassigned', status: 'unassigned', icon: <Inbox size={18} />, iconBg: 'bg-purple-500/10', iconColor: 'text-purple-600' },
    { label: 'Assigned', status: 'assigned', icon: <CircleDot size={18} />, iconBg: 'bg-pink-500/10', iconColor: 'text-pink-600' },
    { label: 'Pending', status: 'pending', icon: <Clock size={18} />, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-600' },
  ];

  const extraCards = [
    { label: 'Answered', status: 'answered', icon: <CheckCircle2 size={18} />, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-600' },
    { label: 'Closed', status: 'closed', icon: <XCircle size={18} />, iconBg: 'bg-slate-500/10', iconColor: 'text-slate-600' },
    { label: 'Escalated', status: 'escalated', icon: <AlertTriangle size={18} />, iconBg: 'bg-red-500/10', iconColor: 'text-red-600' },
  ];

  const cardsToRender = showAllCards ? [...initialCards, ...extraCards] : initialCards;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <AppLabel as="h3" variant="subtitle">          Status Overview</AppLabel>
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
        {cardsToRender.map(({ label, status, icon, iconBg, iconColor }) => (
          <AppCard
            key={status}
            variant="default"
            padding="none"
            onClick={() => router.push(`/tickets?status=${status}`)}
            className="p-4 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center ${iconColor} shrink-0`}>
                {icon}
              </div>
              <div>
                <AppLabel as="p" variant="info" className="text-[11px] font-semibold uppercase tracking-wider leading-none mb-1">
                  {getCount(status)}/{totalCount} inquiries
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
