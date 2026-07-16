'use client';

import React, { useState } from 'react';
import { CornerUpLeft } from 'lucide-react';
import { AppButton } from '@integrated-computer-system/ui-kit';
import { TicketSubjectCard } from './TicketSubjectCard';
import TicketThread from './TicketThread';
import { TicketReplyComposer } from './TicketReplyComposer';
import type { Ticket, TicketStatus, User } from '@/lib/types';

interface TicketMainCardProps {
  ticket: Ticket;
  sending: boolean;
  attachments: File[];
  setAttachments: React.Dispatch<React.SetStateAction<File[]>>;
  selectedCcUsers: User[];
  setSelectedCcUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onSendReply: (contentText: string, statusAction?: TicketStatus) => void;
  onDiscard: () => void;
  setPreviewFile: (file: any) => void;
}

export function TicketMainCard({
  ticket,
  sending,
  attachments,
  setAttachments,
  selectedCcUsers,
  setSelectedCcUsers,
  onSendReply,
  onDiscard,
  setPreviewFile,
}: TicketMainCardProps) {
  const [showComposer, setShowComposer] = useState(false);

  const handleSendAndCloseComposer = (contentText: string, statusAction?: TicketStatus) => {
    onSendReply(contentText, statusAction);
    setShowComposer(false);
  };

  const handleDiscardAndCloseComposer = () => {
    onDiscard();
    setShowComposer(false);
  };

  return (
    <div className="flex-1 min-w-0">
      <TicketSubjectCard
        ticketId={ticket.id}
        subject={ticket.subject}
        status={ticket.status}
        businessUnitName={ticket.businessUnitName}
      />

      {/* Conversation Thread */}
      <div className="border-x border-border/60 bg-card-bg px-5 pt-5 pb-2">
        <TicketThread
          replies={ticket.replies}
          ticketDescription={ticket.description}
          ticketCreatedAt={ticket.createdAt}
          requesterName={ticket.requesterName}
          requesterAvatar={`https://api.dicebear.com/7.x/initials/svg?seed=${ticket.requesterName.split(' ').map((n) => n[0]).join('')}`}
        />
      </div>

      {/* Reply Composer toggling */}
      {showComposer ? (
        <TicketReplyComposer
          sending={sending}
          attachments={attachments}
          setAttachments={setAttachments}
          selectedCcUsers={selectedCcUsers}
          setSelectedCcUsers={setSelectedCcUsers}
          onSendReply={handleSendAndCloseComposer}
          onDiscard={handleDiscardAndCloseComposer}
          setPreviewFile={setPreviewFile}
        />
      ) : (
        <div className="px-5 py-4 bg-card-bg border-x border-b border-border/60 rounded-b-xl flex justify-end">
          <AppButton
            variant="neutral"
            size="sm"
            leftIcon={<CornerUpLeft size={14} />}
            onClick={() => setShowComposer(true)}
            className="cursor-pointer font-semibold text-xs py-2 px-4 shadow-sm"
          >
            Reply
          </AppButton>
        </div>
      )}
    </div>
  );
}
