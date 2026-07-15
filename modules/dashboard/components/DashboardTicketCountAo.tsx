import React from 'react';
import { AppLabel, AppTable } from '@/components/ui';
import type { Ticket as TicketType } from '@/lib/types';
import { getUsers } from '@/lib/tickets';

interface DashboardTicketCountAoProps {
  allTickets: TicketType[];
}

export default function DashboardTicketCountAo({ allTickets }: DashboardTicketCountAoProps) {
  const allUsers = getUsers();
  const salesUsers = allUsers.filter((u) => u.role === 'sales');

  const data = salesUsers.map((user) => {
    const myTickets = allTickets.filter((t) => t.requesterId === user.id);
    
    // Focus brand tickets
    const focusTickets = myTickets.filter((t) => t.brandType === 'Focus');
    const focusPending = focusTickets.filter((t) => t.status === 'unassigned' || t.status === 'assigned').length;
    const focusAnswered = focusTickets.filter((t) => t.status === 'answered').length;
    const focusClosed = focusTickets.filter((t) => t.status === 'closed').length;

    // Non-Focus brand tickets
    const nonFocusTickets = myTickets.filter((t) => t.brandType !== 'Focus');
    const nonFocusPending = nonFocusTickets.filter((t) => t.status === 'unassigned' || t.status === 'assigned').length;
    const nonFocusAnswered = nonFocusTickets.filter((t) => t.status === 'answered').length;
    const nonFocusClosed = nonFocusTickets.filter((t) => t.status === 'closed').length;

    // Determine BU: ESD, CEB, DVO, MNL
    const buCode = myTickets.length > 0 ? (myTickets[0].businessUnitName.includes('Cebu') ? 'CEB' : myTickets[0].businessUnitName.includes('Davao') ? 'DVO' : 'MNL') : 'ESD';

    return {
      id: user.id,
      ao: user.name,
      bu: buCode,
      focusPending,
      focusAnswered,
      focusClosed,
      nonFocusPending,
      nonFocusAnswered,
      nonFocusClosed,
    };
  });

  const columns = [
    {
      title: 'AO',
      dataIndex: 'ao',
      key: 'ao',
      sorter: (a: any, b: any) => a.ao.localeCompare(b.ao),
      render: (text: string) => <span className="font-bold text-text text-xs">{text}</span>,
    },
    {
      title: 'BU',
      dataIndex: 'bu',
      key: 'bu',
      sorter: (a: any, b: any) => a.bu.localeCompare(b.bu),
      render: (text: string) => <span className="text-text-info text-[11px] font-semibold">{text}</span>,
    },
    {
      title: 'Focus - Pending',
      dataIndex: 'focusPending',
      key: 'focusPending',
      align: 'center' as const,
      sorter: (a: any, b: any) => a.focusPending - b.focusPending,
      render: (val: number) => (
        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-md bg-red-500/10 text-red-600 font-bold text-xs">
          {val}
        </span>
      ),
    },
    {
      title: 'Focus - Answered',
      dataIndex: 'focusAnswered',
      key: 'focusAnswered',
      align: 'center' as const,
      sorter: (a: any, b: any) => a.focusAnswered - b.focusAnswered,
      render: (val: number) => (
        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-md bg-blue-500/10 text-blue-600 font-bold text-xs">
          {val}
        </span>
      ),
    },
    {
      title: 'Focus - Closed',
      dataIndex: 'focusClosed',
      key: 'focusClosed',
      align: 'center' as const,
      sorter: (a: any, b: any) => a.focusClosed - b.focusClosed,
      render: (val: number) => (
        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-md bg-emerald-500/10 text-emerald-600 font-bold text-xs">
          {val}
        </span>
      ),
    },
    {
      title: 'Non Focus - Pending',
      dataIndex: 'nonFocusPending',
      key: 'nonFocusPending',
      align: 'center' as const,
      sorter: (a: any, b: any) => a.nonFocusPending - b.nonFocusPending,
      render: (val: number) => (
        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-md bg-red-500/10 text-red-600 font-bold text-xs">
          {val}
        </span>
      ),
    },
    {
      title: 'Non Focus - Answered',
      dataIndex: 'nonFocusAnswered',
      key: 'nonFocusAnswered',
      align: 'center' as const,
      sorter: (a: any, b: any) => a.nonFocusAnswered - b.nonFocusAnswered,
      render: (val: number) => (
        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-md bg-blue-500/10 text-blue-600 font-bold text-xs">
          {val}
        </span>
      ),
    },
    {
      title: 'Non Focus - Closed',
      dataIndex: 'nonFocusClosed',
      key: 'nonFocusClosed',
      align: 'center' as const,
      sorter: (a: any, b: any) => a.nonFocusClosed - b.nonFocusClosed,
      render: (val: number) => (
        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-md bg-emerald-500/10 text-emerald-600 font-bold text-xs">
          {val}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <AppLabel as="h3" variant="subtitle">Ticket Count per AO & Category</AppLabel>
      <AppTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
