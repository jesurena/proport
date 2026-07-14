import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { AppTable, AppAvatar, AppChip } from '@/components/ui';
import type { Ticket as TicketType } from '@/lib/types';

interface DashboardTableProps {
  recentTickets: TicketType[];
}

export default function DashboardTable({ recentTickets }: DashboardTableProps) {
  const router = useRouter();

  const columns = [
    {
      title: 'Buyer',
      dataIndex: 'assigneeName',
      key: 'assigneeName',
      align: 'left' as const,
      width: '30%',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2.5">
          <AppAvatar
            src={record.assigneeName}
            name={record.assigneeName ?? 'Unassigned'}
          />
          <div>
            <p className="text-xs font-bold text-text leading-none mb-0.5">
              {record.assigneeName || 'Unassigned'}
            </p>
            <p className="text-[10px] text-text-info">
              {new Date(record.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Supplier',
      dataIndex: 'supplierName',
      key: 'supplierName',
      align: 'left' as const,
      width: '20%',
      render: (supplierName: string) => {
        const variantMap: Record<string, string> = {
          'Ingram Micro': 'info',
          Synnex: 'success',
          'Tech Data': 'warning',
        };
        const variant = variantMap[supplierName] ?? 'default';
        return <AppChip label={supplierName || 'General'} />;
      },
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      align: 'left' as const,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right' as const,
      width: 80,
      render: () => (
        <div className="flex justify-end pr-1">
          <button className="w-8 h-8 rounded-full border border-border/60 hover:bg-accent-1 hover:text-white flex items-center justify-center text-text-info transition-colors cursor-pointer shrink-0">
            <ArrowRight size={13} />
          </button>
        </div>
      ),
    },
  ];

  const slots = {
    buyer: (_: any, record: any) => (
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-neutral flex items-center justify-center font-bold text-xs text-text-info shrink-0">
          {record.assigneeName ? record.assigneeName.substring(0, 2).toUpperCase() : 'UN'}
        </div>
        <div>
          <p className="text-xs font-bold text-text leading-none mb-0.5">{record.assigneeName || 'Unassigned'}</p>
          <p className="text-[10px] text-text-info">
            {new Date(record.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
    ),
    supplier: (supplierName: string) => {
      let categoryBg = 'bg-neutral border border-border/40 text-text';
      if (supplierName === 'Ingram Micro') categoryBg = 'bg-sky-500/10 text-sky-600';
      else if (supplierName === 'Synnex') categoryBg = 'bg-cyan-500/10 text-cyan-600';
      else if (supplierName === 'Tech Data') categoryBg = 'bg-indigo-500/10 text-indigo-600';

      return (
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider w-fit block ${categoryBg}`}>
          {supplierName || 'General'}
        </span>
      );
    },
    action: () => (
      <div className="flex justify-end pr-1">
        <button className="w-8 h-8 rounded-full border border-border/60 hover:bg-accent-1 hover:text-white flex items-center justify-center text-text-info transition-colors cursor-pointer shrink-0">
          <ArrowRight size={13} />
        </button>
      </div>
    ),
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-base font-bold text-text">Your Inquiries</h3>
        <span onClick={() => router.push('/tickets')} className="text-xs font-semibold text-accent-1 hover:underline cursor-pointer">See all</span>
      </div>

      <AppTable
        columns={columns}
        dataSource={recentTickets.slice(0, 5)}
        rowKey="id"
        pagination={false}
        onRow={(record) => ({
          onClick: () => router.push(`/tickets/${record.id}`),
          className: 'cursor-pointer',
        })}
      />
    </div>
  );
}
