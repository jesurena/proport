'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, ArrowRight } from 'lucide-react';
import { AppLabel, AppCard, AppButton, AppChip } from '@/components/ui';
import AppEmptyState from '@/components/ui/empty-state/AppEmptyState';
import { useBookmarkedTickets } from '../hooks/useDashboard';
import { DashboardBookmarkedTicketsSkeleton } from '@/components/skeleton/dashboard';

export default function DashboardBookmarkedTickets() {
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

  const { data: bookmarkedTickets = [], isLoading } = useBookmarkedTickets(
    bookmarkedIds.length > 0 ? bookmarkedIds.join(',') : ''
  );

  return (
    <AppCard variant="default" padding="md" className="space-y-3">
      <div>
        <AppLabel as="h4" variant="title" className="!text-sm !font-bold">Bookmarked Tickets</AppLabel>
        <AppLabel as="p" variant="description" className="text-[10px] mt-0.5">Quick access to bookmarked tickets</AppLabel>
      </div>

      {isLoading ? (
        <DashboardBookmarkedTicketsSkeleton />
      ) : bookmarkedTickets.length === 0 ? (
        <AppEmptyState
          title="No bookmarked tickets"
          description="Bookmark tickets to keep them here."
          imageSrc="/aria-mascott-sad.svg"
          imageSize={50}
          className="py-4 border-none bg-transparent"
        />
      ) : (
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {bookmarkedTickets.map((ticket) => {
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
                    <AppChip
                      label={ticket.status}
                      variant={
                        ticket.status === 'answered' ? 'success' :
                        ticket.status === 'closed' ? 'archive' :
                        ticket.status === 'pending' ? 'info' :
                        ticket.status === 'assigned' ? 'assigned' :
                        ticket.status === 'unassigned' ? 'unassigned' : 'muted'
                      }
                      size="sm"
                      className="!font-bold font-mono !pl-2 !pr-2 !py-0.5"
                    />
                  </div>
                  <AppLabel as="span" className="block text-xs font-bold text-text truncate">
                    {ticket.subject}
                  </AppLabel>
                </div>
                <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <AppButton
                    variant="primary"
                    size="icon"
                    onClick={() => router.push(`/tickets/${ticket.id}`)}
                    title="View details"
                    className="!w-6 !h-6 rounded-full !bg-accent-1 hover:!bg-accent-1/90 !text-white border-none flex items-center justify-center shrink-0"
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
