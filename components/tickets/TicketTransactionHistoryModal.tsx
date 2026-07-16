'use client';

import React from 'react';
import { AppAvatar } from '@integrated-computer-system/ui-kit';
import { STATUS_META } from '@/lib/types';
import type { Ticket } from '@/lib/types';

interface TicketTransactionHistoryModalProps {
  open: boolean;
  onClose: () => void;
  ticket: Ticket;
}

export function TicketTransactionHistoryModal({
  open,
  onClose,
  ticket,
}: TicketTransactionHistoryModalProps) {
  if (!open) return null;

  const statusMeta = STATUS_META[ticket.status] || { label: ticket.status, color: '#6b7280' };

  // Generate timeline events for transaction history modal
  const getTimelineEvents = () => {
    const events = [];

    // 1. Creation event
    events.push({
      id: 'create',
      title: 'Ticket Created',
      description: `Ticket submitted by ${ticket.requesterName}`,
      time: ticket.createdAt,
      user: { name: ticket.requesterName, role: 'Requester' },
    });

    // 2. Assignee event
    if (ticket.assigneeName) {
      events.push({
        id: 'assign',
        title: 'Assigned Buyer',
        description: `Assigned to ${ticket.assigneeName}`,
        time: ticket.createdAt,
        user: { name: ticket.assigneeName, role: 'Buyer' },
      });
    }

    // 3. Replies
    (ticket.replies || []).forEach((r) => {
      events.push({
        id: r.id,
        title: 'New Response',
        description: `Posted a reply/attachment`,
        time: r.createdAt,
        user: { name: r.authorName, role: 'Respondent' },
      });
    });

    // 4. Status updates
    if (ticket.status !== 'unassigned') {
      events.push({
        id: 'status-update',
        title: 'Status Updated',
        description: `Status changed to ${statusMeta.label}`,
        time: ticket.updatedAt,
        user: { name: ticket.assigneeName || 'System', role: 'Update' },
      });
    }

    // Sort events by time descending (latest on top)
    return events.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  };

  const events = getTimelineEvents();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-card-bg border border-border rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[80vh]">
        <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
          <h3 className="text-sm font-bold text-text flex items-center gap-2">
            <span>Transaction History</span>
            <span className="text-xs font-mono font-normal text-text-info">#{String(ticket.ticketNumber).padStart(4, '0')}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-text-info hover:text-text text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {events.map((evt, idx) => {
            const isLast = idx === events.length - 1;
            return (
              <div key={evt.id} className="flex gap-4 relative">
                {/* Line connector */}
                {!isLast && (
                  <span className="absolute left-[16px] top-8 bottom-[-24px] w-0.5 bg-border/40" />
                )}

                {/* Left avatar icon */}
                <div className="shrink-0 relative z-10">
                  <AppAvatar
                    name={evt.user.name}
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${evt.user.name}`}
                    size={32}
                    className="ring-4 ring-card-bg rounded-full shadow-sm"
                  />
                </div>

                {/* Event details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-xs font-bold text-text truncate">{evt.title}</h4>
                    <span className="text-[10px] text-text-info font-medium shrink-0">
                      {new Date(evt.time).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-info font-medium mt-0.5">{evt.description}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[9px] font-bold text-accent-1/90 px-1.5 py-0.5 rounded bg-accent-1/5 border border-accent-1/10 uppercase tracking-wide">
                      {evt.user.role}
                    </span>
                    <span className="text-[10px] font-semibold text-text truncate">
                      {evt.user.name}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
