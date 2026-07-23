import React, { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { AppEmptyState, AppLabel } from '@/components/ui';
import { TicketTable } from '@/modules/tickets/components/ticket-table/TicketTable';
import { useBuyerPeriodTickets } from '@/modules/dashboard/hooks/useDashboard';
import { TicketTableSkeleton } from '@/components/skeleton';

interface BuyerTicketsTabProps {
  buyerId: string | number;
  buyerPeriod: 'today' | 'week';
  open: boolean;
}

export default function BuyerTicketsTab({
  buyerId,
  buyerPeriod,
  open,
}: BuyerTicketsTabProps) {
  const { data: queryTickets, isLoading: isTicketsLoading } = useBuyerPeriodTickets(String(buyerId), buyerPeriod, open);

  const ticketsArray = useMemo(() => {
    const list = queryTickets || [];
    if (Array.isArray(list)) return list;
    if (list && typeof list === 'object' && Array.isArray((list as any).tickets)) {
      return (list as any).tickets;
    }
    return [];
  }, [queryTickets]);

  return (
    <div>
      {isTicketsLoading ? (
        <TicketTableSkeleton rows={10} />
      ) : ticketsArray.length > 0 ? (
        <TicketTable tickets={ticketsArray} hideHeader={true} hideFilters={true} refetch={false} />
      ) : (
        <AppEmptyState
          title="No Assigned Tickets"
          description={`No tickets assigned to this buyer for this period.`}
          imageSrc="/aria-mascott-sad.svg"
          imageSize={120}
          bordered
        />
      )}
    </div>
  );
}
