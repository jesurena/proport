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
        <div className="rounded-2xl bg-card-bg border border-border/60 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[180px_160px_1fr_160px] gap-4 px-6 py-3.5 bg-neutral/30 border-b border-border/40 font-semibold text-[11px] text-text-info uppercase tracking-wider">
            <span>User</span>
            <span>Module</span>
            <span>Activity</span>
            <span>Date</span>
          </div>

          {/* Rows */}
          {filteredLogs.length === 0 ? (
            <div className="text-center py-16 text-text-info">
              <ShieldAlert size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No activity logs found</p>
              <p className="text-xs mt-1">Audit logs will compile as actions are performed on the portal.</p>
            </div>
          ) : (
            filteredLogs.map((log, i) => (
              <div
                key={log.id}
                className={`grid grid-cols-1 md:grid-cols-[180px_160px_1fr_160px] gap-4 px-6 py-4 items-start md:items-center text-sm ${
                  i !== filteredLogs.length - 1 ? 'border-b border-border/30' : ''
                }`}
              >
                {/* User Info Column */}
                <div className="flex items-center gap-2.5">
                  <AppAvatar
                    name={log.name}
                    src={log.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${log.name}`}
                    size={28}
                  />
                  <span className="font-semibold text-text truncate">{log.name}</span>
                </div>

                {/* Module Column */}
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral border border-border/50 text-text-info">
                    {log.module}
                  </span>
                </div>

                {/* Activity Description */}
                <div className="text-text font-medium leading-relaxed break-words">
                  {log.activity}
                </div>

                {/* Date Time */}
                <div className="text-xs text-text-info font-mono whitespace-nowrap">
                  {formatLogDate(log.dateTime)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
