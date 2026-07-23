'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock3,
  Inbox,
  CircleDot,
  CheckCircle2,
  XCircle,
  FileText,
  UserPlus,
  UserCheck,
} from 'lucide-react';
import { AppAvatar, AppButton, AppLabel } from '@integrated-computer-system/ui-kit';
import { STATUS_META, normalizeStatusKey } from '@/lib/types';
import type { Ticket, TicketStatus } from '@/lib/types';
import { useAuthStore } from '@/modules/auth';
import { TicketActionButton } from './TicketActionButton';

interface TicketActionsCardProps {
  ticket: Ticket;
  onStatusChange: (status: TicketStatus) => void;
  onAssignClick: () => void;
}

export function TicketActionsCard({
  ticket,
  onStatusChange,
  onAssignClick,
}: TicketActionsCardProps) {
  const { user } = useAuthStore();
  const [mockRole, setMockRole] = useState<string | null>(null);

  React.useEffect(() => {
    const storedRole =
      typeof window !== 'undefined' ? localStorage.getItem('proport_my_role') : null;
    if (storedRole) {
      setMockRole(storedRole);
    }
  }, []);

  const role = mockRole || user?.role_name || 'requestor';
  const isBuyerOrAdmin = role === 'buyer' || role === 'admin' || role === 'super_user';
  const canAssign = role === 'buyer' || role === 'admin';

  const resolvedAssignees = React.useMemo(() => {
    if (ticket.assignees && Array.isArray(ticket.assignees)) {
      return ticket.assignees.map((a: any) => ({
        name: a.name,
        avatar: a.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${a.name}`,
      }));
    }
    return [];
  }, [ticket.assignees]);

  const normalizedStatus = normalizeStatusKey(ticket.status, (ticket as any).status_id);
  const statusMeta =
    STATUS_META[normalizedStatus] || STATUS_META[ticket.status] || { label: ticket.status, color: '#6b7280' };

  const getStatusCardDetails = (status: TicketStatus) => {
    switch (status) {
      case 'unassigned':
        return {
          color: '#71717a',
          heading: 'Unassigned Ticket',
          description: 'No buyer has been assigned to this ticket yet. It is waiting for review.',
          icon: <Inbox size={12} className="inline mr-1" />,
        };
      case 'assigned':
        return {
          color: '#059669',
          heading: 'Ticket Assigned',
          description: 'A buyer is actively analyzing the quote request and specifications.',
          icon: <CircleDot size={12} className="inline mr-1" />,
        };
      case 'reassigned':
        return {
          color: '#4f46e5',
          heading: 'Ticket Reassigned',
          description: 'A buyer is actively analyzing the quote request and specifications.',
          icon: <CircleDot size={12} className="inline mr-1" />,
        };
      case 'pending':
        return {
          color: '#f59e0b',
          heading: 'Pending Response',
          description: 'Ticket is pending action or replies from supplier/buyer.',
          icon: <Clock3 size={12} className="inline mr-1" />,
        };
      case 'bu-approval':
      case 'for approval of bu head':
      case 'for-approval-of-bu-head':
        return {
          color: '#db2777',
          heading: 'Awaiting BU Head Approval',
          description:
            'Non-Focus request created; pending approval signature from the Business Unit Head.',
          icon: <CheckCircle2 size={12} className="inline mr-1" />,
        };
      case 'final-approval':
      case 'for final approval':
      case 'for-final-approval':
        return {
          color: '#059669',
          heading: 'Awaiting Final Approval',
          description:
            'Request endorsed by BU Head; pending final executive approval from Adel.',
          icon: <CheckCircle2 size={12} className="inline mr-1" />,
        };
      case 'answered':
        return {
          color: '#0d9488',
          heading: 'Quote Answered',
          description:
            'Pricing details have been provided. Requestor can review and accept/close or reply.',
          icon: <CheckCircle2 size={12} className="inline mr-1" />,
        };
      case 'closed':
        return {
          color: '#059669',
          heading: 'Ticket Closed',
          description: 'This ticket has been resolved and closed successfully.',
          icon: <XCircle size={12} className="inline mr-1" />,
        };
      case 'bu-declined':
      case 'declined by bu head':
      case 'declined-by-bu-head':
        return {
          color: '#dc2626',
          heading: 'Declined by BU Head',
          description: 'This Non-Focus request was declined by the Business Unit Head.',
          icon: <AlertTriangle size={12} className="inline mr-1" />,
        };
      case 'adel-declined':
      case 'declined by final approver':
      case 'declined-by-final-approver':
        return {
          color: '#dc2626',
          heading: 'Declined by Executive (Adel)',
          description: 'This request was declined during final executive approval.',
          icon: <AlertTriangle size={12} className="inline mr-1" />,
        };
      case 'escalated':
        return {
          color: '#dc2626',
          heading: 'Ticket Escalated',
          description: 'This ticket has been escalated and requires immediate attention.',
          icon: <AlertTriangle size={12} className="inline mr-1" />,
        };
      default:
        return {
          color: '#71717a',
          heading: 'Ticket Active',
          description: 'This ticket is currently active and open for discussion.',
          icon: <FileText size={12} className="inline mr-1" />,
        };
    }
  };

  const details = getStatusCardDetails(normalizedStatus);

  return (
    <div className="rounded-xl border border-border/60 bg-card-bg shadow-sm flex flex-col relative z-20">
      <div
        className="p-5 space-y-3 relative overflow-hidden transition-all duration-300 border-b rounded-t-xl"
        style={{
          backgroundColor: `${details.color}20`,
          borderColor: `${details.color}20`,
        }}
      >
        <div className="flex items-center justify-between">
          <AppLabel
            as="span"
            variant="label"
            className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 w-fit select-none"
            style={{
              color: details.color,
            }}
          >
            {details.icon}
            {statusMeta.label}
          </AppLabel>
          <AppLabel
            as="span"
            variant="caption"
            className="text-[11px] font-mono font-bold text-text-info/70 tracking-wider shrink-0 select-none"
          >
            #{ticket.ticketNumber ? String(ticket.ticketNumber).padStart(4, '0') : ticket.id}
          </AppLabel>
        </div>

        <div className="space-y-1">
          <AppLabel as="h4" variant="title" className="!text-xs !font-bold text-text transition-colors">
            {details.heading}
          </AppLabel>
          <AppLabel as="p" variant="description" className="!text-[11px] text-text-info leading-relaxed font-medium">
            {details.description}
          </AppLabel>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <TicketActionButton ticket={ticket} onStatusChange={onStatusChange} />
        <div className="mt-2 pt-3 border-t border-border/20">
          <span className="text-[11px] font-bold text-text-info uppercase tracking-wider block mb-2">
            Buyer (Assignee)
          </span>
          {resolvedAssignees.length > 0 ? (
            <div className="space-y-1.5 mb-3">
              {resolvedAssignees.map((assignee) => {
                return (
                  <div
                    key={assignee.name}
                    className="flex items-center gap-2 bg-neutral/5 p-2 rounded-md border border-border/40"
                  >
                    <AppAvatar
                      name={assignee.name}
                      src={assignee.avatar}
                      size={20}
                    />
                    <span className="text-xs font-semibold text-text truncate flex-1">
                      {assignee.name}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs italic text-text-info mb-3">No buyer assigned</p>
          )}
          {canAssign && (
            <AppButton
              variant="secondary"
              size="sm"
              leftIcon={resolvedAssignees.length > 0 ? <UserCheck size={14} /> : <UserPlus size={14} />}
              onClick={onAssignClick}
              className="w-full text-center text-xs font-semibold text-text bg-neutral/15 hover:bg-neutral/25 border border-border/40 py-2 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 h-9"
            >
              Update Assignment
            </AppButton>
          )}
        </div>
      </div>
    </div>
  );
}
