'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, ArrowRight } from 'lucide-react';
import { AppLabel, AppCard, AppButton, AppChip } from '@/components/ui';
import AppEmptyState from '@/components/ui/empty-state/AppEmptyState';
import type { Ticket as TicketType } from '@/lib/types';

interface DashboardBookmarkedTicketsProps {
  allTickets: TicketType[];
}

export default function DashboardBookmarkedTickets({ allTickets }: DashboardBookmarkedTicketsProps) {
  const router = useRouter();
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const loadBookmarks = () => {
    const stored = localStorage.getItem('proport_pinned_tickets');
    if (stored) {
      setBookmarkedIds(JSON.parse(stored));
    } else {
      setBookmarkedIds([]);
    }
  };

  useEffect(() => {
    loadBookmarks();
    // Listen to standard storage events as well as custom event updates
    window.addEventListener('storage', loadBookmarks);
    window.addEventListener('proport-pins-updated', loadBookmarks);
    return () => {
      window.removeEventListener('storage', loadBookmarks);
      window.removeEventListener('proport-pins-updated', loadBookmarks);
    };
  }, []);

  const handleRemoveBookmark = (ticketId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = bookmarkedIds.filter((id) => id !== ticketId);
    setBookmarkedIds(updated);
    localStorage.setItem('proport_pinned_tickets', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('proport-pins-updated'));
  };

  const bookmarkedTickets = allTickets.filter((t) => bookmarkedIds.includes(t.id));

  return (
    <AppCard variant="default" padding="md" className="space-y-3">
      <div>
        <AppLabel as="h4" variant="title" className="!text-sm !font-bold">Bookmarked Tickets</AppLabel>
        <AppLabel as="p" variant="description" className="text-[10px] mt-0.5">Quick access to bookmarked tickets</AppLabel>
      </div>

      {bookmarkedTickets.length === 0 ? (
        <AppEmptyState
          title="No bookmarked tickets"
          description="Bookmark tickets to keep them here."
          imageSrc="/aria-mascott-sad.svg"
          imageSize={50}
          className="py-4 border-none bg-transparent"
        />
      ) : (
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {bookmarkedTickets.map((ticket) => {
            let chipVariant: any = 'muted';
            if (ticket.status === 'answered') chipVariant = 'success';
            else if (ticket.status === 'closed') chipVariant = 'archive';
            else if (ticket.status === 'pending') chipVariant = 'info';
            else if (ticket.status === 'assigned') chipVariant = 'assigned';
            else if (ticket.status === 'unassigned') chipVariant = 'unassigned';

            return (
              <div
                key={ticket.id}
                onClick={() => router.push(`/tickets/${ticket.id}`)}
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/50 bg-hover/20 hover:bg-hover/50 transition-colors cursor-pointer group"
              >

                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="font-mono text-[9px] font-bold text-text-info">
                      #{String(ticket.ticketNumber).padStart(4, '0')}
                    </span>
                    <AppChip label={ticket.status} variant={chipVariant} size="sm" className="!font-bold font-mono !pl-2 !pr-2 !py-0.5" />
                  </div>
                  <AppLabel as="span" className="block text-xs font-bold text-text truncate">
                    {ticket.subject}
                  </AppLabel>
                </div>
                <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <AppButton
                    variant="neutral"
                    size="icon"
                    onClick={() => router.push(`/tickets/${ticket.id}`)}
                    title="View details"
                    className="!w-6 !h-6 rounded-full"
                  >
                    <ArrowRight size={11} />
                  </AppButton>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppCard>
  );
}
