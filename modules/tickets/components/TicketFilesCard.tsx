'use client';

import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { AppAttachmentCard } from '@/components/ui';
import { AppLabel } from '@integrated-computer-system/ui-kit';
import type { Ticket } from '@/lib/types';

interface TicketFilesCardProps {
  ticket: Ticket;
  setPreviewFile: (file: string) => void;
}

export function TicketFilesCard({ ticket, setPreviewFile }: TicketFilesCardProps) {
  const [expanded, setExpanded] = useState(true);

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
            {ticket.tags && ticket.tags.length > 0 ? (
              ticket.tags.map((tag, idx) => (
                <AppAttachmentCard
                  key={idx}
                  name={tag}
                  variant="shared"
                  onClick={() => setPreviewFile(tag)}
                  onDownload={() => {
                    alert(`Downloading: ${tag}`);
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
