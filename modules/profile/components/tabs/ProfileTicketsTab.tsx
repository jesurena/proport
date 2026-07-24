'use client';

import React, { useState, useEffect } from 'react';
import { TicketTable } from '@/modules/tickets/components/ticket-table/TicketTable';
import { TicketTableSkeleton } from '@/components/skeleton';
import { AppEmptyState } from '@/components/ui';
import { useUserPeriodTickets } from '@/modules/profile';

interface ProfileTicketsTabProps {
  userId: string | number;
  period: 'today' | 'week' | 'all';
}

export function ProfileTicketsTab({ userId, period }: ProfileTicketsTabProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [period, userId]);

  const { data, isLoading } = useUserPeriodTickets(
    String(userId),
    period,
    page,
    pageSize
  );

  const tickets = data?.data || [];
  const total = data?.total || 0;

  if (isLoading) {
    return <TicketTableSkeleton rows={pageSize} />;
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
      page={page}
      pageSize={pageSize}
      total={total}
      onPageChange={(p, ps) => {
        setPage(p);
        if (ps) setPageSize(ps);
      }}
    />
  );
}
