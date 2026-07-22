'use client';

import React, { useState, useEffect } from 'react';
import { MoveLeft, MoveRight } from 'lucide-react';
import { AppButton, AppLabel, AppModal } from '@integrated-computer-system/ui-kit';
import { AppSummernoteEditor } from '@/modules/compose/components/AppSummernoteEditor';
import { AppAvatarCard } from './AppAvatarCard';
import { useTicketAssignees } from '@/modules/tickets/hooks/useTickets';
import type { Ticket, User } from '@/lib/types';
import { cn } from '@/components/utils/cn';
import { AppReassignSkeleton } from '@/components/skeleton';

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
  const [isDragging, setIsDragging] = useState(false);
  const [dragSource, setDragSource] = useState<'available' | 'assigned' | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: assigneesRes, isLoading } = useTicketAssignees(String(ticket.id), open);

  useEffect(() => {
    if (assigneesRes) {
      setAssignedList(assigneesRes.assigned);
      setAvailableList(assigneesRes.available);
      setRemarks('');
      setIsDragOverAssigned(false);
      setIsDragOverAvailable(false);
      setIsDragging(false);
      setDragSource(null);
    }
  }, [assigneesRes]);

  const handleDragStart = (e: React.DragEvent, userId: string, source: 'available' | 'assigned') => {
    e.dataTransfer.setData('text/plain', userId);
    e.dataTransfer.setData('source', source);
    setIsDragging(true);
    setDragSource(source);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragSource(null);
    setIsDragOverAssigned(false);
    setIsDragOverAvailable(false);
  };

  const handleDropToAssigned = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverAssigned(false);
    setIsDragging(false);
    setDragSource(null);
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
    setIsDragging(false);
    setDragSource(null);
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
          <AppReassignSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_50px_1fr] gap-4 items-stretch">

            {/* Assigned Buyers column (Left Side) */}
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-2">
                <AppLabel as="h4" variant="label" className="text-[13px] font-bold text-text-info text-left">
                  Assigned Buyer(s)
                </AppLabel>
                <AppLabel as="span" variant="description" className="text-[10px] font-semibold text-text-info/40">
                  {assignedList.length} buyer{assignedList.length !== 1 ? 's' : ''}
                </AppLabel>
              </div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOverAssigned(true);
                }}
                onDragLeave={() => setIsDragOverAssigned(false)}
                onDrop={handleDropToAssigned}
                className={cn(
                  "border-2 rounded-xl p-3 h-[260px] overflow-y-auto flex flex-col gap-1.5 transition-all duration-200 select-none",
                  isDragOverAssigned
                    ? "bg-accent-1/5 border-accent-1/50 border-dashed ring-2 ring-accent-1/20"
                    : isDragging && dragSource === 'available'
                      ? "border-dashed border-accent-1/30 bg-accent-1/[0.02]"
                      : isDragging && dragSource === 'assigned'
                        ? "border-transparent bg-neutral/5"
                        : "border-border/50 bg-neutral/5"
                )}
              >
                {assignedList.length > 0 ? (
                  assignedList.map((buyer) => (
                    <AppAvatarCard
                      key={buyer.id}
                      user={buyer}
                      draggable
                      onDragStart={(e) => handleDragStart(e, buyer.id, 'assigned')}
                      onDragEnd={handleDragEnd}
                    />
                  ))
                ) : (
                  <div className={cn(
                    "m-auto flex flex-col items-center justify-center text-center p-4 rounded-lg w-full h-full transition-all",
                    isDragging && dragSource === 'available'
                      ? "border-2 border-dashed border-accent-1/40"
                      : "border border-dashed border-border/40"
                  )}>
                    <MoveLeft size={20} className={cn(
                      "mb-2 transition-colors",
                      isDragging && dragSource === 'available' ? "text-accent-1" : "text-text-info/25"
                    )} />
                    <AppLabel as="span" className={cn(
                      "text-xs font-semibold mb-0.5 transition-colors",
                      isDragging && dragSource === 'available' ? "text-accent-1" : "text-text-info/40"
                    )}>
                      {isDragging && dragSource === 'available' ? 'Drop here to assign' : 'No buyers assigned'}
                    </AppLabel>
                    <AppLabel as="span" variant="description" className="text-[10px] text-text-info/30">
                      {isDragging && dragSource === 'available' ? 'Release to add this buyer' : 'Drag a buyer from the right'}
                    </AppLabel>
                  </div>
                )}
              </div>
            </div>

            {/* Indicator icons */}
            <div className="hidden md:flex flex-col items-center justify-center gap-2 text-text-info/25">
              <MoveRight size={16} className={cn(
                "transition-all",
                isDragging && dragSource === 'assigned' && "text-accent-1 scale-110"
              )} />
              <div className="h-px w-4 bg-border/30" />
              <MoveLeft size={16} className={cn(
                "transition-all",
                isDragging && dragSource === 'available' && "text-accent-1 scale-110"
              )} />
            </div>

            {/* Available Buyers column (Right Side) */}
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-2">
                <AppLabel as="h4" variant="label" className="text-[13px] font-bold text-text-info text-left">
                  Available Buyers
                </AppLabel>
                <AppLabel as="span" variant="description" className="text-[10px] font-semibold text-text-info/40">
                  {availableList.length} buyer{availableList.length !== 1 ? 's' : ''}
                </AppLabel>
              </div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOverAvailable(true);
                }}
                onDragLeave={() => setIsDragOverAvailable(false)}
                onDrop={handleDropToAvailable}
                className={cn(
                  "border-2 rounded-xl p-3 h-[260px] overflow-y-auto flex flex-col gap-1.5 transition-all duration-200 select-none",
                  isDragOverAvailable
                    ? "bg-accent-1/5 border-accent-1/50 border-dashed ring-2 ring-accent-1/20"
                    : isDragging && dragSource === 'assigned'
                      ? "border-dashed border-accent-1/30 bg-accent-1/[0.02]"
                      : isDragging && dragSource === 'available'
                        ? "border-transparent bg-neutral/5"
                        : "border-border/50 bg-neutral/5"
                )}
              >
                {availableList.length > 0 ? (
                  availableList.map((buyer) => (
                    <AppAvatarCard
                      key={buyer.id}
                      user={buyer}
                      draggable
                      onDragStart={(e) => handleDragStart(e, buyer.id, 'available')}
                      onDragEnd={handleDragEnd}
                    />
                  ))
                ) : (
                  <div className={cn(
                    "m-auto flex flex-col items-center justify-center text-center p-4 rounded-lg w-full h-full transition-all",
                    isDragging && dragSource === 'assigned'
                      ? "border-2 border-dashed border-accent-1/40"
                      : "border border-dashed border-border/40"
                  )}>
                    <MoveRight size={20} className={cn(
                      "mb-2 transition-colors",
                      isDragging && dragSource === 'assigned' ? "text-accent-1" : "text-text-info/25"
                    )} />
                    <AppLabel as="span" className={cn(
                      "text-xs font-semibold mb-0.5 transition-colors",
                      isDragging && dragSource === 'assigned' ? "text-accent-1" : "text-text-info/40"
                    )}>
                      {isDragging && dragSource === 'assigned' ? 'Drop here to unassign' : 'No buyers available'}
                    </AppLabel>
                    <AppLabel as="span" variant="description" className="text-[10px] text-text-info/30">
                      {isDragging && dragSource === 'assigned' ? 'Release to remove this buyer' : 'All buyers are assigned'}
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
