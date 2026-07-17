'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppChip, cn } from '@integrated-computer-system/ui-kit';
import { Ticket, STATUS_META } from '@/lib/types';
import { Clock, ArrowRight } from 'lucide-react';

function timeAgo(dateStr: string): string {
  const now = new Date().getTime();
  const date = new Date(dateStr).getTime();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface RecentTicketsProps {
  tickets: Ticket[];
}

export default function RecentTickets({ tickets }: RecentTicketsProps) {
  const router = useRouter();

  return (
    <div className="rounded-2xl bg-card-bg border border-border/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text">Recent Inquiries</h3>
        <button
          onClick={() => router.push('/tickets')}
          className="text-xs font-medium text-accent-1 hover:text-accent-1/80 transition-colors flex items-center gap-1"
        >
          View all <ArrowRight size={12} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {tickets.length === 0 && (
          <p className="text-sm text-text-info py-8 text-center">No inquiries yet</p>
        )}
        {tickets.map((ticket) => {
          const statusMeta = STATUS_META[ticket.status] || { label: ticket.status, color: '#6b7280', chipVariant: 'default' };
          return (
            <button
              key={ticket.id}
              onClick={() => router.push(`/tickets/${ticket.id}`)}
              className={cn(
                'flex items-center gap-4 p-3 rounded-xl',
                'transition-all duration-200 hover:bg-hover/50',
                'text-left w-full group'
              )}
            >
              {/* Ticket number */}
              <div className="w-10 h-10 rounded-lg bg-neutral flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-text-info">
                  #{String(ticket.ticketNumber).padStart(4, '0')}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate group-hover:text-accent-1 transition-colors">
                  {ticket.subject}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-text-info">{ticket.requesterName}</span>
                  <span className="text-text-info/30">•</span>
                  <span className="text-[11px] text-text-info flex items-center gap-1">
                    <Clock size={10} />
                    {timeAgo(ticket.updatedAt)}
                  </span>
                </div>
              </div>

              {/* Status chip */}
              <AppChip
                label={statusMeta.label}
                variant={statusMeta.chipVariant as any}
                size="sm"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
