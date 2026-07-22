'use client';

import React, { useState, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useBuyerPeriodCounts } from '../hooks/useDashboard';
import BuyerTicketsModal from './modals/BuyerTicketsModal';
import { Segmented } from 'antd';
import { AppLabel, AppAvatar, AppCard } from '@/components/ui';
import { useRouter } from 'next/router';

export default function DashboardTicketPerBuyer() {
  const [buyerPeriod, setBuyerPeriod] = useState<'today' | 'week'>('today');
  const [showAllBuyers, setShowAllBuyers] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<{ id: string | number; name: string } | null>(null);

  const { data: periodCounts, isLoading } = useBuyerPeriodCounts();

  const buyerCounts = useMemo(() => {
    if (!periodCounts) return [];
    const list = buyerPeriod === 'today' ? periodCounts.today : periodCounts.week;
    return [...list].sort((a, b) => b.count - a.count);
  }, [periodCounts, buyerPeriod]);

  const displayedBuyers = showAllBuyers ? buyerCounts : buyerCounts.slice(0, 8);

  return (
    <>
      <AppCard variant="default">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <AppLabel as="h4" variant="title" className="!text-sm !font-bold mr-2">
              Ticket per Buyer
            </AppLabel>
          </div>
          <AppLabel as="p" variant="description" className="text-[10px]">
            Inquiry distribution per buyer assignee for the selected range.
          </AppLabel>
        </div>

        <div className="flex justify-end mb-4">
          <Segmented
            options={[
              { label: 'Today', value: 'today' },
              { label: 'This Week', value: 'week' },
            ]}
            value={buyerPeriod}
            onChange={(val) => setBuyerPeriod(val as 'today' | 'week')}
          />
        </div>

        <div className="space-y-1">
          {displayedBuyers.map((buyer) => (
            <div
              key={buyer.name}
              onClick={() => setSelectedBuyer({ id: buyer.id, name: buyer.name })}
              className="group flex items-center justify-between cursor-pointer p-2.5 rounded-xl border border-transparent hover:bg-neutral/40 hover:border-border/30 transition-all select-none"
            >
              <div className="flex items-center gap-2.5">
                <AppAvatar src={buyer.avatar} name={buyer.name} size={32} />
                <div>
                  <AppLabel as="p" className="text-xs font-bold text-foreground leading-none mb-0.5">
                    {buyer.name}
                  </AppLabel>
                  <AppLabel as="p" variant="description" className="text-[10px]">
                    {buyer.count} ticket{buyer.count === 1 ? '' : 's'}{' '}
                    {buyerPeriod === 'today' ? 'today' : 'this week'}
                  </AppLabel>
                </div>
              </div>
              <ArrowRight size={14} className="text-text-info/30 group-hover:text-accent-1 transition-colors shrink-0" />
            </div>
          ))}
        </div>

        {buyerCounts.length > 8 && (
          <button
            onClick={() => setShowAllBuyers(!showAllBuyers)}
            className="w-full mt-2 py-2 rounded-2xl border border-border/60 text-xs font-semibold text-text hover:bg-hover transition-colors cursor-pointer"
          >
            {showAllBuyers ? 'Show Less' : 'See All Buyers'}
          </button>
        )}
      </AppCard>

      {/* Embedded TicketTable Modal */}
      {selectedBuyer && (
        <BuyerTicketsModal
          open={!!selectedBuyer}
          onClose={() => setSelectedBuyer(null)}
          buyerId={selectedBuyer.id}
          buyerName={selectedBuyer.name}
          buyerPeriod={buyerPeriod}
        />
      )}
    </>
  );
}
