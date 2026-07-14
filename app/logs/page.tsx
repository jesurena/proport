'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  AppInput,
  AppAvatar,
} from '@integrated-computer-system/ui-kit';
import { Search, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProportNavbar } from '@/modules/sidebar';
import { getUserLogs, type UserLog } from '@/lib/logs';
import { AppTable } from '@/components/ui';

function formatLogDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  const pad = (n: number) => String(n).padStart(2, '0');
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const yy = String(d.getFullYear()).slice(-2);
  
  let hours = d.getHours();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const hh = pad(hours);
  const min = pad(d.getMinutes());

  return `${mm}/${dd}/${yy} ${hh}:${min}${ampm}`;
}

export default function LogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<UserLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      slotName: 'user',
      align: 'left' as const,
      width: '180px',
    },
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
      slotName: 'module',
      align: 'left' as const,
      width: '160px',
    },
    {
      title: 'Activity',
      dataIndex: 'activity',
      key: 'activity',
      align: 'left' as const,
    },
    {
      title: 'Date',
      dataIndex: 'dateTime',
      key: 'dateTime',
      slotName: 'date',
      align: 'left' as const,
      width: '160px',
    },
  ];

  const slots = {
    user: (_: any, record: UserLog) => (
      <div className="flex items-center gap-2.5">
        <AppAvatar
          name={record.name}
          src={record.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${record.name}`}
          size={28}
        />
        <span className="font-semibold text-text truncate">{record.name}</span>
      </div>
    ),
    module: (module: string) => (
      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral border border-border/50 text-text-info">
        {module}
      </span>
    ),
    date: (dateTime: string) => (
      <span className="text-xs text-text-info font-mono whitespace-nowrap">
        {formatLogDate(dateTime)}
      </span>
    ),
  };

  useEffect(() => {
    setLogs(getUserLogs());
  }, []);

  // Filter logs
  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const q = searchQuery.toLowerCase();
    return logs.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.module.toLowerCase().includes(q) ||
        l.activity.toLowerCase().includes(q)
    );
  }, [logs, searchQuery]);

  return (
    <>
      <ProportNavbar title="User Logs" />

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-text">Audit & User Logs</h2>
            <p className="text-sm text-text-info">
              Showing <b>{filteredLogs.length}</b> total activity log entries recorded.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <AppInput
              placeholder="Search logs by user, module, or activity..."
              leftIcon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              shape="pill"
            />
          </div>
        </div>

        {/* Logs Table Card */}
        {filteredLogs.length === 0 ? (
          <div className="rounded-2xl bg-card-bg border border-border/60 overflow-hidden shadow-sm text-center py-16 text-text-info">
            <ShieldAlert size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No activity logs found</p>
            <p className="text-xs mt-1">Audit logs will compile as actions are performed on the portal.</p>
          </div>
        ) : (
          <AppTable
            columns={columns}
            dataSource={filteredLogs}
            slots={slots}
            rowKey="id"
          />
        )}
      </div>
    </>
  );
}
