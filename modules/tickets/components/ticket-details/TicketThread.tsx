'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Paperclip } from 'lucide-react';
import { AppAvatar, AppLabel } from '@integrated-computer-system/ui-kit';
import { AppAttachmentCard } from '@/components/ui';
import { timeAgo, fullDate } from '@/components/utils/time';
import { getPreviewText, displayFileName, localizeHtmlImages } from '@/components/utils/ticket';
import type { Reply, Attachment } from '@/lib/types';
import { useAttachmentUrl } from '@/modules/tickets/hooks/useTickets';
import { UserProfilePopover } from '@/components/tickets/UserProfilePopover';

interface TicketThreadProps {
  replies: Reply[];
  ticketDescription: string;
  ticketCreatedAt: string;
  requesterName: string;
  requesterAvatar?: string;
  attachments?: Attachment[];
  onAttachmentClick?: (fileName: string) => void;
}

export default function TicketThread({
  replies,
  ticketDescription,
  ticketCreatedAt,
  requesterName,
  requesterAvatar,
  attachments = [],
  onAttachmentClick,
}: TicketThreadProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const getAttachmentUrl = useAttachmentUrl();

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const messages = replies
    .filter((r) => !r.content.includes('Assignment Updated'))
    .map((r: any) => ({
      id: r.id,
      replyId: String(r.id),
      authorId: r.authorId ?? r.user_id,
      authorName: r.authorName,
      authorAvatar: r.authorAvatar,
      content: r.content,
      createdAt: r.createdAt,
      isOriginal: false,
    }))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <div className="divide-y divide-border/30">
      {messages.map((msg) => {
        const avatarSrc = msg.authorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${msg.authorName}`;
        const isExpanded = !!expandedIds[msg.id];
        const preview = getPreviewText(msg.content);

        // Find attachments linked to this reply
        const msgAttachments = msg.replyId
          ? attachments.filter((a) => String(a.reply_id) === msg.replyId)
          : [];

        // Find first image attachment
        const firstImgAttachment = msgAttachments.find(a =>
          ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(a.file_type?.toLowerCase() || '') ||
          ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(a.name.split('.').pop()?.toLowerCase() || '')
        );

        // Parse first embedded image in HTML content
        const imgRegex = /<img[^>]+src="([^">]+)"/i;
        const match = msg.content.match(imgRegex);
        let firstEmbeddedImg = match ? match[1] : null;

        if (firstEmbeddedImg && firstEmbeddedImg.includes('proport.ics.com.ph/public/img/summernote_img/')) {
          firstEmbeddedImg = firstEmbeddedImg.replace('http://proport.ics.com.ph', 'http://localhost:3001');
        }

        const imageToShow = firstImgAttachment 
          ? getAttachmentUrl(firstImgAttachment.name)
          : firstEmbeddedImg;

        return (
          <div key={msg.id} className="py-4 first:pt-0 last:pb-2">
            {/* Header row — clickable to expand/collapse */}
            <div
              onClick={() => toggleExpand(msg.id)}
              className="flex items-start justify-between gap-3 cursor-pointer select-none group"
            >
              <div className="flex items-start gap-3">
                <UserProfilePopover authorId={msg.authorId} authorName={msg.authorName} avatarSrc={avatarSrc}>
                  <div onClick={(e) => e.stopPropagation()} className="shrink-0 cursor-pointer">
                    <AppAvatar
                      name={msg.authorName}
                      src={avatarSrc}
                      size={36}
                    />
                  </div>
                </UserProfilePopover>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <UserProfilePopover authorId={msg.authorId} authorName={msg.authorName} avatarSrc={avatarSrc}>
                      <AppLabel
                        as="span"
                        className="text-sm font-semibold text-text block hover:underline cursor-pointer"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      >
                        {msg.authorName}
                      </AppLabel>
                    </UserProfilePopover>
                    {msgAttachments.length > 0 && !firstImgAttachment && (
                      <Paperclip size={12} className="text-text-info/50" />
                    )}
                  </div>
                  <AppLabel as="span" variant="description" className="text-[11px] text-text-info block mt-0.5">
                    {fullDate(msg.createdAt)}
                  </AppLabel>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 pt-1">
                <AppLabel as="span" variant="info" className="text-[11px] text-text-info font-medium">
                  {timeAgo(msg.createdAt)}
                </AppLabel>
                {isExpanded ? (
                  <ChevronUp size={14} className="text-text-info/50" />
                ) : (
                  <ChevronDown size={14} className="text-text-info/50" />
                )}
              </div>
            </div>

            {/* Body — collapsed: single line preview with "…", expanded: full HTML */}
            <div className="pl-12 mt-2 text-sm text-text leading-[1.75]">
              {isExpanded ? (
                <>
                  <div
                    className="overflow-x-auto max-w-full my-2 text-text leading-[1.75] [&_table]:min-w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border/60 [&_th]:p-2 [&_th]:bg-neutral/10 [&_td]:border [&_td]:border-border/60 [&_td]:p-2"
                    dangerouslySetInnerHTML={{ __html: localizeHtmlImages(msg.content) }}
                  />

                  {/* Attachments section */}
                  {msgAttachments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <AppLabel as="span" variant="info" className="text-[11px] font-bold text-text-info/70 uppercase tracking-wide block mb-2">
                        Attachments:
                      </AppLabel>
                      <div className="flex flex-wrap gap-2">
                        {msgAttachments.map((file, idx) => (
                          <AppAttachmentCard
                            key={idx}
                            name={displayFileName(file.name)}
                            size={file.size}
                            variant="shared"
                            onClick={() => onAttachmentClick?.(file.name)}
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
                  onClick={() => toggleExpand(msg.id)}
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
        );
      })}
    </div>
  );
}
