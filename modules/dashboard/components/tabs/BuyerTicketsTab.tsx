import React, { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { AppEmptyState, AppLabel } from '@/components/ui';
import { TicketTable } from '@/modules/tickets/components/TicketTable';
import { useBuyerPeriodTickets } from '@/modules/dashboard/hooks/useDashboard';

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
        <div className="py-20 flex flex-col items-center justify-center text-text-info space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-accent-1 opacity-80" />
          <AppLabel as="p" className="text-xs font-semibold tracking-wide">
            Fetching assigned tickets...
          </AppLabel>
        </div>
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
