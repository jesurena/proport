'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Pin } from 'lucide-react';
import { AppLabel, AppButton, AppCard } from '@/components/ui';
import type { Ticket as TicketType } from '@/lib/types';
import { getTickets } from '@/lib/tickets';
import AppEmptyState from '@/components/ui/empty-state/AppEmptyState';

export default function DashboardRecentTickets() {
  const router = useRouter();
  const [role, setRole] = useState<string>('super_user');
  const [page, setPage] = useState(0);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  // Sync role and pins on mount
  useEffect(() => {
    const storedRole = localStorage.getItem('proport_my_role');
    if (storedRole) setRole(storedRole);

    const storedPins = localStorage.getItem('proport_pinned_tickets');
    if (storedPins) setPinnedIds(JSON.parse(storedPins));

    const handlePinSync = () => {
      const pins = localStorage.getItem('proport_pinned_tickets');
      if (pins) setPinnedIds(JSON.parse(pins));
    };
    window.addEventListener('proport-pins-updated', handlePinSync);
    return () => {
      window.removeEventListener('proport-pins-updated', handlePinSync);
    };
  }, []);

  const allTickets = getTickets();
  const activeUserId = role === 'sales' ? 'user-7' : 'user-1';

  // Filter to show last 6 tickets of the active user
  const userTickets = allTickets.filter((t) => t.requesterId === activeUserId);
  const sortedTickets = [...userTickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const displayTickets = sortedTickets.slice(0, 6);

  const itemsPerPage = 3;
  const startIndex = page * itemsPerPage;
  const visibleTickets = displayTickets.slice(startIndex, startIndex + itemsPerPage);

  const handleTogglePin = (ticketId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (pinnedIds.includes(ticketId)) {
      updated = pinnedIds.filter((id) => id !== ticketId);
    } else {
      updated = [...pinnedIds, ticketId];
    }
    setPinnedIds(updated);
    localStorage.setItem('proport_pinned_tickets', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('proport-pins-updated'));
  };

  return (
    <AppCard variant="default" padding="md" className="space-y-3">
      <div className="flex items-center justify-between">
        <AppLabel as="h3" variant="subtitle">Your Recent Tickets</AppLabel>
        <div className="flex items-center gap-2">
          <AppButton
            variant="neutral"
            size="icon"
            onClick={() => setPage(0)}
            disabled={page === 0}
            className="!w-7 !h-7 rounded-full"
          >
            <ChevronLeft size={14} />
          </AppButton>
          <AppButton
            variant={page === 1 ? 'neutral' : 'accent'}
            size="icon"
            onClick={() => setPage(1)}
            disabled={page === 1 || displayTickets.length <= itemsPerPage}
            className="!w-7 !h-7 rounded-full"
          >
            <ChevronRight size={14} />
          </AppButton>
        </div>
      </div>

      {visibleTickets.length === 0 ? (
        <AppEmptyState
          title="No recent tickets"
          description="Create your first ticket to start comparing options."
          imageSrc="/aria-mascott-sad.svg"
          imageSize={70}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {visibleTickets.map((ticket) => {
            let badgeColor = 'bg-purple-500/10 text-purple-600';
            let gradient = 'from-purple-600 to-indigo-600';
            if (ticket.supplierName === 'Ingram Micro') {
              badgeColor = 'bg-sky-500/10 text-sky-600';
              gradient = 'from-sky-500 to-blue-600';
            } else if (ticket.supplierName === 'Synnex') {
              badgeColor = 'bg-cyan-500/10 text-cyan-600';
              gradient = 'from-cyan-600 to-blue-500';
            } else if (ticket.supplierName === 'Tech Data') {
              badgeColor = 'bg-indigo-500/10 text-indigo-600';
              gradient = 'from-indigo-500 to-violet-600';
            } else if (ticket.supplierName === 'Arrow Electronics') {
              badgeColor = 'bg-emerald-500/10 text-emerald-600';
              gradient = 'from-emerald-600 to-teal-700';
            }

            const isPinned = pinnedIds.includes(ticket.id);

            return (
              <AppCard
                key={ticket.id}
                variant="default"
                padding="none"
                onClick={() => router.push(`/tickets/${ticket.id}`)}
                className="overflow-hidden shadow-sm cursor-pointer flex flex-col group relative"
              >
                <div className={`w-full h-36 bg-linear-to-br ${gradient} relative flex items-center justify-center`}>
                  <AppLabel
                    as="span"
                    variant="caption"
                    className="font-mono font-bold tracking-widest text-white/30"
                  >
                    #{String(ticket.ticketNumber).padStart(4, '0')}
                  </AppLabel>
                  <AppButton
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleTogglePin(ticket.id, e)}
                    className={`absolute right-3 top-3 !w-7 !h-7 rounded-full !backdrop-blur-md transition-all !border-none ${isPinned
                        ? '!bg-indigo-600 !text-white opacity-100'
                        : '!bg-black/20 hover:!bg-black/40 !text-white opacity-0 group-hover:opacity-100'
                      }`}
                  >
                    <Pin size={12} className={isPinned ? 'fill-current text-amber-400 rotate-45' : ''} />
                  </AppButton>
                </div>
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <AppLabel
                    as="h4"
                    variant="title"
                    className="!text-sm !font-bold line-clamp-2 leading-snug"
                  >
                    {ticket.subject}
                  </AppLabel>
                  <div className="flex items-center gap-1.5 mt-auto pt-2">
                    <AppLabel
                      as="span"
                      variant="caption"
                      className={`font-bold uppercase tracking-wider px-2 py-1 rounded-full ${badgeColor}`}
                    >
                      {ticket.supplierName || 'General'}
                    </AppLabel>
                    {ticket.estimatedQuantity !== undefined && (
                      <AppLabel
                        as="span"
                        variant="caption"
                        className="font-semibold text-text-info bg-neutral px-2 py-1 rounded-full"
                      >
                        Qty: {ticket.estimatedQuantity}
                      </AppLabel>
                    )}
                  </div>
                </div>
              </AppCard>
            );
          })}
        </div>
      )}
    </AppCard>
  );
}
