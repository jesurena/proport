'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AppLabel, AppButton, AppCard, AppBookmark, AppChip } from '@/components/ui';
import { modal } from '@/components/Providers/theme-provider';
import { STATUS_META } from '@/lib/types';
import type { Ticket as TicketType } from '@/lib/types';
import { useRecentTickets } from '../hooks/useDashboard';
import AppEmptyState from '@/components/ui/empty-state/AppEmptyState';
import { useAuthStore } from '@/modules/auth';
import { SalesRecentTicketsSkeleton } from '@/components/skeleton/dashboard';

export default function SalesRecentTickets() {
  const router = useRouter();
  const [role, setRole] = useState<string>('super_user');
  const [page, setPage] = useState(0);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  const { user } = useAuthStore();
  const isDeveloper = user?.is_developer ?? false;
  const actualRole = user?.role_name ?? 'buyer';

  // Sync role and pins on mount
  useEffect(() => {
    const storedRole = localStorage.getItem('proport_my_role');
    if (isDeveloper && storedRole) {
      setRole(storedRole);
    } else {
      setRole(actualRole);
    }

    const storedPins = localStorage.getItem('proport_pinned_tickets');
    if (storedPins) setPinnedIds(JSON.parse(storedPins));

    const handlePinSync = () => {
      const pins = localStorage.getItem('proport_pinned_tickets');
      if (pins) setPinnedIds(JSON.parse(pins));
    };
    window.addEventListener('proport-pins-updated', handlePinSync);
    window.addEventListener('storage', handlePinSync);
    return () => {
      window.removeEventListener('proport-pins-updated', handlePinSync);
      window.removeEventListener('storage', handlePinSync);
    };
  }, []);

  const { data: recentTickets = [], isLoading } = useRecentTickets();

  const handleToggleBookmark = (ticketId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isPinned = pinnedIds.includes(ticketId);

    modal.confirm({
      title: isPinned ? 'Remove Bookmark?' : 'Bookmark Ticket?',
      content: isPinned
        ? 'Are you sure you want to remove this ticket from your bookmarks?'
        : 'Are you sure you want to bookmark this ticket for quick access?',
      okText: 'Yes',
      cancelText: 'No',
      centered: true,
      onOk() {
        let updated;
        if (isPinned) {
          updated = pinnedIds.filter((id) => id !== ticketId);
        } else {
          updated = [...pinnedIds, ticketId];
        }
        setPinnedIds(updated);
        localStorage.setItem('proport_pinned_tickets', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('proport-pins-updated'));
        window.dispatchEvent(new Event('storage'));
      },
    });
  };

  const visibleTickets = recentTickets.slice(0, 6).slice(page * 3, (page * 3) + 3);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <AppLabel as="h3" variant="subtitle">Your Recent Tickets</AppLabel>
        <div className="flex items-center gap-2">
          <AppButton
            variant="neutral"
            size="icon"
            onClick={() => setPage(0)}
            disabled={page === 0 || isLoading}
            className="!w-7 !h-7 rounded-full"
          >
            <ChevronLeft size={14} />
          </AppButton>
          <AppButton
            variant={page === 1 ? 'neutral' : 'accent'}
            size="icon"
            onClick={() => setPage(1)}
            disabled={page === 1 || recentTickets.slice(0, 6).length <= 3 || isLoading}
            className="!w-7 !h-7 rounded-full"
          >
            <ChevronRight size={14} />
          </AppButton>
        </div>
      </div>

      {isLoading ? (
        <SalesRecentTicketsSkeleton count={3} />
      ) : visibleTickets.length === 0 ? (
        <AppCard variant="default">
          <AppEmptyState
            title="No recent tickets"
            description="Create your first ticket to start comparing options."
            imageSrc="/aria-mascott-sad.svg"
            imageSize={70}
          />
        </AppCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {visibleTickets.map((ticket) => {
            const statusMeta = STATUS_META[ticket.status] || { label: ticket.status, chipVariant: 'muted' };

            return (
              <AppCard
                key={ticket.id}
                variant="default"
                padding="none"
                onClick={() => router.push(`/tickets/${ticket.id}`)}
                className="overflow-hidden shadow-sm cursor-pointer flex flex-col group relative border hover:border-accent-1/40 hover:shadow-md transition-all duration-200"
              >
                <div className="w-full h-36 bg-gradient-to-br from-indigo-600 to-violet-600 relative flex items-center justify-center">
                  <AppLabel
                    as="span"
                    variant="caption"
                    className="font-mono font-bold tracking-widest text-white/30"
                  >
                    #{String(ticket.ticketNumber).padStart(4, '0')}
                  </AppLabel>
                </div>
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <div className="flex items-start gap-2 text-left">
                    <AppBookmark
                      active={pinnedIds.includes(ticket.id)}
                      onClick={(e) => handleToggleBookmark(ticket.id, e)}
                      size={15}
                      title={pinnedIds.includes(ticket.id) ? 'Remove Bookmark' : 'Bookmark Ticket'}
                      className="mt-0.5"
                    />
                    <AppLabel
                      as="h4"
                      variant="title"
                      className="!text-sm !font-bold line-clamp-2 leading-snug flex-1 group-hover:text-accent-1 transition-colors duration-200"
                    >
                      {ticket.subject}
                    </AppLabel>
                  </div>
                  <div className="flex items-center gap-1.5 mt-auto pt-2 flex-wrap">
                    <AppChip
                      label={statusMeta.label}
                      variant={statusMeta.chipVariant as any}
                      size="sm"
                      className="!font-bold font-mono !px-2 !py-0.5"
                    />
                  </div>
                </div>
              </AppCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
