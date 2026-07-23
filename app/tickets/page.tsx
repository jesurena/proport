'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { AppButton } from '@integrated-computer-system/ui-kit';
import { AppLabel } from '@/components/ui';
import { ProportNavbar } from '@/modules/sidebar';
import { TicketTable } from '@/modules/tickets/components/ticket-table/TicketTable';

export default function TicketsPage() {
  const router = useRouter();

  return (
    <>
      <ProportNavbar title="Inquiries" />

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <AppLabel as="h2" variant="title" className="!text-lg !font-bold">Tickets</AppLabel>
            <AppLabel as="p" variant="description" className="text-sm">
              Manage sales pricing questions and track quotes progress in a card-based workspace.
            </AppLabel>
          </div>
        </div>

        <TicketTable />
      </div>
    </>
  );
}
