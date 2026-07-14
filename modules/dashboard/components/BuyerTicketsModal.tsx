import React from 'react';
import { useRouter } from 'next/navigation';
import { AppModal, AppButton } from '@integrated-computer-system/ui-kit';
import { AppTable } from '@/components/ui';
import type { Ticket as TicketType } from '@/lib/types';

interface BuyerTicketsModalProps {
  open: boolean;
  onClose: () => void;
  buyer: string | null;
  tickets: TicketType[];
  columns: any[];
  buyerPeriod: 'today' | 'week';
}

export default function BuyerTicketsModal({
  open,
  onClose,
  buyer,
  tickets,
  columns,
  buyerPeriod,
}: BuyerTicketsModalProps) {
  const router = useRouter();

  return (
    <AppModal open={open} onClose={onClose} width="650px" centered>
      <AppModal.Body className="space-y-4">
        <div>
          <AppModal.Title>Inquiries for {buyer}</AppModal.Title>
          <AppModal.Description>
            Showing inquiries assigned to {buyer} for {buyerPeriod === 'today' ? 'today' : 'this week'}.
          </AppModal.Description>
        </div>
        <AppTable columns={columns} dataSource={tickets} rowKey="id" />
        <div className="flex justify-end pt-2 border-t border-border/40">
          <AppButton variant="neutral" onClick={onClose}>Close</AppButton>
        </div>
      </AppModal.Body>
    </AppModal>
  );
}
