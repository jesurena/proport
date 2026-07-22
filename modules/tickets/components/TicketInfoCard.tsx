'use client';

import React, { useState, useMemo } from 'react';
import { Minus, Plus } from 'lucide-react';
import { AppAvatar, AppLabel } from '@integrated-computer-system/ui-kit';
import { Tooltip } from 'antd';
import { getUsers } from '@/lib/tickets';
import type { Ticket } from '@/lib/types';

interface TicketInfoCardProps {
  ticket: Ticket;
}

const REQUEST_TYPE_LABELS: Record<string, string> = {
  cost: 'Cost Ticket',
  demo: 'Demo Unit',
  service: 'Service Schedule',
  eta: 'ETA Ticket',
};

export function TicketInfoCard({ ticket }: TicketInfoCardProps) {
  const [expanded, setExpanded] = useState(true);
  const allUsers = getUsers();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Map CC emails to user objects for avatars, using ticket.ccUsers if available
  const ccUsers = useMemo(() => {
    return ticket.ccUsers || [];
  }, [ticket.ccUsers]);

  const requestTypeLabel = ticket.requestType ? (REQUEST_TYPE_LABELS[ticket.requestType] || ticket.requestType) : '—';

  return (
    <div className="rounded-xl border border-border/60 bg-card-bg shadow-sm overflow-hidden">
      {/* Header section toggleable */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between px-4 py-3 bg-card-bg cursor-pointer select-none hover:bg-neutral/5 transition-colors"
      >
        <AppLabel as="span" variant="label" className="text-sm font-bold text-text-info/90">
          Ticket Information
        </AppLabel>
        {expanded ? (
          <Minus size={14} className="text-text-info/60" />
        ) : (
          <Plus size={14} className="text-text-info/60" />
        )}
      </div>

      {/* Vertical stacked segments */}
      {expanded && (
        <div className="divide-y divide-border/40 border-t border-border/40">

          {/* Company Name */}
          <div className="px-4 py-2">
            <AppLabel as="span" variant="info" className="text-[11px] font-semibold text-text-info/70 block mb-1">
              Company Name
            </AppLabel>
            <AppLabel as="span" variant="label" className="text-xs font-bold text-text/80 block uppercase">
              {ticket.customerName || '—'}
            </AppLabel>
          </div>

          {/* Project Name */}
          <div className="px-4 py-2">
            <AppLabel as="span" variant="info" className="text-[11px] font-semibold text-text-info/70 block mb-1">
              Project Name
            </AppLabel>
            <AppLabel as="span" variant="label" className="text-xs font-bold text-text/80 block">
              {ticket.projectName || '—'}
            </AppLabel>
          </div>

          {/* Request Type */}
          <div className="px-4 py-2">
            <AppLabel as="span" variant="info" className="text-[11px] font-semibold text-text-info/70 block mb-1">
              Request Type
            </AppLabel>
            <AppLabel as="span" variant="label" className="text-xs font-bold text-text/80 block">
              {requestTypeLabel}
            </AppLabel>
          </div>

          {/* Category */}
          <div className="px-4 py-2">
            <AppLabel as="span" variant="info" className="text-[11px] font-semibold text-text-info/70 block mb-1">
              Category
            </AppLabel>
            <AppLabel as="span" variant="label" className="text-xs font-bold text-text/80 block uppercase">
              {ticket.brandType ? (ticket.brandType === 'Focus' ? 'Focus' : 'Non-Focus') : '—'}
            </AppLabel>
          </div>

          {/* Brand */}
          <div className="px-4 py-2">
            <AppLabel as="span" variant="info" className="text-[11px] font-semibold text-text-info/70 block mb-1">
              Brand
            </AppLabel>
            <AppLabel as="span" variant="label" className="text-xs font-bold text-text/80 block uppercase">
              {ticket.brandName || '—'}
            </AppLabel>
          </div>

          {/* Carbon Copy (CC Avatars) */}
          <div className="px-4 py-2">
            <AppLabel as="span" variant="info" className="text-[11px] font-semibold text-text-info/70 block mb-1">
              Carbon Copy
            </AppLabel>
            {ccUsers.length > 0 ? (
              <div className="flex -space-x-1.5 mt-1.5 shrink-0 py-1 px-0.5">
                {ccUsers.map((u, i) => {
                  const avatarUrl = u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`;
                  return (
                    <Tooltip key={u.email} title={`${u.name} (${u.email})`} placement="top" mouseEnterDelay={0.2}>
                      <div
                        className="shrink-0 relative transition-all duration-200 hover:!z-50 cursor-pointer"
                        style={{ zIndex: ccUsers.length - i }}
                      >
                        <AppAvatar
                          name={u.name}
                          src={avatarUrl}
                          size={24}
                          className="ring-2 ring-background rounded-full shrink-0 shadow-sm"
                        />
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            ) : (
              <AppLabel as="span" variant="description" className="text-xs text-text-info/40 italic block mt-0.5">
                No recipients copied
              </AppLabel>
            )}
          </div>

          {/* Timestamps */}
          <div className="px-4 py-2 bg-neutral/5 flex items-center justify-between gap-4 text-[11px] text-text-info/80">
            <div>
              <AppLabel as="span" variant="info" className="font-semibold block text-[11px]">Created</AppLabel>
              <AppLabel as="span" variant="description" className="mt-0.5 block text-[11px]">{formatDate(ticket.createdAt)}</AppLabel>
            </div>
            <div className="text-right">
              <AppLabel as="span" variant="info" className="font-semibold block text-[11px]">Last Updated</AppLabel>
              <AppLabel as="span" variant="description" className="mt-0.5 block text-[11px]">{formatDate(ticket.updatedAt)}</AppLabel>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
