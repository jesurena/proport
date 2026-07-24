'use client';

import React, { useState } from 'react';
import { Popover } from 'antd';
import {
  Folder,
  User,
  Mail,
  Ticket,
  MoreHorizontal,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { AppAvatar } from '@integrated-computer-system/ui-kit';
import { AppButton, AppLabel } from '@/components/ui';
import { useUserProfile } from '@/modules/profile';
import { useAuthStore } from '@/modules/auth';
import UserProfileModal from './UserProfileModal';
import { UserProfileCardSkeleton } from '@/components/skeleton';
import { cn } from '@/components/utils/cn';
import { useCopyToClipboard } from '@/components/utils/clipboard';
import { UserProfilePopoverProps } from '../types';

export function UserProfileCard({
  authorId,
  name,
  avatar,
  isOpen,
  onClose,
  onViewTickets,
}: {
  authorId?: string | number;
  name: string;
  avatar?: string;
  isOpen: boolean;
  onClose?: () => void;
  onViewTickets?: () => void;
}) {
  const { data: profile, isLoading } = useUserProfile(authorId, isOpen);
  const { user, is_head, is_adel } = useAuthStore();
  const { copied, copy } = useCopyToClipboard();

  const isMe = !!(user?.account_id && authorId && String(user.account_id) === String(authorId));
  const currentRole = user?.role_name;
  const isBuyer = currentRole === 'buyer';
  const isBUHeadForUser = is_head && profile?.group && user?.AccountGroup && profile.group === user.AccountGroup;
  const adelGroups = ['BU1', 'BU2', 'BU5', 'BU8', 'BU10', 'BU12', 'CE01'];
  const isUnderAdel = is_adel && profile?.group && adelGroups.includes(profile.group);
  const isAdmin = ['admin', 'super_user'].includes(currentRole || '');

  const showViewTickets = isMe || isBuyer || isBUHeadForUser || isUnderAdel || isAdmin;

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
      ) : (         <div className="space-y-4">
          <div className="flex items-start gap-3.5 pt-1">
            <div className="relative shrink-0">
              <AppAvatar
                name={profile?.name || name}
                src={profile?.avatar || avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`}
                size={92}
                className="rounded-full"
              />
            </div>

            {/* User Details */}
            <div className="flex-1 min-w-0 pr-5">
              {/* Name */}
              <div className="flex items-center gap-1.5 mb-2">
                <AppLabel as="h3" variant="title" className="text-base font-bold text-foreground truncate leading-tight">
                  {profile?.name || name}
                </AppLabel>
              </div>

              {/* Info items */}
              <div className="space-y-1.5 text-xs text-text-info/80">
                <div className="flex items-center gap-2">
                  <Folder size={14} className="text-text-info/50 shrink-0" />
                  <AppLabel as="span" className="truncate text-xs font-medium text-foreground">
                    {profile?.group || 'ESD'}
                  </AppLabel>
                </div>

                <div className="flex items-center gap-2">
                  <User size={14} className="text-text-info/50 shrink-0" />
                  <AppLabel as="span" className="truncate text-xs text-foreground font-medium capitalize">
                    {profile?.role === 'sales'
                      ? 'Sales / Requestor'
                      : (profile?.role === 'buyer'
                        ? 'Buyer Assignee'
                        : (profile?.role?.replace(/_/g, ' ') || 'Buyer Assignee'))}
                  </AppLabel>
                </div>

                {(profile?.email || `${name.toLowerCase().replace(/\s+/g, '.')}@proport.com`) && (
                  <div 
                    className="flex items-center gap-2 cursor-pointer group/email relative"
                    onClick={() => copy(profile?.email || `${name.toLowerCase().replace(/\s+/g, '.')}@proport.com`)}
                  >
                    <Mail size={14} className="text-text-info/50 group-hover/email:text-accent-1 transition-colors shrink-0" />
                    <AppLabel as="span" className="truncate text-xs text-accent-1 font-medium group-hover/email:underline">
                      {profile?.email || `${name.toLowerCase().replace(/\s+/g, '.')}@proport.com`}
                    </AppLabel>
                    {copied ? (
                      <Check size={12} className="text-emerald-500 shrink-0" />
                    ) : (
                      <Copy size={12} className="text-text-info/40 group-hover/email:text-accent-1 transition-colors shrink-0" />
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-0.5">
                  <div className="w-3.5 h-3.5 rounded bg-neutral/20 flex items-center justify-center shrink-0">
                    <Ticket size={10} className="text-text-info" />
                  </div>
                  <AppLabel as="span" className="text-xs font-semibold text-foreground">
                    {(() => {
                      const assignedCount = profile?.assignedTickets ?? 0;
                      const createdCount = profile?.createdTickets ?? 0;
                      const isSalesRole = profile?.role === 'sales';
                      if (isSalesRole || (createdCount > 0 && assignedCount === 0)) {
                        return `${createdCount} Ticket${createdCount !== 1 ? 's' : ''} Created`;
                      } else if (createdCount > 0 && assignedCount > 0) {
                        return `${assignedCount} Assigned · ${createdCount} Created`;
                      }
                      return `${assignedCount} Ticket${assignedCount !== 1 ? 's' : ''} Assigned`;
                    })()}
                  </AppLabel>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons bar */}
          <div className="flex items-center gap-1 pt-1">
            {showViewTickets && (
              <AppButton
                variant="neutral"
                className="flex-1"
                leftIcon={<Ticket size={14} />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onViewTickets?.();
                  onClose?.();
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
              >
                {isMe ? 'View My Ticket' : 'View Tickets'}
              </AppButton>
            )}
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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
              onViewTickets={() => setIsModalOpen(true)}
            />
          </div>
        }
        trigger="hover"
        placement={placement}
        mouseEnterDelay={0.3}
        mouseLeaveDelay={0.2}
        arrow={false}
        styles={{ container: { padding: 0, borderRadius: '16px', backgroundColor: 'transparent', boxShadow: 'none' } }}
        overlayClassName={cn("user-profile-popover", className)}
      >
        {children}
      </Popover>

      {isModalOpen && authorId && (
        <UserProfileModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={authorId}
          userName={authorName}
        />
      )}
    </>
  );
}
