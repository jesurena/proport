'use client';

import React, { useState } from 'react';
import { Popover } from 'antd';
import {
  Folder,
  User,
  Globe,
  Ticket,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { AppAvatar } from '@integrated-computer-system/ui-kit';
import { AppButton, AppLabel } from '@/components/ui';
import { useUserProfile } from '@/modules/tickets/hooks/useTickets';
import { UserProfileCardSkeleton } from '@/components/skeleton/tickets';
import { cn } from '@/components/utils/cn';

export interface UserProfilePopoverProps {
  authorId?: string | number;
  authorName: string;
  avatarSrc?: string;
  children: React.ReactNode;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight' | 'top' | 'bottom';
  className?: string;
}

export function UserProfileCard({
  authorId,
  name,
  avatar,
  isOpen,
  onClose,
}: {
  authorId?: string | number;
  name: string;
  avatar?: string;
  isOpen: boolean;
  onClose?: () => void;
}) {
  const { data: profile, isLoading } = useUserProfile(authorId, isOpen);

  const displayName = profile?.name || name;
  const displayAvatar = profile?.avatar || avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;
  const group = profile?.group || 'ESD';
  const role = profile?.role || (profile?.isSales ? 'Sales / Requestor' : 'Buyer Assignee');
  const email = profile?.email || `${name.toLowerCase().replace(/\s+/g, '.')}@proport.com`;

  const assignedCount = profile?.assignedTickets ?? 0;
  const createdCount = profile?.createdTickets ?? 0;

  let ticketLabel = `${assignedCount} Ticket${assignedCount !== 1 ? 's' : ''} Assigned`;
  if (profile?.isSales || (createdCount > 0 && assignedCount === 0)) {
    ticketLabel = `${createdCount} Ticket${createdCount !== 1 ? 's' : ''} Created`;
  } else if (createdCount > 0 && assignedCount > 0) {
    ticketLabel = `${assignedCount} Assigned · ${createdCount} Created`;
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="w-[400px] p-4 bg-card-bg border border-border/60 text-foreground rounded-2xl shadow-xl select-none relative font-sans"
    >
      {/* Top Close Button */}
      {onClose && (
        <AppButton
          variant="neutral"
          size="icon"
          onClick={onClose}
          className="!w-7 !h-7 !rounded-full absolute top-3 right-3 text-text-info hover:text-foreground shrink-0"
        >
          <X size={14} />
        </AppButton>
      )}

      {isLoading ? (
        <UserProfileCardSkeleton />
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-3.5 pt-1">
            <div className="relative shrink-0">
              <AppAvatar
                name={displayName}
                src={displayAvatar}
                size={92}
                className="rounded-full"
              />
            </div>

            {/* User Details */}
            <div className="flex-1 min-w-0 pr-5">
              {/* Name */}
              <div className="flex items-center gap-1.5 mb-2">
                <AppLabel as="h3" variant="title" className="text-base font-bold text-foreground truncate leading-tight">
                  {displayName}
                </AppLabel>
              </div>

              {/* Info items */}
              <div className="space-y-1.5 text-xs text-text-info/80">
                <div className="flex items-center gap-2">
                  <Folder size={14} className="text-text-info/50 shrink-0" />
                  <AppLabel as="span" className="truncate text-xs font-medium text-foreground">
                    {group}
                  </AppLabel>
                </div>

                <div className="flex items-center gap-2">
                  <User size={14} className="text-text-info/50 shrink-0" />
                  <AppLabel as="span" className="truncate text-xs text-foreground font-medium">
                    {role}
                  </AppLabel>
                </div>

                {email && (
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-text-info/50 shrink-0" />
                    <AppLabel as="span" className="truncate text-xs text-accent-1 font-medium hover:underline cursor-pointer">
                      {email}
                    </AppLabel>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-0.5">
                  <div className="w-3.5 h-3.5 rounded bg-neutral/20 flex items-center justify-center shrink-0">
                    <Ticket size={10} className="text-text-info" />
                  </div>
                  <AppLabel as="span" className="text-xs font-semibold text-foreground">
                    {ticketLabel}
                  </AppLabel>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons bar */}
          <div className="flex items-center gap-1 pt-1">
            <AppButton
              variant="neutral"
              className="flex-1"
              leftIcon={<Ticket size={14} />}
            >
              View Tickets
            </AppButton>

            <AppButton
              variant="neutral"
              size="icon"
            >
              <MoreHorizontal size={16} />
            </AppButton>
          </div>
        </div>
      )}
    </div>
  );
}

export function UserProfilePopover({
  authorId,
  authorName,
  avatarSrc,
  children,
  placement = 'bottomLeft',
  className,
}: UserProfilePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      content={
        <div className="py-2">
          <UserProfileCard
            authorId={authorId}
            name={authorName}
            avatar={avatarSrc}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        </div>
      }
      trigger="hover"
      placement={placement}
      mouseEnterDelay={0.3}
      mouseLeaveDelay={0.2}
      arrow={false}
      overlayInnerStyle={{ padding: 0, borderRadius: '16px', backgroundColor: 'transparent', boxShadow: 'none' }}
      overlayClassName={cn("user-profile-popover", className)}
    >
      {children}
    </Popover>
  );
}
