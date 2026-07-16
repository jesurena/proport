'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppModal, AppInput, AppCard } from '@integrated-computer-system/ui-kit';
import { Ticket as TicketIcon, ArrowRight, Loader2 } from 'lucide-react';
import { getTickets } from '@/lib/tickets';
import type { Ticket } from '@/lib/types';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
    }
  }, [open]);

  useEffect(() => {
    if (searchQuery) {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 200);
      return () => clearTimeout(t);
    } else {
      setLoading(false);
    }
  }, [searchQuery]);

  const filteredTickets = useMemo(() => {
    const allTickets = getTickets();
    if (!searchQuery) {
      // Show first 5 tickets as quick suggestions when search is empty
      return allTickets.slice(0, 5);
    }
    const q = searchQuery.toLowerCase();
    return allTickets.filter(
      (t) =>
        t.subject.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        t.requesterName.toLowerCase().includes(q) ||
        (t.supplierName && t.supplierName.toLowerCase().includes(q)) ||
        String(t.ticketNumber).includes(q)
    );
  }, [searchQuery]);

  const handleSelectTicket = (id: string) => {
    router.push(`/tickets/${id}`);
    onClose();
  };

  return (
    <AppModal open={open} onClose={onClose} width={600} centered>
      <AppModal.Header>
        <AppModal.Title>Search Tickets</AppModal.Title>
      </AppModal.Header>

      <AppModal.Body className="space-y-4">
        <AppInput
          preset="search"
          placeholder="Search tickets, suppliers, descriptions, numbers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
          autoFocus
        />

        <div className="max-h-[380px] overflow-y-auto custom-scrollbar space-y-4 pr-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-text-info/50">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <span className="text-xs">Searching...</span>
            </div>
          ) : (
            <>
              {/* Tickets List */}
              {filteredTickets.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-text-info uppercase tracking-wider block px-1">
                    {searchQuery ? `Tickets (${filteredTickets.length})` : 'Recent Tickets'}
                  </span>
                  <div className="flex flex-col gap-1">
                    {filteredTickets.map((t) => (
                      <AppCard
                        key={t.id}
                        variant="interactive"
                        padding="none"
                        onClick={() => handleSelectTicket(t.id)}
                        className="flex items-center justify-between p-3 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-8 h-8 rounded-lg bg-neutral flex items-center justify-center text-text-info shrink-0">
                            <TicketIcon size={16} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-text-info shrink-0">
                                #{String(t.ticketNumber).padStart(4, '0')}
                              </span>
                              <span className="text-sm font-semibold text-text truncate group-hover:text-accent-1 transition-colors">
                                {t.subject}
                              </span>
                            </div>
                            <span className="text-xs text-text-info truncate">
                              Ticket by {t.requesterName} • {t.businessUnitName} {t.supplierName ? `• ${t.supplierName}` : ''}
                            </span>
                          </div>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-accent-1 text-white flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight size={12} />
                        </div>
                      </AppCard>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {searchQuery && filteredTickets.length === 0 && (
                <div className="py-12 text-center text-text-info/60 space-y-1">
                  <p className="text-sm font-medium">No results found for "{searchQuery}"</p>
                  <p className="text-xs">Try searching for ticket titles, suppliers, numbers, or requester names.</p>
                </div>
              )}
            </>
          )}
        </div>
      </AppModal.Body>
    </AppModal>
  );
}
