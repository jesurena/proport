'use client';

import React, { useState, useEffect } from 'react';
import {
  Check,
  X,
  RotateCcw,
  XCircle,
  MoreHorizontal,
  History,
} from 'lucide-react';
import { AppButton } from '@integrated-computer-system/ui-kit';
import type { Ticket, TicketStatus } from '@/lib/types';
import { normalizeStatusKey } from '@/lib/types';
import { useAuthStore } from '@/modules/auth';
import { TicketTransactionHistoryModal } from '@/components/tickets/TicketTransactionHistoryModal';

interface TicketActionButtonProps {
  ticket: Ticket;
  onStatusChange: (status: TicketStatus) => void;
  className?: string;
}

export function TicketActionButton({
  ticket,
  onStatusChange,
  className = '',
}: TicketActionButtonProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { user } = useAuthStore();
  const [mockRole, setMockRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole =
      typeof window !== 'undefined' ? localStorage.getItem('proport_my_role') : null;
    if (storedRole) {
      setMockRole(storedRole);
    }
  }, []);

  const role = mockRole || user?.role_name || 'requestor';
  const accountId = user?.account_id ? String(user.account_id) : null;
  const isHead = user?.is_head ?? false;

  const isBuyerOrAdmin = role === 'buyer' || role === 'admin' || role === 'super_user';
  const isRequestor =
    role === 'requestor' ||
    role === 'sales' ||
    (accountId !== null && String(ticket.requesterId) === accountId);
  const isBUHead = role === 'bu_head' || isHead || role === 'super_user';
  const isFinalApprover = role === 'adel' || accountId === '415' || role === 'super_user';

  const status = normalizeStatusKey(ticket.status, (ticket as any).status_id);

  // Render primary status button according to status and role
  const renderPrimaryButton = () => {
    // 1. BU Head Approval (Status: bu-approval)
    if (status === 'bu-approval' && isBUHead) {
      return (
        <AppButton
          variant="primary"
          size="sm"
          leftIcon={<Check size={14} />}
          onClick={() => onStatusChange('pending')}
          className="w-full text-xs py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-sm h-9 flex items-center justify-center cursor-pointer"
        >
          Approve Request
        </AppButton>
      );
    }

    // 2. Final Executive Approval (Status: final-approval)
    if (status === 'final-approval' && isFinalApprover) {
      return (
        <AppButton
          variant="primary"
          size="sm"
          leftIcon={<Check size={14} />}
          onClick={() => onStatusChange('pending')}
          className="w-full text-xs py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-sm h-9 flex items-center justify-center cursor-pointer"
        >
          Final Approve
        </AppButton>
      );
    }

    // 3. Re-Approve BU Head Declined (Status: bu-declined)
    if (status === 'bu-declined' && isBUHead) {
      return (
        <AppButton
          variant="primary"
          size="sm"
          leftIcon={<RotateCcw size={14} />}
          onClick={() => onStatusChange('pending')}
          className="w-full text-xs py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-sm h-9 flex items-center justify-center cursor-pointer"
        >
          Re-Approve Request
        </AppButton>
      );
    }

    // 4. Re-Approve Executive Declined (Status: adel-declined)
    if (status === 'adel-declined' && isFinalApprover) {
      return (
        <AppButton
          variant="primary"
          size="sm"
          leftIcon={<RotateCcw size={14} />}
          onClick={() => onStatusChange('pending')}
          className="w-full text-xs py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-sm h-9 flex items-center justify-center cursor-pointer"
        >
          Re-Approve Request
        </AppButton>
      );
    }

    // 5. Active Pending / Assigned (Status: pending, assigned, reassigned, unassigned)
    if (
      (status === 'pending' ||
        status === 'assigned' ||
        status === 'reassigned' ||
        status === 'unassigned') &&
      isBuyerOrAdmin
    ) {
      return (
        <AppButton
          variant="primary"
          size="sm"
          leftIcon={<Check size={14} />}
          onClick={() => onStatusChange('answered')}
          className="w-full text-xs py-2 bg-[#0B2545] hover:bg-[#0B2545]/90 dark:bg-[#134074] dark:hover:bg-[#134074]/90 text-white font-semibold rounded-md shadow-sm h-9 flex items-center justify-center cursor-pointer"
        >
          Mark Answered
        </AppButton>
      );
    }

    // 6. Quote Answered (Status: answered)
    if (status === 'answered' && (isRequestor || isBuyerOrAdmin)) {
      return (
        <AppButton
          variant="primary"
          size="sm"
          leftIcon={<XCircle size={14} />}
          onClick={() => onStatusChange('closed')}
          className="w-full text-xs py-2 bg-[#0B2545] hover:bg-[#0B2545]/90 dark:bg-[#134074] dark:hover:bg-[#134074]/90 text-white font-semibold rounded-md shadow-sm h-9 flex items-center justify-center cursor-pointer"
        >
          Close Ticket
        </AppButton>
      );
    }

    // 7. Closed (Status: closed)
    if (status === 'closed' && (isRequestor || isBuyerOrAdmin)) {
      return (
        <AppButton
          variant="primary"
          size="sm"
          leftIcon={<RotateCcw size={14} />}
          onClick={() => onStatusChange('assigned')}
          className="w-full text-xs py-2 bg-[#0B2545] hover:bg-[#0B2545]/90 dark:bg-[#134074] dark:hover:bg-[#134074]/90 text-white font-semibold rounded-md shadow-sm h-9 flex items-center justify-center cursor-pointer"
        >
          Reopen Ticket
        </AppButton>
      );
    }

    return null;
  };

  const primaryBtn = renderPrimaryButton();

  return (
    <>
      <div className={`flex gap-2 relative mt-1 items-center w-full ${className}`}>
        {primaryBtn && <div className="flex-1">{primaryBtn}</div>}

        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-9 h-9 border border-border/60 bg-neutral/5 hover:bg-hover text-text-info hover:text-text rounded-md transition-colors cursor-pointer flex items-center justify-center shrink-0"
        >
          <MoreHorizontal size={14} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-11 w-48 bg-card-bg border border-border shadow-lg rounded-lg py-1.5 z-50">
            {/* Secondary actions per status */}
            {status === 'bu-approval' && isBUHead && (
              <button
                onClick={() => {
                  onStatusChange('bu-declined');
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-2 font-semibold"
              >
                <X size={13} className="shrink-0" />
                <span>Decline Request</span>
              </button>
            )}

            {status === 'final-approval' && isFinalApprover && (
              <button
                onClick={() => {
                  onStatusChange('adel-declined');
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-2 font-semibold"
              >
                <X size={13} className="shrink-0" />
                <span>Final Decline</span>
              </button>
            )}

            {status === 'answered' && isBuyerOrAdmin && (
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

      <TicketTransactionHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        ticket={ticket}
      />
    </>
  );
}
