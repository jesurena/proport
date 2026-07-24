'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, ArrowRight } from 'lucide-react';
import { AppLabel, AppCard, AppButton, AppChip } from '@/components/ui';
import AppEmptyState from '@/components/ui/empty-state/AppEmptyState';
import { useBookmarkedTickets } from '../hooks/useDashboard';
import { useAuthStore } from '@/modules/auth';
import { DashboardBookmarkedTicketsSkeleton } from '@/components/skeleton/dashboard';

export default function DashboardBookmarkedTickets() {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: bookmarkedTickets = [], isLoading } = useBookmarkedTickets(!!user);

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
              <AppCard
                key={ticket.id}
                variant="default"
                padding="none"
                onClick={() => router.push(`/tickets/${ticket.id}`)}
                className="p-3 flex items-center justify-between cursor-pointer group transition-all duration-200 hover:border-accent-1/40 hover:shadow-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Bookmark size={14} className="fill-amber-500/20" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
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
                    <AppLabel as="p" variant="subtitle" className="font-bold text-xs group-hover:text-accent-1 transition-colors duration-200 truncate">
                      {ticket.subject}
                    </AppLabel>
                  </div>
                </div>
                <AppButton
                  variant="neutral"
                  size="icon"
                  className="!w-7 !h-7 rounded-full group-hover:!bg-accent-1 group-hover:!text-white group-hover:!border-accent-1 transition-colors duration-200 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/tickets/${ticket.id}`);
                  }}
                  title="View details"
                >
                  <ArrowRight size={12} />
                </AppButton>
              </AppCard>
            );
          })}
        </div>
      )}
    </AppCard>
  );
}
