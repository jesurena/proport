'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppButton, AppAvatar } from '@integrated-computer-system/ui-kit';
import { ArrowLeft, XCircle } from 'lucide-react';
import { ProportNavbar } from '@/modules/sidebar';
import TicketThread from '@/modules/tickets/components/TicketThread';
import { AppFilePreview } from '@/components/ui';
import { getTicketById, addReply, updateTicketStatus, updateTicketAssignee, getUsers, addTicketTags, updateTicketCc } from '@/lib/tickets';
import type { Ticket, TicketStatus, User } from '@/lib/types';

import { TicketMainCard } from '@/modules/tickets/components/TicketMainCard';
import { TicketActionsCard } from '@/modules/tickets/components/TicketActionsCard';
import { TicketInfoCard } from '@/modules/tickets/components/TicketInfoCard';
import { TicketFilesCard } from '@/modules/tickets/components/TicketFilesCard';
import { AppReassignModal } from '@/components/tickets/AppReassignModal';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [selectedCcUsers, setSelectedCcUsers] = useState<User[]>([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  useEffect(() => {
    const t = getTicketById(ticketId);
    if (t) {
      setTicket(t);
    }
  }, [ticketId]);

  const refresh = () => {
    const t = getTicketById(ticketId);
    if (t) setTicket(t);
  };

  const handleSendReply = async (contentText: string, statusAction?: TicketStatus) => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 300));
    addReply(ticketId, { content: contentText });

    if (statusAction) {
      updateTicketStatus(ticketId, statusAction);
    }

    if (selectedCcUsers.length > 0) {
      const ccEmails = selectedCcUsers.map((u) => u.email);
      updateTicketCc(ticketId, ccEmails);
    }

    if (attachments.length > 0) {
      addTicketTags(ticketId, attachments.map(f => f.name));
    }

    setAttachments([]);
    setSelectedCcUsers([]);
    setSending(false);
    refresh();
  };

  const handleDiscard = () => {
    setAttachments([]);
    setSelectedCcUsers([]);
  };

  const handleStatusChange = (status: TicketStatus) => {
    updateTicketStatus(ticketId, status);
    refresh();
  };

  const handleUpdateAssignment = (newAssigneeIds: string, newAssigneeNames: string, remarks: string) => {
    updateTicketAssignee(ticketId, newAssigneeIds);

    if (remarks && remarks.trim()) {
      addReply(ticketId, {
        content: `<strong>Assignment Updated</strong><br/>${remarks}`
      });
    }

    refresh();
  };

  if (!ticket) {
    return (
      <>
        <ProportNavbar title="Ticket Not Found" />
        <div className="flex flex-col items-center justify-center h-[60vh] text-text-info">
          <XCircle size={48} className="mb-3 opacity-30" />
          <p className="text-lg font-medium">Ticket not found</p>
          <AppButton variant="ghost" className="mt-4" onClick={() => router.push('/tickets')}>
            ← Back to Tickets
          </AppButton>
        </div>
      </>
    );
  }

  return (
    <>
      <ProportNavbar title={`#${String(ticket.ticketNumber).padStart(4, '0')}`} />

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => router.push('/tickets')}
            className="flex items-center gap-2 text-sm text-text-info hover:text-text transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Tickets
          </button>
        </div>

        {/* ═══════════ Two-Column Layout ═══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

          {/* ── LEFT COLUMN: Main ticket view card ── */}
          <TicketMainCard
            ticket={ticket}
            sending={sending}
            attachments={attachments}
            setAttachments={setAttachments}
            selectedCcUsers={selectedCcUsers}
            setSelectedCcUsers={setSelectedCcUsers}
            onSendReply={handleSendReply}
            onDiscard={handleDiscard}
            setPreviewFile={setPreviewFile}
          />

          {/* ── RIGHT COLUMN: Actions, Info, Files ── */}
          <div className="space-y-4">
            <TicketActionsCard
              ticket={ticket}
              onStatusChange={handleStatusChange}
              onAssignClick={() => setAssignModalOpen(true)}
            />

            <TicketInfoCard ticket={ticket} />

            <TicketFilesCard ticket={ticket} setPreviewFile={setPreviewFile} />
          </div>
        </div>
      </div>

      {/* Assign Buyer Modal */}
      <AppReassignModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        ticket={ticket}
        onUpdateAssignment={handleUpdateAssignment}
      />

      <AppFilePreview
        open={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />
    </>
  );
}
