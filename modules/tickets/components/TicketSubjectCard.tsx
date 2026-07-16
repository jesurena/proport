'use client';

import React, { useState, useEffect } from 'react';
import { AppLabel, AppBookmark } from '@/components/ui';
import { modal } from '@/modules/theme';
import { STATUS_META } from '@/lib/types';
import type { TicketStatus } from '@/lib/types';

interface TicketSubjectCardProps {
  ticketId: string;
  subject: string;
  status: TicketStatus;
  businessUnitName: string;
}

export function TicketSubjectCard({
  ticketId,
  subject,
  status,
  businessUnitName,
}: TicketSubjectCardProps) {
  const statusMeta = STATUS_META[status];
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pins = localStorage.getItem('proport_pinned_tickets');
      if (pins) {
        const parsed = JSON.parse(pins) as string[];
        setIsPinned(parsed.includes(ticketId));
      }
    }
  }, [ticketId]);

  const togglePin = () => {
    modal.confirm({
      title: isPinned ? 'Remove Bookmark?' : 'Bookmark Ticket?',
      content: isPinned
        ? 'Are you sure you want to remove this ticket from your bookmarks?'
        : 'Are you sure you want to bookmark this ticket for quick access?',
      okText: 'Yes',
      cancelText: 'No',
      centered: true,
      onOk() {
        const pins = localStorage.getItem('proport_pinned_tickets');
        let updated: string[] = [];
        if (pins) {
          const parsed = JSON.parse(pins) as string[];
          if (parsed.includes(ticketId)) {
            updated = parsed.filter((id) => id !== ticketId);
          } else {
            updated = [...parsed, ticketId];
          }
        } else {
          updated = [ticketId];
        }
        localStorage.setItem('proport_pinned_tickets', JSON.stringify(updated));
        setIsPinned(!isPinned);
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('proport-pins-updated'));
      },
    });
  };

  return (
    <div className="rounded-t-xl border border-border/60 bg-card-bg p-5 shadow-sm">
      <div className="flex items-center text-left mb-3.5">
        <AppBookmark
          active={isPinned}
          onClick={togglePin}
          size={20}
          className="mr-2"
          title={isPinned ? 'Remove Bookmark' : 'Bookmark Ticket'}
        />
        <h1 className="text-xl font-bold text-text leading-snug">
          {businessUnitName} - {subject}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <AppLabel
          as="span"
          variant="label"
          className="text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded text-white"
          style={{ backgroundColor: statusMeta.color }}
        >
          {statusMeta.label}
        </AppLabel>
        <AppLabel
          as="span"
          variant="info"
          className="text-[11px] font-semibold text-accent-1 bg-accent-1/10 border border-accent-1/20 px-2 py-0.5 rounded"
        >
          {businessUnitName}
        </AppLabel>
      </div>
    </div>
  );
}
