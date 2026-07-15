'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AppNavbar } from '@integrated-computer-system/ui-kit';
import { Bell, Search, Menu, X, Ticket, Clock, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

interface Notification {
  id: string;
  type: 'new' | 'update' | 'resolved' | 'urgent' | 'reply';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'urgent',
    title: 'Urgent: Target price match required',
    body: 'Inquiry #0003 — Lenovo ThinkPad volume request has been escalated.',
    time: '2m ago',
    read: false,
  },
  {
    id: '2',
    type: 'reply',
    title: 'New reply from Buyer',
    body: 'Inquiry #0004 — Rico Mendoza (Buyer) updated Palo Alto pricing details.',
    time: '14m ago',
    read: false,
  },
  {
    id: '3',
    type: 'new',
    title: 'Inquiry assigned to you',
    body: 'Inquiry #0001 — O365 Business Premium licenses has been assigned to your queue.',
    time: '1h ago',
    read: false,
  },
  {
    id: '4',
    type: 'update',
    title: 'Status updated',
    body: 'Inquiry #0005 — SLA upgrade pricing is now Pending supplier approval.',
    time: '3h ago',
    read: true,
  },
  {
    id: '5',
    type: 'resolved',
    title: 'Inquiry closed',
    body: 'Inquiry #0009 — Dell Latitude quote matched and accepted by sales.',
    time: 'Yesterday',
    read: true,
  },
];

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

interface ProportNavbarProps {
  title?: string;
  children?: React.ReactNode;
}

export default function ProportNavbar({ title, children }: ProportNavbarProps) {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const breadcrumbs = useMemo(() => {
    if (pathname === '/') {
      return [{ label: 'Dashboard', href: '/' }];
    }
    const items = [{ label: 'Home', href: '/' }];
    if (pathname.startsWith('/tickets')) {
      items.push({ label: 'Tickets', href: '/tickets' });
      const parts = pathname.split('/');
      if (parts.length > 2 && parts[2]) {
        const cleanPart = parts[2].substring(0, 8);
        items.push({ label: cleanPart.match(/^[0-9a-fA-F-]+$/) ? `Ticket Details` : `Ticket #${cleanPart}`, href: pathname });
      }
    } else if (pathname === '/compose') {
      items.push({ label: 'Compose Ticket', href: '/compose' });
    } else if (pathname === '/reports') {
      items.push({ label: 'Reports', href: '/reports' });
    } else if (pathname === '/brands') {
      items.push({ label: 'Brand Maintenance', href: '/brands' });
    } else if (pathname === '/suppliers') {
      items.push({ label: 'Supplier Settings', href: '/suppliers' });
    } else if (pathname === '/logs') {
      items.push({ label: 'User Logs', href: '/logs' });
    }
    return items;
  }, [pathname]);

  return (
    <AppNavbar sticky className="!border-b !border-border !bg-card-bg/80 !backdrop-blur-md">
      <AppNavbar.Left>
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('tcd-toggle-sidebar'));
          }}
          className="lg:hidden p-2 rounded-lg text-text-info hover:text-text hover:bg-hover-bg transition-colors mr-1 shrink-0 cursor-pointer"
          title="Open Menu"
        >
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-1.5 text-[13px] ml-2 select-none font-medium">
          {breadcrumbs.map((item, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={item.href + idx}>
                {idx > 0 && <span className="text-text-info/30 text-[12px] font-bold">/</span>}
                {isLast ? (
                  <span className="font-semibold text-text">{item.label}</span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-text-info hover:text-text transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </AppNavbar.Left>

      <AppNavbar.Right className="!gap-1">
        {children}

        {/* Search button */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('tcd-open-search'))}
          className="p-2 rounded-lg text-text-info hover:text-text hover:bg-hover/60 transition-colors cursor-pointer"
          title="Search"
        >
          <Search size={17} />
        </button>

        {/* Notification bell with dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative p-2 rounded-lg text-text-info hover:text-text hover:bg-hover/60 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-extrabold text-white ring-2 ring-card-bg leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-[340px] bg-card-bg border border-border rounded-2xl shadow-xl z-[200] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border ">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-text">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] font-semibold text-accent-1 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="p-1 rounded-lg hover:bg-hover/60 text-text-info hover:text-text transition-colors cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Notification list */}
              <div className="max-h-[360px] overflow-y-auto divide-y divide-border/40">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                    className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors ${n.read ? 'hover:bg-hover/30' : 'bg-accent-1/[0.03] hover:bg-accent-1/[0.06]'}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${notifBg(n.type)}`}>
                      {notifIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
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
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-border text-center">
                <button className="text-[11px] font-semibold text-accent-1 hover:underline cursor-pointer">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
      </AppNavbar.Right>
    </AppNavbar>
  );
}
