'use client';

import React, { useState } from 'react';
import { AppAvatar, AppLabel } from '@integrated-computer-system/ui-kit';
import { Reply } from '@/lib/types';
import { cn } from '@/components/utils/cn';

interface TicketThreadProps {
  replies: Reply[];
  ticketDescription: string;
  ticketCreatedAt: string;
  requesterName: string;
  requesterAvatar?: string;
}

/** Returns relative time like "25 mins ago", "2 hours ago", "3 days ago" */
function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;

  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

function fullDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function TicketThread({
  replies,
  ticketDescription,
  ticketCreatedAt,
  requesterName,
  requesterAvatar,
}: TicketThreadProps) {
  // All messages retracted (collapsed) by default
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Build a unified messages list: original + all replies
  const messages = [
    {
      id: 'original',
      authorName: requesterName,
      authorAvatar: requesterAvatar,
      content: ticketDescription,
      createdAt: ticketCreatedAt,
      isOriginal: true,
    },
    ...replies
      .filter((r) => !r.content.includes('Assignment Updated'))
      .map((r) => ({
        id: r.id,
        authorName: r.authorName,
        authorAvatar: r.authorAvatar,
        content: r.content,
        createdAt: r.createdAt,
        isOriginal: false,
      })),
  ];

  return (
    <div className="divide-y divide-border/30">
      {messages.map((msg) => {
        const isExpanded = !!expandedIds[msg.id];
        const avatarSrc = msg.authorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${msg.authorName}`;

        return (
          <div key={msg.id} className="py-4 first:pt-0 last:pb-2">
            {/* Header row */}
            <div
              onClick={() => toggleExpand(msg.id)}
              className="flex items-start justify-between gap-3 cursor-pointer select-none group"
            >
              <div className="flex items-start gap-3">
                <AppAvatar
                  name={msg.authorName}
                  src={avatarSrc}
                  size={36}
                />
                <div className="min-w-0">
                  <AppLabel as="span" className="text-sm font-semibold text-text block">
                    {msg.authorName}
                  </AppLabel>
                  <AppLabel as="span" variant="description" className="text-[11px] text-text-info block mt-0.5">
                    {fullDate(msg.createdAt)}
                  </AppLabel>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 pt-1">
                <AppLabel as="span" variant="info" className="text-[11px] text-text-info font-medium">
                  {timeAgo(msg.createdAt)}
                </AppLabel>
              </div>
            </div>

            {/* Message body - Toggle expand on click */}
            <div
              onClick={() => toggleExpand(msg.id)}
              className={cn(
                "pl-12 mt-2 text-sm text-text leading-[1.75] cursor-pointer hover:opacity-95 transition-opacity",
                isExpanded ? "whitespace-pre-wrap" : "line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap"
              )}
            >
              {/* If HTML template content, render raw text snippet if retracted */}
              {isExpanded ? (
                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
              ) : (
                <AppLabel as="span" className="text-sm text-text">
                  {msg.content.replace(/<[^>]*>/g, '') || '—'}
                </AppLabel>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
