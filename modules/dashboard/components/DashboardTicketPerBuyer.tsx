'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import { AppLabel } from '@integrated-computer-system/ui-kit';
import { AppToggle, AppChip, AppAvatar } from '@/components/ui';
import type { Ticket as TicketType } from '@/lib/types';
import { useBuyerPeriodCounts, useBuyerPeriodTickets } from '../hooks/useDashboard';
import BuyerTicketsModal from './BuyerTicketsModal';

export default function DashboardTicketPerBuyer() {
  const router = useRouter();
  const [buyerPeriod, setBuyerPeriod] = useState<'today' | 'week'>('today');
  const [showAllBuyers, setShowAllBuyers] = useState(false);
  const [selectedBuyerForModal, setSelectedBuyerForModal] = useState<string | null>(null);

  const { data: periodCounts, isLoading } = useBuyerPeriodCounts();
  const { data: modalTickets } = useBuyerPeriodTickets(selectedBuyerForModal, buyerPeriod);

  const buyerCounts = useMemo(() => {
    if (!periodCounts) return [];
    const list = buyerPeriod === 'today' ? periodCounts.today : periodCounts.week;
    return [...list].sort((a, b) => b.count - a.count);
  }, [periodCounts, buyerPeriod]);

  const displayedBuyers = showAllBuyers ? buyerCounts : buyerCounts.slice(0, 5);

  return (
    <>
      <div className="bg-card-bg border border-border/60 rounded-3xl p-5 shadow-sm space-y-1">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <AppLabel as="h4" variant="title" className="!text-sm !font-bold mr-2">Ticket per Buyer</AppLabel>
          </div>
          <AppLabel as="p" variant="description" className="text-[10px]">Inquiry distribution per buyer assignee for the selected range.</AppLabel>
        </div>

        <div className="flex justify-end pb-4">
          <AppToggle
            size="small"
            options={[
              { label: 'Today', value: 'today' },
              { label: 'This Week', value: 'week' },
            ]}
            value={buyerPeriod}
            onChange={setBuyerPeriod}
          />
        </div>
        <div className="space-y-3">
          {displayedBuyers.map((buyer) => (
            <div key={buyer.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <AppAvatar src={buyer.avatar} name={buyer.name} size={36} />
                <div>
                  <AppLabel as="p" className="text-xs font-bold text-text leading-none mb-0.5">{buyer.name}</AppLabel>
                  <AppLabel as="p" variant="description" className="text-[10px]">
                    {buyer.count} ticket{buyer.count === 1 ? '' : 's'} {buyerPeriod === 'today' ? 'today' : 'this week'}
                  </AppLabel>
                </div>
              </div>
              <button
                onClick={() => setSelectedBuyerForModal(buyer.name)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-accent-1/30 text-accent-1 text-[10px] font-bold hover:bg-accent-1 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <Users size={10} />
                View
              </button>
            </div>
          ))}
        </div>

        {buyerCounts.length > 5 && (
          <button
            onClick={() => setShowAllBuyers(!showAllBuyers)}
            className="w-full mt-2 py-2 rounded-2xl border border-border/60 text-xs font-semibold text-text hover:bg-hover transition-colors cursor-pointer"
          >
            {showAllBuyers ? 'Show Less' : 'See All Buyers'}
          </button>
        )}
      </div>

      {/* Embedded TicketTable Modal */}
      <BuyerTicketsModal
        open={!!selectedBuyerForModal}
        onClose={() => setSelectedBuyerForModal(null)}
        buyer={selectedBuyerForModal || ''}
        buyerPeriod={buyerPeriod}
        tickets={modalTickets || []}
      />
    </>
  );
}
