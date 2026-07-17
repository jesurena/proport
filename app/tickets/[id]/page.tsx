'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppButton } from '@integrated-computer-system/ui-kit';
import { ArrowLeft, XCircle } from 'lucide-react';
import { ProportNavbar } from '@/modules/sidebar';
import type { TicketStatus, User } from '@/lib/types';
import { useTicketDetail, useAddReply, useUpdateAssignment, useUpdateStatus } from '@/modules/tickets/hooks/useTickets';

import { TicketMainCard } from '@/modules/tickets/components/TicketMainCard';
import { TicketActionsCard } from '@/modules/tickets/components/TicketActionsCard';
import { TicketInfoCard } from '@/modules/tickets/components/TicketInfoCard';
import { TicketFilesCard } from '@/modules/tickets/components/TicketFilesCard';
import { AppReassignModal } from '@/components/tickets/AppReassignModal';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [selectedCcUsers, setSelectedCcUsers] = useState<User[]>([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const { data: ticketData, isLoading } = useTicketDetail(ticketId);
  const ticket = React.useMemo(() => {
    if (!ticketData?.ticket) return null;
    return {
      ...ticketData.ticket,
      businessUnitName: ticketData.ticket.businessUnitName ?? ticketData.ticket.brandName ?? 'N/A',
      cc: (ticketData.ticket.ccUsers || []).map((u: any) => u.email),
      replies: (ticketData.ticket.replies || []).map((r: any) => ({
        id: r.id ?? r.reply_id,
        authorName: r.authorName,
        authorAvatar: r.authorAvatar,
        content: r.content ?? r.replyContent ?? r.reply ?? '',
        createdAt: r.createdAt ?? r.dateCreated ?? r.date_replied,
      })),
    };
  }, [ticketData]);

  const addReplyMutation = useAddReply();
  const updateAssignmentMutation = useUpdateAssignment();
  const updateStatusMutation = useUpdateStatus();

  const handleSendReply = async (contentText: string, statusAction?: TicketStatus) => {
    setSending(true);
    try {
      await addReplyMutation.mutateAsync({
        id: ticketId,
        payload: {
          content: contentText,
          cc_ids: selectedCcUsers.map((u) => String(u.id)),
          status_action: statusAction,
        },
      });
      setAttachments([]);
      setSelectedCcUsers([]);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleDiscard = () => {
    setAttachments([]);
    setSelectedCcUsers([]);
  };

  const handleStatusChange = async (status: TicketStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: ticketId, status });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAssignment = async (newAssigneeIds: string, newAssigneeNames: string, remarks: string) => {
    try {
      await updateAssignmentMutation.mutateAsync({ id: ticketId, assignee_ids: newAssigneeIds });
      if (remarks && remarks.trim()) {
        await addReplyMutation.mutateAsync({
          id: ticketId,
          payload: {
            content: remarks,
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[100vh] text-text-info bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
            previewFile={previewFile}
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
    </>
  );
}
