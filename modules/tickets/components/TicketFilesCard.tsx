'use client';

import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { AppAttachmentCard } from '@/components/ui';
import { AppLabel } from '@integrated-computer-system/ui-kit';
import type { Ticket } from '@/lib/types';
import { useAttachmentUrl } from '@/modules/tickets/hooks/useTickets';

interface TicketFilesCardProps {
  ticket: Ticket;
  setPreviewFile: (file: string) => void;
}

function displayFileName(name: string): string {
  return name.replace(/^\d+_/, '');
}

export function TicketFilesCard({ ticket, setPreviewFile }: TicketFilesCardProps) {
  const [expanded, setExpanded] = useState(true);
  const getAttachmentUrl = useAttachmentUrl();

  return (
    <div className="rounded-xl border border-border/60 bg-card-bg shadow-sm overflow-hidden">
      {/* Header section toggleable */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between px-4 py-3 bg-card-bg cursor-pointer select-none hover:bg-neutral/5 transition-colors"
      >
        <AppLabel as="span" variant="label" className="text-sm font-bold text-text-info/90">
          Files Shared
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
          <div className="p-4 space-y-3 flex flex-col items-center">
            {ticket.attachments && ticket.attachments.length > 0 ? (
              ticket.attachments.map((file, idx) => (
                <AppAttachmentCard
                  key={idx}
                  name={displayFileName(file.name)}
                  size={file.size}
                  variant="shared"
                  onClick={() => setPreviewFile(file.name)}
                  onDownload={() => {
                    window.open(getAttachmentUrl(file.name), '_blank');
                  }}
                />
              ))
            ) : (
              <AppLabel as="span" variant="description" className="text-xs text-text-info/40 italic block py-2 select-none">
                No files shared
              </AppLabel>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
