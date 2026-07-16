'use client';

import React from 'react';
import { AppModal, AppButton } from '@integrated-computer-system/ui-kit';
import { TicketTable } from '@/modules/tickets/components/TicketTable';
import type { Ticket as TicketType } from '@/lib/types';

interface BuyerTicketsTableModalProps {
  open: boolean;
  onClose: () => void;
  buyer: string;
  buyerPeriod: 'today' | 'week';
  tickets: TicketType[];
}

export default function BuyerTicketsTableModal({
  open,
  onClose,
  buyer,
  buyerPeriod,
  tickets,
}: BuyerTicketsTableModalProps) {
  return (
    <AppModal open={open} onClose={onClose} width="900px" centered>
      <AppModal.Body className="space-y-4">
        <div>
          <AppModal.Title>Tickets for {buyer}</AppModal.Title>
          <AppModal.Description>
            Showing tickets assigned to {buyer} for {buyerPeriod === 'today' ? 'today' : 'this week'}.
          </AppModal.Description>
        </div>
        <div>
          <TicketTable tickets={tickets} hideHeader={true} hideFilters={true} />
        </div>
        <div className="flex justify-end pt-2 border-t border-border/40">
          <AppButton variant="neutral" onClick={onClose}>
            Close
          </AppButton>
        </div>
      </AppModal.Body>
    </AppModal>
  );
}
