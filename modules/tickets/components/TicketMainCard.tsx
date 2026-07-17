'use client';

import React, { useState } from 'react';
import { CornerUpLeft } from 'lucide-react';
import { AppLabel, AppButton } from '@integrated-computer-system/ui-kit';
import { TicketSubjectCard } from './TicketSubjectCard';
import TicketThread from './TicketThread';
import { TicketReplyComposer } from './TicketReplyComposer';
import { AppFilePreview } from '@/components/ui';
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
  previewFile: any;
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
  previewFile,
  setPreviewFile,
}: TicketMainCardProps) {
  const [showComposer, setShowComposer] = useState(false);

  const isClosed = ticket.status === 'closed';

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
        description={ticket.description}
        createdAt={ticket.createdAt}
        requesterName={ticket.requesterName}
        requesterAvatar={ticket.requesterAvatar}
        attachments={ticket.attachments}
        setPreviewFile={setPreviewFile}
        brandName={ticket.brandName}
        brandType={ticket.brandType}
      />

      {/* 2. Conversation Thread (Replies) */}
      <div className="border-x border-border/60 bg-card-bg px-5 py-2">
        <TicketThread
          replies={ticket.replies}
          ticketDescription={ticket.description}
          ticketCreatedAt={ticket.createdAt}
          requesterName={ticket.requesterName}
          requesterAvatar={ticket.requesterAvatar ?? `https://api.dicebear.com/7.x/initials/svg?seed=${ticket.requesterName.split(' ').map((n) => n[0]).join('')}`}
          attachments={ticket.attachments}
          onAttachmentClick={setPreviewFile}
        />
      </div>

      {/* 3. Reply Composer / Trigger Button at the bottom */}
      {!isClosed && (
        <>
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
        </>
      )}

      {isClosed && (
        <div className="border-x border-b border-border/60 bg-card-bg rounded-b-xl h-4" />
      )}

      <AppFilePreview
        open={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />
    </div>
  );
}
