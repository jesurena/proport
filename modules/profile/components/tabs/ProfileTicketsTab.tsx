'use client';

import React from 'react';
import { TicketTable } from '@/modules/tickets/components/ticket-table/TicketTable';
import { TicketTableSkeleton } from '@/components/skeleton';
import { AppEmptyState } from '@/components/ui';
import type { Ticket as TicketType } from '@/lib/types';

interface ProfileTicketsTabProps {
  tickets?: TicketType[];
  isLoading: boolean;
}

export function ProfileTicketsTab({ tickets, isLoading }: ProfileTicketsTabProps) {
  if (isLoading) {
    return <TicketTableSkeleton rows={10} />;
  }

  if (!tickets || tickets.length === 0) {
    return (
      <AppEmptyState
        title="No Tickets Found"
        description="No tickets found for this period."
        imageSrc="/aria-mascott-sad.svg"
        imageSize={120}
        bordered
      />
    );
  }

  return (
    <TicketTable
      tickets={tickets}
      hideHeader={true}
      hideFilters={true}
      refetch={false}
    />
  );
}
