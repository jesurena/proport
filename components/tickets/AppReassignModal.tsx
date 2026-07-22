'use client';

import React, { useState, useEffect } from 'react';
import { MoveLeft, MoveRight } from 'lucide-react';
import { AppButton, AppLabel, AppModal } from '@integrated-computer-system/ui-kit';
import { AppSummernoteEditor } from '@/modules/compose/components/AppSummernoteEditor';
import { AppAvatarCard } from './AppAvatarCard';
import { useTicketAssignees } from '@/modules/tickets/hooks/useTickets';
import type { Ticket, User } from '@/lib/types';
import { cn } from '@/components/utils/cn';

interface AppReassignModalProps {
  open: boolean;
  onClose: () => void;
  ticket: Ticket;
  onUpdateAssignment: (assigneeIds: string, assigneeNames: string, remarks: string) => Promise<void>;
}

export function AppReassignModal({
  open,
  onClose,
  ticket,
  onUpdateAssignment,
}: AppReassignModalProps) {
  const [assignedList, setAssignedList] = useState<User[]>([]);
  const [availableList, setAvailableList] = useState<User[]>([]);
  const [remarks, setRemarks] = useState('');
  const [isDragOverAssigned, setIsDragOverAssigned] = useState(false);
  const [isDragOverAvailable, setIsDragOverAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch real assignees and available buyers from database constant
  const { data: assigneesRes, isLoading } = useTicketAssignees(String(ticket.id), open);

  // Initialize lists when data is loaded
  useEffect(() => {
    if (assigneesRes) {
      setAssignedList(assigneesRes.assigned);
      setAvailableList(assigneesRes.available);
      setRemarks('');
      setIsDragOverAssigned(false);
      setIsDragOverAvailable(false);
    }
  }, [assigneesRes]);

  const handleDragStart = (e: React.DragEvent, userId: string, source: 'available' | 'assigned') => {
    e.dataTransfer.setData('text/plain', userId);
    e.dataTransfer.setData('source', source);
  };

  const handleDropToAssigned = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverAssigned(false);
    const userId = e.dataTransfer.getData('text/plain');
    const source = e.dataTransfer.getData('source');

    if (source === 'available') {
      const user = availableList.find((u) => u.id === userId);
      if (user) {
        setAssignedList((prev) => [...prev, user]);
        setAvailableList((prev) => prev.filter((u) => u.id !== userId));
      }
    }
  };

  const handleDropToAvailable = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverAvailable(false);
    const userId = e.dataTransfer.getData('text/plain');
    const source = e.dataTransfer.getData('source');

    if (source === 'assigned') {
      const user = assignedList.find((u) => u.id === userId);
      if (user) {
        setAvailableList((prev) => [...prev, user]);
        setAssignedList((prev) => prev.filter((u) => u.id !== userId));
      }
    }
  };

  const handleUpdate = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const ids = assignedList.map((u) => u.id).join(',');
      const names = assignedList.map((u) => u.name).join(', ');
      await onUpdateAssignment(ids, names, remarks);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppModal open={open} onClose={onClose} width={760} centered>
      <AppModal.Header>
        <AppModal.Title>Assignment Details</AppModal.Title>
        <AppModal.Description>
          Drag and drop buyers between the columns to assign or unassign them from this ticket.
        </AppModal.Description>
      </AppModal.Header>

      <AppModal.Body className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-accent-1 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-text-info font-medium mt-3">Loading buyers list...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_50px_1fr] gap-4 items-center">

            {/* Assigned Buyers column (Left Side) */}
            <div className="flex flex-col h-full">
              <AppLabel as="h4" variant="label" className="text-[13px] font-bold text-text-info mb-2 text-left">
                Assigned Buyer(s)
              </AppLabel>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOverAssigned(true);
                }}
                onDragLeave={() => setIsDragOverAssigned(false)}
                onDrop={handleDropToAssigned}
                className={cn(
                  "border border-border/60 bg-neutral/5 rounded-lg p-3 h-[220px] overflow-y-auto flex flex-col gap-1.5 transition-colors duration-200 select-none",
                  isDragOverAssigned && "bg-neutral-200 border-accent-1/40 border-dashed"
                )}
              >
                {assignedList.length > 0 ? (
                  assignedList.map((buyer) => (
                    <AppAvatarCard
                      key={buyer.id}
                      user={buyer}
                      draggable
                      onDragStart={(e) => handleDragStart(e, buyer.id, 'assigned')}
                    />
                  ))
                ) : (
                  <div className="m-auto flex flex-col items-center justify-center text-center p-4 border border-dashed border-border/60 rounded-lg w-full h-full">
                    <AppLabel as="span" className="text-xs text-text-info/50 italic mb-1">
                      Drag & Drop
                    </AppLabel>
                    <AppLabel as="span" variant="description" className="text-[10px] text-text-info/40">
                      to assign a buyer to this ticket
                    </AppLabel>
                  </div>
                )}
              </div>
            </div>

            {/* Indicator icons */}
            <div className="hidden md:flex flex-col items-center gap-3 mt-6 text-text-info/30 font-bold">
              <MoveRight size={18} />
              <MoveLeft size={18} />
            </div>

            {/* Available Buyers column (Right Side) */}
            <div className="flex flex-col h-full">
              <AppLabel as="h4" variant="label" className="text-[13px] font-bold text-text-info mb-2 text-left">
                Available Buyers
              </AppLabel>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOverAvailable(true);
                }}
                onDragLeave={() => setIsDragOverAvailable(false)}
                onDrop={handleDropToAvailable}
                className={cn(
                  "border border-border/60 bg-neutral/5 rounded-lg p-3 h-[220px] overflow-y-auto flex flex-col gap-1.5 transition-colors duration-200 select-none",
                  isDragOverAvailable && "bg-neutral-200 border-accent-1/40 border-dashed"
                )}
              >
                {availableList.length > 0 ? (
                  availableList.map((buyer) => (
                    <AppAvatarCard
                      key={buyer.id}
                      user={buyer}
                      draggable
                      onDragStart={(e) => handleDragStart(e, buyer.id, 'available')}
                    />
                  ))
                ) : (
                  <div className="m-auto flex flex-col items-center justify-center text-center opacity-40">
                    <AppLabel as="span" className="text-xs text-text-info italic">
                      No buyers available
                    </AppLabel>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Remarks Editor */}
        <div className="flex flex-col">
          <AppLabel as="h4" variant="label" className="text-[13px] font-bold text-text mb-2 text-left">
            Remarks
          </AppLabel>
          <AppSummernoteEditor
            value={remarks}
            onChange={setRemarks}
            placeholder="Write assignment remarks or notes..."
            height={130}
          />
        </div>
      </AppModal.Body>

      <AppModal.Footer>
        <AppButton
          variant="neutral"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </AppButton>
        <AppButton
          variant="primary"
          onClick={handleUpdate}
          loading={loading}
          disabled={loading || isLoading}
        >
          Update Assignment
        </AppButton>
      </AppModal.Footer>
    </AppModal>
  );
}
