'use client';

import React, { useState, useEffect } from 'react';
import { MoreHorizontal, AlertTriangle, Clock3, Inbox, CircleDot, CheckCircle2, XCircle, FileText, History, RotateCcw, Check, X, UserPlus, UserCheck, Pin } from 'lucide-react';
import { AppAvatar, AppButton } from '@integrated-computer-system/ui-kit';
import { STATUS_META } from '@/lib/types';
import type { Ticket, TicketStatus } from '@/lib/types';
import { cn } from '@/components/utils/cn';
import { TicketTransactionHistoryModal } from '@/components/tickets/TicketTransactionHistoryModal';
import { notification } from 'antd';

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const statusMeta = STATUS_META[ticket.status] || { label: ticket.status, color: '#6b7280' };

  const getStatusCardDetails = (status: TicketStatus) => {
    switch (status) {
      case 'unassigned':
        return {
          color: '#6b7280',
          heading: 'Unassigned Ticket',
          description: 'No buyer has been assigned to this ticket yet. It is waiting for review.',
          icon: <Inbox size={12} className="inline mr-1" />,
        };
      case 'assigned':
      case 'reassigned':
        return {
          color: '#3b82f6',
          heading: 'Ticket in Progress',
          description: 'A buyer is actively analyzing the quote request and specifications.',
          icon: <CircleDot size={12} className="inline mr-1" />,
        };
      case 'pending':
        return {
          color: '#ffc107',
          heading: 'Pending Response',
          description: 'Ticket is pending action or replies from supplier/buyer.',
          icon: <Clock3 size={12} className="inline mr-1" />,
        };
      case 'bu-approval':
      case 'final-approval':
        return {
          color: '#2d5a27',
          heading: 'Awaiting Approval',
          description: 'Ticket completed by buyer; now pending Business Unit head approval signature.',
          icon: <CheckCircle2 size={12} className="inline mr-1" />,
        };
      case 'answered':
        return {
          color: '#17a2b8',
          heading: 'Quote Answered',
          description: 'Pricing details have been generated and the response sent.',
          icon: <CheckCircle2 size={12} className="inline mr-1" />,
        };
      case 'closed':
        return {
          color: '#20c997',
          heading: 'Ticket Closed',
          description: 'This ticket has been resolved and closed successfully.',
          icon: <XCircle size={12} className="inline mr-1" />,
        };
      case 'escalated':
      case 'bu-declined':
      case 'adel-declined':
        return {
          color: '#dc3545',
          heading: 'Ticket Declined',
          description: 'This ticket has been declined or requires immediate intervention.',
          icon: <AlertTriangle size={12} className="inline mr-1" />,
        };
      default:
        return {
          color: '#6b7280',
          heading: 'Ticket Active',
          description: 'This ticket is currently active and open for discussion.',
          icon: <FileText size={12} className="inline mr-1" />,
        };
    }
  };

  const details = getStatusCardDetails(ticket.status);

  return (
    <>
      <div className="rounded-xl border border-border/60 bg-card-bg shadow-sm flex flex-col relative z-20">
        {/* Soft Pastel Status Alert Box - Full Upper Card */}
        <div
          className="p-5 space-y-3 relative overflow-hidden transition-all duration-300 border-b rounded-t-xl"
          style={{
            backgroundColor: `${details.color}20`, // ~4% opacity
            borderColor: `${details.color}20`, // ~12% opacity
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center justify-center w-fit border"
              style={{
                backgroundColor: `${details.color}1c`, // ~11% opacity
                color: details.color,
                borderColor: `${details.color}30`, // ~18% opacity
              }}
            >
              {details.icon}
              {statusMeta.label}
            </span>
            <span className="text-[10px] font-semibold text-text-info/50 uppercase tracking-widest shrink-0 select-none">
              Live status
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-bold text-text transition-colors">
              {details.heading}
            </h4>
            <p className="text-[11px] text-text-info leading-relaxed font-medium">
              {details.description}
            </p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Buttons layout */}
          <div className="flex gap-2 relative mt-1 items-center">
            {ticket.status !== 'closed' ? (
              ticket.status !== 'answered' ? (
                <AppButton
                  variant="primary"
                  size="sm"
                  leftIcon={<Check size={14} />}
                  onClick={() => onStatusChange('answered')}
                  className="flex-1 text-xs py-2 bg-[#0B2545] hover:bg-[#0B2545]/90 dark:bg-[#134074] dark:hover:bg-[#134074]/90 text-white font-semibold rounded-md shadow-sm h-9 flex items-center justify-center cursor-pointer"
                >
                  Mark Answered
                </AppButton>
              ) : (
                <AppButton
                  variant="primary"
                  size="sm"
                  leftIcon={<X size={14} />}
                  onClick={() => onStatusChange('closed')}
                  className="flex-1 text-xs py-2 bg-[#0B2545] hover:bg-[#0B2545]/90 dark:bg-[#134074] dark:hover:bg-[#134074]/90 text-white font-semibold rounded-md shadow-sm h-9 flex items-center justify-center cursor-pointer"
                >
                  Close Ticket
                </AppButton>
              )
            ) : (
              <AppButton
                variant="primary"
                size="sm"
                leftIcon={<RotateCcw size={14} />}
                onClick={() => onStatusChange('assigned')}
                className="flex-1 text-xs py-2 bg-[#0B2545] hover:bg-[#0B2545]/90 dark:bg-[#134074] dark:hover:bg-[#134074]/90 text-white font-semibold rounded-md shadow-sm h-9 flex items-center justify-center cursor-pointer"
              >
                Reopen Ticket
              </AppButton>
            )}

            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 border border-border/60 bg-neutral/5 hover:bg-hover text-text-info hover:text-text rounded-md transition-colors cursor-pointer flex items-center justify-center shrink-0"
            >
              <MoreHorizontal size={14} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-11 w-48 bg-card-bg border border-border shadow-lg rounded-lg py-1.5 z-50">
                {ticket.status !== 'closed' ? (
                  <>
                    {ticket.status === 'answered' && (
                      <button
                        onClick={() => {
                          onStatusChange('assigned');
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-text hover:bg-hover transition-colors flex items-center gap-2 font-medium"
                      >
                        <RotateCcw size={13} className="text-text-info shrink-0" />
                        <span>Mark Unanswered</span>
                      </button>
                    )}
                    {ticket.status !== 'answered' && (
                      <button
                        onClick={() => {
                          onStatusChange('closed');
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-text hover:bg-hover transition-colors flex items-center gap-2 font-medium"
                      >
                        <XCircle size={13} className="text-text-info shrink-0" />
                        <span>Close Ticket</span>
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => {
                      onStatusChange('assigned');
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-text hover:bg-hover transition-colors flex items-center gap-2 font-medium"
                  >
                    <RotateCcw size={13} className="text-text-info shrink-0" />
                    <span>Reopen</span>
                  </button>
                )}
                
                {/* Transaction History Option */}
                <button
                  onClick={() => {
                    setHistoryOpen(true);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-text hover:bg-hover transition-colors border-t border-border/40 flex items-center gap-2 font-medium mt-1 pt-2"
                >
                  <History size={13} className="text-text-info shrink-0" />
                  <span>Transaction History</span>
                </button>
              </div>
            )}
          </div>

          {/* Assignee Selection */}
          {ticket.status !== 'closed' && (
            <div className="mt-2 pt-3 border-t border-border/20">
              <span className="text-[11px] font-bold text-text-info uppercase tracking-wider block mb-2">
                Buyer (Assignee)
              </span>
              {ticket.assigneeName ? (
                <div className="space-y-1.5 mb-3">
                  {ticket.assigneeName.split(',').map((name) => {
                    const cleanName = name.trim();
                    return (
                      <div key={cleanName} className="flex items-center gap-2 bg-neutral/5 p-2 rounded-md border border-border/40">
                        <AppAvatar
                          name={cleanName}
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${cleanName}`}
                          size={20}
                        />
                        <span className="text-xs font-semibold text-text truncate flex-1">{cleanName}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs italic text-text-info mb-3">No buyer assigned</p>
              )}
              <AppButton
                variant="secondary"
                size="sm"
                leftIcon={ticket.assigneeId ? <UserCheck size={14} /> : <UserPlus size={14} />}
                onClick={onAssignClick}
                className="w-full text-center text-xs font-semibold text-text bg-neutral/15 hover:bg-neutral/25 border border-border/40 py-2 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 h-9"
              >
                Update Assignment
              </AppButton>
            </div>
          )}
        </div>
      </div>

      <TicketTransactionHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        ticket={ticket}
      />
    </>
  );
}
