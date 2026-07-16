'use client';

import React, { useState, useMemo } from 'react';
import { AppLabel, AppTable, AppButton, AppCard } from '@/components/ui';
import type { Ticket as TicketType } from '@/lib/types';
import { getUsers } from '@/lib/tickets';
import { STATUS_META } from '@/lib/types';

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
  const [activeTab, setActiveTab] = useState<'ao' | 'bu'>('ao');
  const [selectedBU, setSelectedBU] = useState<string | null>(null);
  const allUsers = getUsers();
  const salesUsers = allUsers.filter((u) => u.role === 'sales');

  const tableData = useMemo(() => {
    return salesUsers.map((user) => {
      const myTickets = allTickets.filter((t) => t.requesterId === user.id);
      
      const focusTickets = myTickets.filter((t) => t.brandType === 'Focus');
      const focusPending = focusTickets.filter((t) => t.status === 'unassigned' || t.status === 'assigned').length;
      const focusAnswered = focusTickets.filter((t) => t.status === 'answered').length;
      const focusClosed = focusTickets.filter((t) => t.status === 'closed').length;

      const nonFocusTickets = myTickets.filter((t) => t.brandType !== 'Focus');
      const nonFocusPending = nonFocusTickets.filter((t) => t.status === 'unassigned' || t.status === 'assigned').length;
      const nonFocusAnswered = nonFocusTickets.filter((t) => t.status === 'answered').length;
      const nonFocusClosed = nonFocusTickets.filter((t) => t.status === 'closed').length;

      const buCode = myTickets.length > 0 
        ? (myTickets[0].businessUnitName.includes('Cebu') ? 'CEB' : myTickets[0].businessUnitName.includes('Davao') ? 'DVO' : 'MNL') 
        : 'ESD';

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
  }, [allTickets, salesUsers]);

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

  // Group by Business Unit for the pie chart slice calculations
  const buSlices = useMemo(() => {
    const buCounts = allTickets.reduce<Record<string, number>>((acc, t) => {
      const bu = t.businessUnitName || 'General';
      acc[bu] = (acc[bu] || 0) + 1;
      return acc;
    }, {});

    const entries = Object.entries(buCounts).sort((a, b) => b[1] - a[1]);
    const total = allTickets.length || 1;

    let cumulativePercent = 0;

    return entries.map(([name, count], index) => {
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
  }, [allTickets]);

  const handleSelectBU = (buName: string) => {
    setSelectedBU((prev) => (prev === buName ? null : buName));
  };

  return (
    <div className="space-y-4">
      {/* Dynamic Tab Navigation Header */}
      <div className="flex border-b border-border/40 select-none">
        <button
          onClick={() => setActiveTab('ao')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 hover:text-accent-1 cursor-pointer ${
            activeTab === 'ao'
              ? 'border-accent-1 text-accent-1'
              : 'border-transparent text-text-info'
          }`}
        >
          Ticket Count per AO & Category
        </button>
        <button
          onClick={() => setActiveTab('bu')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 hover:text-accent-1 cursor-pointer ${
            activeTab === 'bu'
              ? 'border-accent-1 text-accent-1'
              : 'border-transparent text-text-info'
          }`}
        >
          Tickets per BU
        </button>
      </div>

      {activeTab === 'ao' ? (
        <div className="space-y-3 animate-in fade-in duration-200">
          <AppTable
            columns={columns}
            dataSource={tableData}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </div>
      ) : (
        <AppCard variant="default" padding="md" className="py-6 text-center space-y-5 animate-in fade-in duration-200">
          <AppLabel as="h4" className="text-sm font-bold text-text mb-2">Tickets per BU</AppLabel>
          
          {/* Custom SVG Pie Chart Legend */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs max-w-xl mx-auto px-4 select-none">
            {buSlices.map((slice) => {
              const isSelected = selectedBU === slice.name;
              return (
                <div
                  key={slice.name}
                  onClick={() => handleSelectBU(slice.name)}
                  className={`flex items-center gap-1.5 font-sans font-semibold text-text-info cursor-pointer transition-all duration-200 ${
                    selectedBU && !isSelected ? 'opacity-30 scale-95' : 'opacity-100 hover:text-text'
                  }`}
                >
                  <span className="w-3 h-2 rounded-xs shrink-0" style={{ backgroundColor: slice.color }} />
                  <span className="truncate max-w-[120px]">{slice.name}</span>
                </div>
              );
            })}
          </div>

          {/* SVG Pie Chart Widget with Numeric Labels & Highlights */}
          <div className="relative w-64 h-64 mx-auto">
            <svg className="w-64 h-64 -rotate-90" viewBox="0 0 100 100">
              {buSlices.map((slice) => {
                const isSelected = selectedBU === slice.name;
                return (
                  <g key={slice.name}>
                    <path
                      d={slice.pathData}
                      fill={slice.color}
                      onClick={() => handleSelectBU(slice.name)}
                      className={`transition-all duration-300 cursor-pointer ${
                        selectedBU && !isSelected ? 'opacity-20 scale-95' : 'opacity-100 hover:opacity-85'
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
                        className={`pointer-events-none select-none font-sans transition-all duration-300 ${
                          selectedBU && !isSelected ? 'opacity-20' : 'opacity-100'
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
        </AppCard>
      )}
    </div>
  );
}
