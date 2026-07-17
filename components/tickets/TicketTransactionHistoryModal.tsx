'use client';

import React from 'react';
import { AppModal, AppLabel } from '@/components/ui';
import { useTicketHistory } from '@/modules/tickets/hooks/useTickets';
import type { Ticket } from '@/lib/types';

interface TicketTransactionHistoryModalProps {
  open: boolean;
  onClose: () => void;
  ticket: Ticket;
}

interface DBHistoryItem {
  history_id: number;
  ticket_id: number;
  history: string;
  history_created: string;
}

function formatHistoryDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
}

export function TicketTransactionHistoryModal({
  open,
  onClose,
  ticket,
}: TicketTransactionHistoryModalProps) {
  // Only query the history if the modal is actually open
  const { data: historyRes, isLoading } = useTicketHistory(String(ticket.id), open);

  const historyItems: DBHistoryItem[] = historyRes?.data || [];

  return (
    <AppModal open={open} onClose={onClose} width={750} centered>
      <AppModal.Header>
        <AppModal.Title>
          View History: Ticket #{ticket.ticketNumber}
        </AppModal.Title>
      </AppModal.Header>

      <AppModal.Body className="space-y-4 max-h-[60vh] overflow-y-auto min-h-[200px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-accent-1 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-text-info font-medium mt-3">Loading transaction history...</span>
          </div>
        ) : historyItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="text-xs text-text-info font-medium">No history records found for this ticket.</span>
          </div>
        ) : (
          <div className="w-full">
            {/* Header row */}
            <div className="flex items-center justify-between pb-3 border-b border-border/80 text-xs font-bold text-text uppercase tracking-wide px-2">
              <span className="flex-1 text-left">Activity</span>
              <span className="w-48 text-right">Date Created</span>
            </div>

            {/* List items */}
            <div className="divide-y divide-border/30">
              {historyItems.map((item) => (
                <div
                  key={item.history_id}
                  className="flex items-center justify-between py-3.5 px-2 hover:bg-neutral/5 transition-colors"
                >
                  <AppLabel as="span" className="flex-1 text-sm text-text leading-relaxed pr-6">
                    {item.history}
                  </AppLabel>
                  <AppLabel as="span" className="w-48 text-right text-sm text-text-info whitespace-nowrap">
                    {formatHistoryDate(item.history_created)}
                  </AppLabel>
                </div>
              ))}
            </div>
          </div>
        )}
      </AppModal.Body>
    </AppModal>
  );
}
