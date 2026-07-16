'use client';

import React from 'react';
import { AppAvatar, AppDivider } from '@integrated-computer-system/ui-kit';
import { Ticket, STATUS_META, PRIORITY_META } from '@/lib/types';
import { Calendar, Building2 } from 'lucide-react';

interface TicketInfoPanelProps {
  ticket: Ticket;
}

function formatPanelDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TicketInfoPanel({ ticket }: TicketInfoPanelProps) {
  const priorityMeta = PRIORITY_META[ticket.priority];
  const statusMeta = STATUS_META[ticket.status];

  return (
    <div className="rounded-2xl bg-card-bg border border-border/60 p-5 space-y-4 shadow-sm">
      <h3 className="text-sm font-semibold text-text mb-3">Ticket Information</h3>

      {/* Assignee */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-text-info uppercase tracking-wider block">Buyer (Assignee)</span>
        {ticket.assigneeId ? (
          <div className="flex items-center gap-2">
            <AppAvatar
              name={ticket.assigneeName!}
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${ticket.assigneeName}`}
              size={24}
            />
            <span className="text-sm font-medium text-text">{ticket.assigneeName}</span>
          </div>
        ) : (
          <span className="text-sm font-semibold text-text-info italic">Not assigned</span>
        )}
      </div>

      <AppDivider className="my-0" />

      {/* Priority */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-text-info uppercase tracking-wider block">Priority</span>
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: priorityMeta.color }}
          />
          <span className="text-sm font-semibold text-text">{priorityMeta.label}</span>
        </div>
      </div>

      <AppDivider className="my-0" />

      {/* Business Unit */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-text-info uppercase tracking-wider block">Business Unit</span>
        <div className="flex items-center gap-2 text-sm text-text font-medium">
          <Building2 size={14} className="text-text-info" />
          <span>{ticket.businessUnitName} ({ticket.businessUnitId})</span>
        </div>
      </div>

      <AppDivider className="my-0" />

      {/* Requester */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-text-info uppercase tracking-wider block">Sales Rep (Requester)</span>
        <div className="flex items-center gap-2">
          <AppAvatar
            name={ticket.requesterName}
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${ticket.requesterName}`}
            size={24}
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text truncate">{ticket.requesterName}</p>
          </div>
        </div>
      </div>

      {ticket.supplierName && (
        <>
          <AppDivider className="my-0" />
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-text-info uppercase tracking-wider block">Supplier</span>
            <span className="text-sm font-semibold text-text">{ticket.supplierName}</span>
          </div>
        </>
      )}

      {ticket.targetPrice !== undefined && (
        <>
          <AppDivider className="my-0" />
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-text-info uppercase tracking-wider block">Target Price</span>
            <span className="text-sm font-semibold text-text">${ticket.targetPrice.toFixed(2)}</span>
          </div>
        </>
      )}

      {ticket.estimatedQuantity !== undefined && (
        <>
          <AppDivider className="my-0" />
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-text-info uppercase tracking-wider block">Est. Quantity</span>
            <span className="text-sm font-semibold text-text">{ticket.estimatedQuantity}</span>
          </div>
        </>
      )}

      <AppDivider className="my-0" />

      {/* Timestamps */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-info flex items-center gap-1">
            <Calendar size={12} />
            Created
          </span>
          <span className="font-medium text-text">{formatPanelDate(ticket.createdAt)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-info flex items-center gap-1">
            <Calendar size={12} />
            Updated
          </span>
          <span className="font-medium text-text">{formatPanelDate(ticket.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}
