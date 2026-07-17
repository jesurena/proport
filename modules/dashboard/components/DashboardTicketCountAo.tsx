'use client';

import React, { useState, useMemo } from 'react';
import { AppLabel, AppTable, AppButton, AppCard, AppAvatar } from '@/components/ui';
import type { Ticket as TicketType } from '@/lib/types';
import { getUsers } from '@/lib/tickets';
import { STATUS_META } from '@/lib/types';
import { useTicketCountAo, useChartPerBu, useBuyerCategoryCounts, useBuyerDateCounts } from '../hooks/useDashboard';

interface DashboardTicketCountAoProps {
  allTickets: TicketType[];
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green/teal
  '#eedcd2', // peach
  '#c05c46', // sienna/brown
  '#5d4b8a', // purple
  '#ff7a5a', // coral
  '#8c1d35', // dark red
  '#f3e1d3', // light peach
  '#34495e', // slate
  '#f1c40f', // yellow
  '#e67e22', // orange
  '#2ecc71', // bright green
  '#9b59b6', // violet
  '#1abc9c', // turquoise
];

export default function DashboardTicketCountAo({ allTickets }: DashboardTicketCountAoProps) {
  const [activeTab, setActiveTab] = useState<'ao' | 'bu' | 'buyer-date' | 'buyer-category'>('ao');
  const [selectedBU, setSelectedBU] = useState<string | null>(null);

  const [aoParams, setAoParams] = useState({ page: 1, per_page: 10, sort_field: 'AccountName', sort_order: 'asc' as 'asc' | 'desc' });
  const [buyerCategoryParams, setBuyerCategoryParams] = useState({ page: 1, per_page: 10, sort_field: 'AccountName', sort_order: 'asc' as 'asc' | 'desc' });
  const [buyerDateParams, setBuyerDateParams] = useState({ page: 1, per_page: 10, sort_field: 'date_created', sort_order: 'desc' as 'asc' | 'desc' });

  const { data: ticketCountAoData, isLoading } = useTicketCountAo(aoParams, activeTab === 'ao');
  const { data: chartPerBuData } = useChartPerBu(activeTab === 'bu');
  const { data: buyerCategoryCountsData, isLoading: isBuyerCategoryLoading } = useBuyerCategoryCounts(buyerCategoryParams, activeTab === 'buyer-category');
  const { data: buyerDateCountsData, isLoading: isBuyerDateLoading } = useBuyerDateCounts(buyerDateParams, activeTab === 'buyer-date');

  const tableData = useMemo(() => {
    const list = ticketCountAoData?.data || [];
    return list.map((item: any, index: number) => ({
      id: String(index),
      ao: item.AccountName,
      bu: item.AccountGroup,
      avatar: item.GAvatar,
      focusPending: Number(item.focus_pending_count || 0),
      focusAnswered: Number(item.focus_answered_count || 0),
      focusClosed: Number(item.focus_closed_count || 0),
      nonFocusPending: Number(item.nf_pending_count || 0),
      nonFocusAnswered: Number(item.nf_answered_count || 0),
      nonFocusClosed: Number(item.nf_closed_count || 0),
    }));
  }, [ticketCountAoData]);

  const columns = [
    {
      title: 'AO',
      dataIndex: 'ao',
      key: 'ao',
      sorter: true,
      render: (text: string, record: any) => (
        <div className="flex items-center gap-2">
          <AppAvatar src={record.avatar} name={text} size={24} />
          <AppLabel variant="body">{text}</AppLabel>
        </div>
      ),
    },
    {
      title: 'BU',
      dataIndex: 'bu',
      key: 'bu',
      sorter: true,
      render: (text: string) => <AppLabel variant="info">{text}</AppLabel>,
    },
    {
      title: 'Focus - Pending',
      dataIndex: 'focusPending',
      key: 'focusPending',
      align: 'center' as const,
      sorter: true,
      render: (val: number) => <AppLabel variant="body">{val}</AppLabel>,
    },
    {
      title: 'Focus - Answered',
      dataIndex: 'focusAnswered',
      key: 'focusAnswered',
      align: 'center' as const,
      sorter: true,
      render: (val: number) => <AppLabel variant="body">{val}</AppLabel>,
    },
    {
      title: 'Focus - Closed',
      dataIndex: 'focusClosed',
      key: 'focusClosed',
      align: 'center' as const,
      sorter: true,
      render: (val: number) => <AppLabel variant="body">{val}</AppLabel>,
    },
    {
      title: 'Non Focus - Pending',
      dataIndex: 'nonFocusPending',
      key: 'nonFocusPending',
      align: 'center' as const,
      sorter: true,
      render: (val: number) => <AppLabel variant="body">{val}</AppLabel>,
    },
    {
      title: 'Non Focus - Answered',
      dataIndex: 'nonFocusAnswered',
      key: 'nonFocusAnswered',
      align: 'center' as const,
      sorter: true,
      render: (val: number) => <AppLabel variant="body">{val}</AppLabel>,
    },
    {
      title: 'Non Focus - Closed',
      dataIndex: 'nonFocusClosed',
      key: 'nonFocusClosed',
      align: 'center' as const,
      sorter: true,
      render: (val: number) => <AppLabel variant="body">{val}</AppLabel>,
    },
  ];

  const buyerCategoryColumns = [
    {
      title: 'Buyer',
      dataIndex: 'buyer',
      key: 'buyer',
      sorter: true,
      render: (text: string, record: any) => (
        <div className="flex items-center gap-2">
          <AppAvatar src={record.avatar} name={text} size={24} />
          <AppLabel variant="body">{text}</AppLabel>
        </div>
      ),
    },
    {
      title: 'Focus - Pending',
      dataIndex: 'focusPending',
      key: 'focusPending',
      align: 'center' as const,
      sorter: true,
      render: (val: number) => <AppLabel variant="body">{val}</AppLabel>,
    },
    {
      title: 'Focus - Answered',
      dataIndex: 'focusAnswered',
      key: 'focusAnswered',
      align: 'center' as const,
      sorter: true,
      render: (val: number) => <AppLabel variant="body">{val}</AppLabel>,
    },
    {
      title: 'Focus - Closed',
      dataIndex: 'focusClosed',
      key: 'focusClosed',
      align: 'center' as const,
      sorter: true,
      render: (val: number) => <AppLabel variant="body">{val}</AppLabel>,
    },
    {
      title: 'Non Focus - Pending',
      dataIndex: 'nonFocusPending',
      key: 'nonFocusPending',
      align: 'center' as const,
      sorter: true,
      render: (val: number) => <AppLabel variant="body">{val}</AppLabel>,
    },
    {
      title: 'Non Focus - Answered',
      dataIndex: 'nonFocusAnswered',
      key: 'nonFocusAnswered',
      align: 'center' as const,
      sorter: true,
      render: (val: number) => <AppLabel variant="body">{val}</AppLabel>,
    },
    {
      title: 'Non Focus - Closed',
      dataIndex: 'nonFocusClosed',
      key: 'nonFocusClosed',
      align: 'center' as const,
      sorter: true,
      render: (val: number) => <AppLabel variant="body">{val}</AppLabel>,
    },
  ];

  const buyerCategoryTableData = useMemo(() => {
    const list = buyerCategoryCountsData?.data || [];
    return list.map((item: any, index: number) => ({
      id: String(index),
      buyer: item.AccountName,
      avatar: item.GAvatar,
      focusPending: Number(item.focus_pending_count || 0),
      focusAnswered: Number(item.focus_answered_count || 0),
      focusClosed: Number(item.focus_closed_count || 0),
      nonFocusPending: Number(item.nf_pending_count || 0),
      nonFocusAnswered: Number(item.nf_answered_count || 0),
      nonFocusClosed: Number(item.nf_closed_count || 0),
    }));
  }, [buyerCategoryCountsData]);

  const buyerDateColumns = useMemo(() => {
    const list = buyerDateCountsData?.data || [];
    if (list.length === 0) return [];
    const firstRowKeys = Object.keys(list[0]).filter(k => k !== 'GAvatar');
    return firstRowKeys.map((key) => {
      const isName = key.toLowerCase() === 'accountname' || key.toLowerCase() === 'name' || key.toLowerCase() === 'buyer';
      return {
        title: key,
        dataIndex: key,
        key: key,
        align: isName ? ('left' as const) : ('center' as const),
        sorter: true,
        render: (val: any, record: any) => {
          if (isName) {
            return (
              <div className="flex items-center gap-2">
                <AppAvatar src={record.GAvatar} name={val} size={24} />
                <AppLabel variant="body">{val}</AppLabel>
              </div>
            );
          }
          return <AppLabel className="text-text-info text-xs">{val ?? 0}</AppLabel>;
        }
      };
    });
  }, [buyerDateCountsData]);

  const buyerDateTableData = useMemo(() => {
    const list = buyerDateCountsData?.data || [];
    return list.map((item: any, index: number) => ({
      id: String(index),
      ...item,
    }));
  }, [buyerDateCountsData]);

  // Group by Business Unit for the pie chart slice calculations
  const buSlices = useMemo(() => {
    if (!chartPerBuData) return [];

    const sorted = [...chartPerBuData].sort((a: any, b: any) => Number(b.cnt || 0) - Number(a.cnt || 0));
    const total = sorted.reduce((sum: number, item: any) => sum + Number(item.cnt || 0), 0) || 1;

    let cumulativePercent = 0;

    return sorted.map((item: any, index: number) => {
      const name = item.AccountGroup || 'General';
      const count = Number(item.cnt || 0);
      const percent = count / total;
      const sliceStart = cumulativePercent;
      const startX = Math.cos(2 * Math.PI * cumulativePercent) * 46 + 50;
      const startY = Math.sin(2 * Math.PI * cumulativePercent) * 46 + 50;
      cumulativePercent += percent;
      const endX = Math.cos(2 * Math.PI * cumulativePercent) * 46 + 50;
      const endY = Math.sin(2 * Math.PI * cumulativePercent) * 46 + 50;
      const largeArcFlag = percent > 0.5 ? 1 : 0;

      const pathData = percent === 1
        ? `M 50 4 A 46 46 0 1 1 49.999 4 Z`
        : `M 50 50 L ${startX} ${startY} A 46 46 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

      const color = COLORS[index % COLORS.length];

      // Label coordinate (midpoint of slice, scaled inside r=28 to fit well)
      const middlePercent = sliceStart + (percent / 2);
      const labelX = Math.cos(2 * Math.PI * middlePercent) * 28 + 50;
      const labelY = Math.sin(2 * Math.PI * middlePercent) * 28 + 50;

      return {
        name,
        count,
        percent,
        pathData,
        color,
        labelX,
        labelY,
      };
    });
  }, [chartPerBuData]);

  const handleSelectBU = (buName: string) => {
    setSelectedBU((prev) => (prev === buName ? null : buName));
  };

  return (
    <div className="space-y-4">
      {/* Dynamic Tab Navigation Header */}
      <div className="flex border-b border-border/40 select-none">
        <button
          onClick={() => setActiveTab('ao')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 hover:text-accent-1 cursor-pointer ${activeTab === 'ao'
              ? 'border-accent-1 text-accent-1'
              : 'border-transparent text-text-info'
            }`}
        >
          Ticket Count per AO & Category
        </button>
        <button
          onClick={() => setActiveTab('bu')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 hover:text-accent-1 cursor-pointer ${activeTab === 'bu'
              ? 'border-accent-1 text-accent-1'
              : 'border-transparent text-text-info'
            }`}
        >
          Tickets per BU
        </button>
        <button
          onClick={() => setActiveTab('buyer-date')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 hover:text-accent-1 cursor-pointer ${activeTab === 'buyer-date'
              ? 'border-accent-1 text-accent-1'
              : 'border-transparent text-text-info'
            }`}
        >
          Ticket Count per Buyer & Date
        </button>
        <button
          onClick={() => setActiveTab('buyer-category')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 hover:text-accent-1 cursor-pointer ${activeTab === 'buyer-category'
              ? 'border-accent-1 text-accent-1'
              : 'border-transparent text-text-info'
            }`}
        >
          Ticket Count per Buyer & Category
        </button>
      </div>

      {activeTab === 'ao' && (
        <div className="space-y-3 animate-in fade-in duration-200 w-full">
          <AppTable
            columns={columns}
            dataSource={tableData}
            rowKey="id"
            pagination={{
              current: aoParams.page,
              pageSize: aoParams.per_page,
              total: ticketCountAoData?.total || 0,
            }}
            onChange={(pagination, filters, sorter: any) => {
              let sortField = 'AccountName';
              if (sorter.field) {
                if (sorter.field === 'ao') sortField = 'AccountName';
                else if (sorter.field === 'bu') sortField = 'AccountGroup';
                else if (sorter.field === 'focusPending') sortField = 'focus_pending_count';
                else if (sorter.field === 'focusAnswered') sortField = 'focus_answered_count';
                else if (sorter.field === 'focusClosed') sortField = 'focus_closed_count';
                else if (sorter.field === 'nonFocusPending') sortField = 'nf_pending_count';
                else if (sorter.field === 'nonFocusAnswered') sortField = 'nf_answered_count';
                else if (sorter.field === 'nonFocusClosed') sortField = 'nf_closed_count';
              }
              const sortOrder = sorter.order === 'descend' ? 'desc' : 'asc';
              setAoParams({
                page: pagination.current || 1,
                per_page: pagination.pageSize || 10,
                sort_field: sortField,
                sort_order: sortOrder,
              });
            }}
            loading={isLoading}
            scroll={{ x: 'max-content' }}
          />
        </div>
      )}

      {activeTab === 'buyer-category' && (
        <div className="space-y-3 animate-in fade-in duration-200 w-full">
          <AppTable
            columns={buyerCategoryColumns}
            dataSource={buyerCategoryTableData}
            rowKey="id"
            pagination={{
              current: buyerCategoryParams.page,
              pageSize: buyerCategoryParams.per_page,
              total: buyerCategoryCountsData?.total || 0,
            }}
            onChange={(pagination, filters, sorter: any) => {
              let sortField = 'AccountName';
              if (sorter.field) {
                if (sorter.field === 'buyer') sortField = 'AccountName';
                else if (sorter.field === 'focusPending') sortField = 'focus_pending_count';
                else if (sorter.field === 'focusAnswered') sortField = 'focus_answered_count';
                else if (sorter.field === 'focusClosed') sortField = 'focus_closed_count';
                else if (sorter.field === 'nonFocusPending') sortField = 'nf_pending_count';
                else if (sorter.field === 'nonFocusAnswered') sortField = 'nf_answered_count';
                else if (sorter.field === 'nonFocusClosed') sortField = 'nf_closed_count';
              }
              const sortOrder = sorter.order === 'descend' ? 'desc' : 'asc';
              setBuyerCategoryParams({
                page: pagination.current || 1,
                per_page: pagination.pageSize || 10,
                sort_field: sortField,
                sort_order: sortOrder,
              });
            }}
            loading={isBuyerCategoryLoading}
            scroll={{ x: 'max-content' }}
          />
        </div>
      )}

      {activeTab === 'buyer-date' && (
        <div className="space-y-3 animate-in fade-in duration-200 w-full">
          <AppTable
            columns={buyerDateColumns}
            dataSource={buyerDateTableData}
            rowKey="id"
            pagination={{
              current: buyerDateParams.page,
              pageSize: buyerDateParams.per_page,
              total: buyerDateCountsData?.total || 0,
            }}
            onChange={(pagination, filters, sorter: any) => {
              const sortField = sorter.field || 'date_created';
              const sortOrder = sorter.order === 'descend' ? 'desc' : 'asc';
              setBuyerDateParams(prev => ({
                ...prev,
                page: pagination.current || 1,
                per_page: pagination.pageSize || 10,
                sort_field: sortField,
                sort_order: sortOrder,
              }));
            }}
            loading={isBuyerDateLoading}
            scroll={{ x: 'max-content' }}
          />
        </div>
      )}

      {activeTab === 'bu' && (
        <AppCard variant="default" padding="lg" className="py-6 space-y-5 animate-in fade-in duration-200">
          <AppLabel as="h4" className="text-sm font-bold text-text mb-2 text-center">Tickets per BU</AppLabel>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 px-4">
            {/* SVG Pie Chart Widget */}
            <div className="relative w-80 h-80 shrink-0">
              <svg className="w-80 h-80 -rotate-90" viewBox="0 0 100 100">
                {buSlices.map((slice) => {
                  const isSelected = selectedBU === slice.name;
                  return (
                    <g key={slice.name}>
                      <path
                        d={slice.pathData}
                        fill={slice.color}
                        onClick={() => handleSelectBU(slice.name)}
                        className={`transition-all duration-300 cursor-pointer ${selectedBU && !isSelected ? 'opacity-20 scale-95' : 'opacity-100 hover:opacity-85'
                          }`}
                        style={{ transformOrigin: '50px 50px' }}
                      />
                      {slice.percent > 0.01 && (
                        <text
                          x={slice.labelX}
                          y={slice.labelY}
                          fill={slice.color === '#eedcd2' || slice.color === '#f3e1d3' ? '#4a3f35' : '#ffffff'}
                          fontSize="4.5"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="central"
                          transform={`rotate(90, ${slice.labelX}, ${slice.labelY})`}
                          className={`pointer-events-none select-none font-sans transition-all duration-300 ${selectedBU && !isSelected ? 'opacity-20' : 'opacity-100'
                            }`}
                        >
                          {slice.count}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* List Breakdown Table/Legend */}
            <div className="flex-1 w-full space-y-2 max-w-sm">
              <div className="flex items-center justify-between text-[11px] font-bold text-text-info uppercase tracking-wider border-b border-border/40 pb-1.5 px-2">
                <span>Business Unit</span>
                <span>Breakdown</span>
              </div>
              <div className="space-y-0.5 max-h-64 overflow-y-auto pr-1">
                {buSlices.map((slice) => {
                  const isSelected = selectedBU === slice.name;
                  return (
                    <div
                      key={slice.name}
                      onClick={() => handleSelectBU(slice.name)}
                      className={`flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer transition-all duration-200 border ${isSelected
                          ? 'bg-accent-1/10 border-accent-1/25 shadow-xs'
                          : 'bg-transparent border-transparent hover:bg-hover hover:border-border/30'
                        } ${selectedBU && !isSelected ? 'opacity-40' : 'opacity-100'}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-xs shrink-0" style={{ backgroundColor: slice.color }} />
                        <span className="font-bold text-xs text-text">{slice.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-text-info">{slice.count} {slice.count === 1 ? 'ticket' : 'tickets'}</span>
                        <span className="text-[11px] font-semibold text-text-muted w-12 text-right">({(slice.percent * 100).toFixed(1)}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </AppCard>
      )}
    </div>
  );
}
