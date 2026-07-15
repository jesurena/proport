import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Award, Box } from 'lucide-react';
import { AppLabel, AppModal, AppButton } from '@integrated-computer-system/ui-kit';
import { AppToggle, AppTable, AppChip, AppAvatar } from '@/components/ui';
import { STATUS_META } from '@/lib/types';
import type { Ticket as TicketType, TicketStatus } from '@/lib/types';

interface DashboardTicketPerBuyerProps {
  allTickets: TicketType[];
}

export default function DashboardTicketPerBuyer({ allTickets }: DashboardTicketPerBuyerProps) {
  const router = useRouter();
  const [buyerPeriod, setBuyerPeriod] = useState<'today' | 'week'>('today');
  const [showAllBuyers, setShowAllBuyers] = useState(false);
  const [selectedBuyerForModal, setSelectedBuyerForModal] = useState<string | null>(null);

  const buyersList = [
    'Maria Santos',
    'Rico Mendoza',
    'John Dela Cruz',
    'Angela Reyes',
    'Carlos Garcia',
    'Patricia Lim',
    'Jose Ramos',
    'Unassigned'
  ];

  const filteredPeriodTickets = allTickets.filter((t) => {
    if (buyerPeriod === 'today') {
      const todayStr = new Date().toISOString().split('T')[0];
      return t.createdAt.startsWith(todayStr);
    } else {
      const oneWeekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
      return new Date(t.createdAt) >= oneWeekAgo;
    }
  });

  const buyerCounts = buyersList.map((name) => {
    let count = 0;
    if (name === 'Unassigned') {
      count = filteredPeriodTickets.filter(t => !t.assigneeId).length;
    } else {
      count = filteredPeriodTickets.filter(t => t.assigneeName === name).length;
    }
    return { name, count };
  }).sort((a, b) => b.count - a.count);

  const displayedBuyers = showAllBuyers ? buyerCounts : buyerCounts.slice(0, 5);

  const modalTickets = selectedBuyerForModal
    ? filteredPeriodTickets.filter((t) => {
        if (selectedBuyerForModal === 'Unassigned') {
          return !t.assigneeId;
        }
        return t.assigneeName === selectedBuyerForModal;
      })
    : [];

  const modalColumns = [
    {
      title: 'Inquiry #',
      dataIndex: 'ticketNumber',
      key: 'ticketNumber',
      align: 'left' as const,
      width: '120px',
      render: (num: number, record: TicketType) => (
        <span
          onClick={() => {
            setSelectedBuyerForModal(null);
            router.push(`/tickets/${record.id}`);
          }}
          className="text-accent-1 font-mono font-bold hover:underline cursor-pointer"
        >
          #{String(num).padStart(4, '0')}
        </span>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      align: 'left' as const,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      width: '120px',
      render: (status: string) => {
        const meta = STATUS_META[status as TicketStatus];
        return <AppChip variant={(meta?.chipVariant as any) ?? 'default'} label={meta?.label ?? status} />;
      },
    },
    {
      title: 'Assignee',
      dataIndex: 'assigneeName',
      key: 'assignee',
      align: 'left' as const,
      render: (_: any, record: TicketType) => (
        <AppAvatar
          name={record.assigneeName ?? 'Unassigned'}
          src={record.assigneeAvatar}
          size={32}
        />
      ),
    },
    {
      title: 'Brand',
      dataIndex: 'brandType',
      key: 'brand',
      align: 'left' as const,
      render: (type: string) => {
        if (!type) return <span className="text-text-info text-xs">—</span>;
        return (
          <AppChip
            label={type}
            color={type === 'Focus' ? '#7c3aed' : '#2563eb'}
            icon={type === 'Focus' ? <Award /> : <Box />}
            size="sm"
          />
        );
      },
    },
    {
      title: 'Request Type',
      dataIndex: 'requestType',
      key: 'requestType',
      align: 'left' as const,
      render: (type: string) => {
        const variantMap: Record<string, any> = {
          'cost inquiry': 'warning',
          'demo unit': 'info',
          'service schedule': 'success',
          'eta inquiry': 'accent',
        };
        return <AppChip variant={variantMap[type] ?? 'default'} label={type} />;
      },
    },
  ];

  const modalSlots = {
    ticketNumber: (num: number, record: TicketType) => (
      <span
        onClick={() => {
          setSelectedBuyerForModal(null);
          router.push(`/tickets/${record.id}`);
        }}
        className="text-accent-1 font-mono font-bold hover:underline cursor-pointer"
      >
        #{String(num).padStart(4, '0')}
      </span>
    ),
    status: (status: string) => {
      let statusBg = 'bg-neutral border border-border/40 text-text';
      if (status === 'pending') statusBg = 'bg-blue-500/10 text-blue-600';
      else if (status === 'answered') statusBg = 'bg-emerald-500/10 text-emerald-600';
      else if (status === 'closed') statusBg = 'bg-slate-500/10 text-slate-600';
      else if (status === 'unassigned') statusBg = 'bg-purple-500/10 text-purple-600';
      else if (status === 'assigned') statusBg = 'bg-pink-500/10 text-pink-600';
      else if (status === 'escalated') statusBg = 'bg-red-500/10 text-red-600';

      return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${statusBg}`}>
          {status}
        </span>
      );
    },
  };

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
          {displayedBuyers.map((buyer, index) => (
            <div key={buyer.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${index === 0 ? 'bg-linear-to-br from-indigo-400 to-purple-500' : index === 1 ? 'bg-linear-to-br from-sky-400 to-blue-500' : 'bg-linear-to-br from-emerald-400 to-teal-500'}`}>
                  {buyer.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <AppLabel as="p" className="text-xs font-bold text-text leading-none mb-0.5">{buyer.name}</AppLabel>
                  <AppLabel as="p" variant="description" className="text-[10px]">
                    {buyer.count} inquir{buyer.count === 1 ? 'y' : 'ies'} {buyerPeriod === 'today' ? 'today' : 'this week'}
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

      {/* Buyer Tickets List Modal */}
      <AppModal
        open={!!selectedBuyerForModal}
        onClose={() => setSelectedBuyerForModal(null)}
        width="650px"
        centered
      >
        <AppModal.Body className="space-y-4">
          <div>
            <AppModal.Title>
              Inquiries for {selectedBuyerForModal}
            </AppModal.Title>
            <AppModal.Description>
              Showing inquiries assigned to {selectedBuyerForModal} for {buyerPeriod === 'today' ? 'today' : 'this week'}.
            </AppModal.Description>
          </div>

          <AppTable
            columns={modalColumns}
            dataSource={modalTickets}
            rowKey="id"
          />

          <div className="flex justify-end pt-2 border-t border-border/40">
            <AppButton variant="neutral" onClick={() => setSelectedBuyerForModal(null)}>
              Close
            </AppButton>
          </div>
        </AppModal.Body>
      </AppModal>
    </>
  );
}
