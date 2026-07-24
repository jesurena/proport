'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Paperclip } from 'lucide-react';
import { AppBookmark, AppAttachmentCard, AppChip } from '@/components/ui';
import { AppAvatar, AppLabel } from '@integrated-computer-system/ui-kit';
import { modal } from '@/components/Providers/theme-provider';
import { STATUS_META } from '@/lib/types';
import { timeAgo, fullDate } from '@/components/utils/time';
import { getPreviewText, displayFileName, localizeHtmlImages } from '@/components/utils/ticket';
import { BrandTicketChip } from '@/components/tickets/BrandTicketChip';
import type { TicketStatus, Attachment } from '@/lib/types';
import { useAuthStore } from '@/modules/auth';
import { useAttachmentUrl } from '@/modules/tickets/hooks/useTickets';
import { UserProfilePopover } from '@/modules/profile';
import { useBookmarks, useAddBookmark, useRemoveBookmark } from '@/modules/tickets';

interface TicketHeaderProps {
  ticketId: string;
  subject: string;
  status: TicketStatus;
  businessUnitName: string;
  description: string;
  createdAt: string;
  requesterName: string;
  requesterAvatar?: string;
  attachments?: Attachment[];
  setPreviewFile: (file: any) => void;
  brandName?: string;
  brandType?: string;
  requesterId?: string | number;
}

export const TicketHeader: React.FC<TicketHeaderProps> = ({
  ticketId,
  subject,
  status,
  businessUnitName,
  description,
  createdAt,
  requesterName,
  requesterAvatar,
  attachments = [],
  setPreviewFile,
  brandName,
  brandType,
  requesterId,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { user } = useAuthStore();
  const getAttachmentUrl = useAttachmentUrl();

  const { data: userBookmarks = [] } = useBookmarks(!!user);
  const { mutate: addBookmark } = useAddBookmark();
  const { mutate: removeBookmark } = useRemoveBookmark();

  const numericTicketId = Number(ticketId);
  const isPinned = userBookmarks.some((b: any) => Number(b.ticket_id ?? b) === numericTicketId);

  const statusMeta = STATUS_META[status] || {
    label: typeof status === 'string' ? status : 'Unknown',
    color: '#8b8b8b',
    chipVariant: 'default'
  };

  const handleTogglePin = () => {
    if (!ticketId || ticketId === 'undefined') return;
    modal.confirm({
      title: isPinned ? 'Unpin request?' : 'Pin request?',
      content: isPinned ? 'This will remove the request from your pinned list.' : 'This will add the request to your pinned list.',
      okText: 'Confirm',
      cancelText: 'Cancel',
      centered: true,
      onOk() {
        if (isPinned) {
          removeBookmark(numericTicketId);
        } else {
          addBookmark(numericTicketId);
        }
      },
    });
  };

  const originalAttachments = attachments.filter((a) => !a.reply_id);
  const preview = getPreviewText(description);

  // Find first image attachment
  const firstImgAttachment = originalAttachments.find(a =>
    ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(a.file_type?.toLowerCase() || '') ||
    ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(a.name.split('.').pop()?.toLowerCase() || '')
  );

  // Parse first embedded image in HTML description
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const match = description.match(imgRegex);
  let firstEmbeddedImg = match ? match[1] : null;

  if (firstEmbeddedImg && firstEmbeddedImg.includes('proport.ics.com.ph/public/img/summernote_img/')) {
    firstEmbeddedImg = firstEmbeddedImg.replace('http://proport.ics.com.ph', 'http://localhost:3001');
  }

  const imageToShow = firstImgAttachment
    ? getAttachmentUrl(firstImgAttachment.name)
    : firstEmbeddedImg;

  return (
    <div className="rounded-t-xl border border-border/60 bg-card-bg shadow-sm">
      {/* Top Metadata Header */}
      <div className="p-5 border-b border-border/20">
        <div className="flex items-center text-left mb-3.5">
          <AppBookmark
            active={isPinned}
            onClick={handleTogglePin}
            size={20}
            className="mr-2"
            title={isPinned ? 'Remove Bookmark' : 'Bookmark Ticket'}
          />
          <h1 className="text-xl font-bold text-text leading-snug">
            {businessUnitName} {subject}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AppChip
            label={statusMeta.label}
            variant={status.toLowerCase() as any}
            color={statusMeta.color}
          />
          <BrandTicketChip
            brandName={brandName}
            brandType={brandType}
          />
        </div>
      </div>

      <div className="p-5 bg-neutral/5">
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-start justify-between gap-3 cursor-pointer select-none group"
        >
          <div className="flex items-start gap-3">
            <UserProfilePopover authorId={requesterId} authorName={requesterName} avatarSrc={requesterAvatar}>
              <div onClick={(e) => e.stopPropagation()} className="shrink-0 cursor-pointer">
                <AppAvatar
                  name={requesterName}
                  src={requesterAvatar ?? `https://api.dicebear.com/7.x/initials/svg?seed=${requesterName.split(' ').map((n) => n[0]).join('')}`}
                  size={36}
                />
              </div>
            </UserProfilePopover>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <UserProfilePopover authorId={requesterId} authorName={requesterName} avatarSrc={requesterAvatar}>
                  <AppLabel
                    as="span"
                    className="text-sm font-semibold text-text block hover:underline cursor-pointer"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    {requesterName}
                  </AppLabel>
                </UserProfilePopover>
                {originalAttachments.length > 0 && !firstImgAttachment && (
                  <Paperclip size={12} className="text-text-info/50" />
                )}
              </div>
              <AppLabel as="span" variant="description" className="text-[11px] text-text-info block mt-0.5">
                {fullDate(createdAt)}
              </AppLabel>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-1">
            <AppLabel as="span" variant="info" className="text-[11px] text-text-info font-medium">
              {timeAgo(createdAt)}
            </AppLabel>
            {isExpanded ? (
              <ChevronUp size={14} className="text-text-info/50" />
            ) : (
              <ChevronDown size={14} className="text-text-info/50" />
            )}
          </div>
        </div>

        <div className="pl-12 mt-2 text-sm text-text leading-[1.75]">
          {isExpanded ? (
            <>
              <div
                className="overflow-x-auto max-w-full my-2 text-text leading-[1.75] [&_table]:min-w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border/60 [&_th]:p-2 [&_th]:bg-neutral/10 [&_td]:border [&_td]:border-border/60 [&_td]:p-2"
                dangerouslySetInnerHTML={{ __html: localizeHtmlImages(description) }}
              />
              {originalAttachments.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/30">
                  <AppLabel as="span" variant="info" className="text-[11px] font-bold text-text-info/70 uppercase tracking-wide block mb-2">
                    Attachments:
                  </AppLabel>
                  <div className="flex flex-wrap gap-2">
                    {originalAttachments.map((file, idx) => (
                      <AppAttachmentCard
                        key={idx}
                        name={displayFileName(file.name)}
                        size={file.size}
                        variant="shared"
                        onClick={() => setPreviewFile(file.name)}
                        onDownload={() => {
                          window.open(getAttachmentUrl(file.name), '_blank');
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-4 cursor-pointer hover:bg-neutral/10 p-1 rounded-lg transition-colors"
            >
              <span className="flex-1 line-clamp-1 text-text-info text-sm">
                {preview || '—'}
                {preview.length > 80 && ' …'}
              </span>
              {imageToShow && (
                <img
                  src={imageToShow}
                  alt="preview thumbnail"
                  className="w-10 h-10 object-cover rounded-lg border border-border/40 shrink-0"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
