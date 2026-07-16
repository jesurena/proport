'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, Ticket, Clock, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { AppLabel } from '@integrated-computer-system/ui-kit';

export interface Notification {
  id: string;
  type: 'new' | 'update' | 'resolved' | 'urgent' | 'reply';
  title: string;
  body: string;
  time: string;
  read: boolean;
  ticketId?: string;
}

interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const notifIcon = (type: Notification['type']) => {
  switch (type) {
    case 'urgent': return <AlertCircle size={14} className="text-red-500" />;
    case 'reply': return <MessageSquare size={14} className="text-blue-500" />;
    case 'new': return <Ticket size={14} className="text-indigo-500" />;
    case 'update': return <Clock size={14} className="text-amber-500" />;
    case 'resolved': return <CheckCircle2 size={14} className="text-emerald-500" />;
  }
};

const notifBg = (type: Notification['type']) => {
  switch (type) {
    case 'urgent': return 'bg-red-500/10';
    case 'reply': return 'bg-blue-500/10';
    case 'new': return 'bg-indigo-500/10';
    case 'update': return 'bg-amber-500/10';
    case 'resolved': return 'bg-emerald-500/10';
  }
};

export function NotificationDropdown({
  open,
  onClose,
  notifications,
  setNotifications,
}: NotificationDropdownProps) {
  const router = useRouter();
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!open) return null;

  const handleNotificationClick = (n: Notification) => {
    // Mark notification as read
    setNotifications((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, read: true } : x))
    );
    // Close dropdown
    onClose();
    // Navigate to ticket if link exists
    if (n.ticketId) {
      router.push(`/tickets/${n.ticketId}`);
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-[340px] bg-card-bg border border-border rounded-2xl shadow-xl z-[200] overflow-hidden">
      {/* Header - Styled with darker sidebar background */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-[var(--sidebar-bg)] select-none">
        <div className="flex items-center gap-2">
          <AppLabel as="span" className="text-sm font-bold text-text">
            Notifications
          </AppLabel>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500">
              {unreadCount} new
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-hover/60 text-text-info hover:text-text transition-colors cursor-pointer"
        >
          <X size={13} />
        </button>
      </div>

      {/* Notification list */}
      <div className="max-h-[360px] overflow-y-auto divide-y divide-border/40 bg-card-bg">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors ${
                n.read ? 'hover:bg-hover/60' : 'bg-accent-1/[0.04] hover:bg-hover/60'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${notifBg(n.type)}`}>
                {notifIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-xs font-semibold leading-snug ${n.read ? 'text-text-info' : 'text-text'}`}>
                    {n.title}
                  </p>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-accent-1 shrink-0 mt-1" />}
                </div>
                <p className="text-[11px] text-text-info mt-0.5 leading-snug line-clamp-2">{n.body}</p>
                <p className="text-[10px] text-text-info/60 mt-1 font-medium">{n.time}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-text-info italic">
            No notifications found
          </div>
        )}
      </div>
    </div>
  );
}
