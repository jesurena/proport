'use client';

import React, { useState, useEffect } from 'react';
import { MoveLeft, MoveRight } from 'lucide-react';
import { AppButton, AppLabel, AppModal } from '@/components/ui';
import { AppAvatarCard } from '@/components/tickets/AppAvatarCard';
import { getUsers } from '@/lib/tickets';
import type { User } from '@/lib/types';
import { cn } from '@/components/utils/cn';

interface BrandAssigneeModalProps {
  open: boolean;
  onClose: () => void;
  selectedUsers: User[];
  onSelect: (users: User[]) => void;
  availableBuyers?: User[];
}

export function BrandAssigneeModal({
  open,
  onClose,
  selectedUsers,
  onSelect,
  availableBuyers,
}: BrandAssigneeModalProps) {
  const [assignedList, setAssignedList] = useState<User[]>([]);
  const [availableList, setAvailableList] = useState<User[]>([]);
  const [isDragOverAssigned, setIsDragOverAssigned] = useState(false);
  const [isDragOverAvailable, setIsDragOverAvailable] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragSource, setDragSource] = useState<'available' | 'assigned' | null>(null);

  useEffect(() => {
    if (open) {
      const buyerPool = availableBuyers && availableBuyers.length > 0
        ? availableBuyers
        : getUsers().filter((u) => u.role === 'buyer' || !u.role);

      // Filter out users that are already assigned
      const assignedIds = selectedUsers.map((u) => String(u.id));
      const available = buyerPool.filter((u) => !assignedIds.includes(String(u.id)));

      setAssignedList(selectedUsers);
      setAvailableList(available);
      setIsDragOverAssigned(false);
      setIsDragOverAvailable(false);
      setIsDragging(false);
      setDragSource(null);
    }
  }, [open, selectedUsers, availableBuyers]);

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
      const user = availableList.find((u) => String(u.id) === userId);
      if (user) {
        setAssignedList((prev) => [...prev, user]);
        setAvailableList((prev) => prev.filter((u) => String(u.id) !== userId));
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
      const user = assignedList.find((u) => String(u.id) === userId);
      if (user) {
        setAvailableList((prev) => [...prev, user]);
        setAssignedList((prev) => prev.filter((u) => String(u.id) !== userId));
      }
    }
  };

  const handleSave = () => {
    onSelect(assignedList);
    onClose();
  };

  return (
    <AppModal open={open} onClose={onClose} width={700} centered>
      <AppModal.Body className="space-y-6">
        <div>
          <AppModal.Title>Assign Default Buyers</AppModal.Title>
          <AppModal.Description>
            Drag and drop buyers between the columns to configure default assignees for this brand.
          </AppModal.Description>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_40px_1fr] gap-4 items-stretch">
          {/* Assigned Buyers column */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <AppLabel className="text-[13px] font-bold text-text-info text-left">
                Assigned Buyer(s)
              </AppLabel>
              <span className="text-[10px] font-semibold text-text-info/40">
                {assignedList.length} assigned
              </span>
            </div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOverAssigned(true);
              }}
              onDragLeave={() => setIsDragOverAssigned(false)}
              onDrop={handleDropToAssigned}
              className={cn(
                "border-2 rounded-xl p-3 h-[240px] overflow-y-auto flex flex-col gap-1.5 transition-all duration-200 select-none",
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
                    onDragStart={(e) => handleDragStart(e, String(buyer.id), 'assigned')}
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
                  <AppLabel className={cn(
                    "text-xs font-semibold mb-0.5 transition-colors",
                    isDragging && dragSource === 'available' ? "text-accent-1" : "text-text-info/40"
                  )}>
                    {isDragging && dragSource === 'available' ? 'Drop here to assign' : 'No assignees'}
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

          {/* Available Buyers column */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <AppLabel className="text-[13px] font-bold text-text-info text-left">
                Available Buyers
              </AppLabel>
              <span className="text-[10px] font-semibold text-text-info/40">
                {availableList.length} available
              </span>
            </div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOverAvailable(true);
              }}
              onDragLeave={() => setIsDragOverAvailable(false)}
              onDrop={handleDropToAvailable}
              className={cn(
                "border-2 rounded-xl p-3 h-[240px] overflow-y-auto flex flex-col gap-1.5 transition-all duration-200 select-none",
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
                    onDragStart={(e) => handleDragStart(e, String(buyer.id), 'available')}
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
                  <AppLabel className={cn(
                    "text-xs font-semibold mb-0.5 transition-colors",
                    isDragging && dragSource === 'assigned' ? "text-accent-1" : "text-text-info/40"
                  )}>
                    {isDragging && dragSource === 'assigned' ? 'Drop here to remove' : 'No buyers available'}
                  </AppLabel>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2">
          <AppButton variant="neutral" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton variant="primary" onClick={handleSave}>
            Confirm Assignment
          </AppButton>
        </div>
      </AppModal.Body>
    </AppModal>
  );
}
