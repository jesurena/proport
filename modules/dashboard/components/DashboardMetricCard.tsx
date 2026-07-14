import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Inbox, CircleDot, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

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
        <span className="text-xs font-bold text-text-info uppercase tracking-wider">Status Overview</span>
        <button
          onClick={() => setShowAllCards(!showAllCards)}
          className="text-xs font-semibold text-accent-1 hover:underline cursor-pointer select-none"
        >
          {showAllCards ? 'Show Less' : 'View More'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 transition-all duration-300">
        {cardsToRender.map(({ label, status, icon, iconBg, iconColor }) => (
          <div
            key={status}
            onClick={() => router.push(`/tickets?status=${status}`)}
            className="bg-card-bg border border-border/60 rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:bg-hover/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center ${iconColor} shrink-0`}>
                {icon}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-text-info uppercase tracking-wider leading-none mb-1">
                  {getCount(status)}/{totalCount} inquiries
                </p>
                <p className="text-sm font-bold text-text">{label}</p>
              </div>
            </div>
            <MoreHorizontal className="text-text-info cursor-pointer shrink-0" size={16} />
          </div>
        ))}
      </div>
    </div>
  );
}
