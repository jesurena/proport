import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Pin, ArrowRight } from 'lucide-react';
import { AppLabel, AppCard, AppButton, AppChip } from '@/components/ui';
import AppEmptyState from '@/components/ui/empty-state/AppEmptyState';
import type { Ticket as TicketType } from '@/lib/types';

interface DashboardPinnedTicketsProps {
  allTickets: TicketType[];
}

export default function DashboardPinnedTickets({ allTickets }: DashboardPinnedTicketsProps) {
  const router = useRouter();
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  const loadPins = () => {
    const stored = localStorage.getItem('proport_pinned_tickets');
    if (stored) {
      setPinnedIds(JSON.parse(stored));
    } else {
      setPinnedIds([]);
    }
  };

  useEffect(() => {
    loadPins();
    window.addEventListener('proport-pins-updated', loadPins);
    return () => {
      window.removeEventListener('proport-pins-updated', loadPins);
    };
  }, []);

  const handleUnpin = (ticketId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = pinnedIds.filter((id) => id !== ticketId);
    setPinnedIds(updated);
    localStorage.setItem('proport_pinned_tickets', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('proport-pins-updated'));
  };

  const pinnedTickets = allTickets.filter((t) => pinnedIds.includes(t.id));

  return (
    <AppCard variant="default" padding="md" className="space-y-3">
      <div>
        <AppLabel as="h4" variant="title" className="!text-sm !font-bold">Pinned Tickets</AppLabel>
        <AppLabel as="p" variant="description" className="text-[10px] mt-0.5">Quick access to marked tickets</AppLabel>
      </div>

      {pinnedTickets.length === 0 ? (
        <AppEmptyState
          title="No pinned tickets"
          description="Mark tickets to keep them here."
          imageSrc="/aria-mascott-sad.svg"
          imageSize={50}
          className="py-4 border-none bg-transparent"
        />
      ) : (
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {pinnedTickets.map((ticket) => {
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
                {/* Pin icon on the left (minimal plain icon, click to unpin) */}
                <Pin
                  size={12}
                  className="fill-current text-indigo-500 rotate-45 shrink-0 mr-2.5 cursor-pointer hover:text-danger transition-colors"
                  onClick={(e) => handleUnpin(ticket.id, e)}
                />

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
