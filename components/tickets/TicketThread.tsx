'use client';

import React, { useState } from 'react';
import { AppAvatar } from '@integrated-computer-system/ui-kit';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Reply } from '@/lib/types';

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
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (replies.length > 0) {
      initial[replies[replies.length - 1].id] = true;
    } else {
      initial['original'] = true;
    }
    return initial;
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getSnippet = (text: string) => {
    const cleanText = text.replace(/\s+/g, ' ').trim();
    return cleanText.length > 100 ? `${cleanText.substring(0, 100)}…` : cleanText;
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
    ...replies.map((r) => ({
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

        if (isExpanded) {
          // ─── Expanded message ───
          return (
            <div key={msg.id} className="py-4 first:pt-0 last:pb-0">
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
                    <span className="text-sm font-semibold text-text">{msg.authorName}</span>
                    <span className="text-[11px] text-text-info block mt-0.5">
                      {fullDate(msg.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <span className="text-[11px] text-text-info font-medium">{timeAgo(msg.createdAt)}</span>
                  <ChevronUp size={14} className="text-text-info opacity-0 group-hover:opacity-70 transition-opacity" />
                </div>
              </div>

              {/* Message body */}
              <div className="pl-12 mt-3 text-sm text-text whitespace-pre-wrap leading-[1.75]">
                {msg.content}
              </div>
            </div>
          );
        }

        // ─── Collapsed message ───
        return (
          <div
            key={msg.id}
            onClick={() => toggleExpand(msg.id)}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 cursor-pointer select-none hover:bg-neutral/10 -mx-2 px-2 rounded-lg transition-colors"
          >
            <AppAvatar
              name={msg.authorName}
              src={avatarSrc}
              size={28}
            />
            <span className="w-28 shrink-0 font-medium text-xs text-text truncate">
              {msg.authorName}
            </span>
            <span className="flex-1 text-xs text-text-info truncate">
              {getSnippet(msg.content)}
            </span>
            <span className="text-[11px] text-text-info font-medium shrink-0 whitespace-nowrap">
              {timeAgo(msg.createdAt)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
