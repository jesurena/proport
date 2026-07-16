'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AppNavbar } from '@integrated-computer-system/ui-kit';
import { Bell, Search, Menu, X } from 'lucide-react';
import { NotificationDropdown, type Notification } from './NotificationDropdown';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'urgent',
    title: 'Urgent: Target price match required',
    body: 'Ticket #0003 — Lenovo ThinkPad volume request has been escalated.',
    time: '2m ago',
    read: false,
    ticketId: 'ticket-3',
  },
  {
    id: '2',
    type: 'reply',
    title: 'New reply from Buyer',
    body: 'Ticket #0004 — Rico Mendoza (Buyer) updated Palo Alto pricing details.',
    time: '14m ago',
    read: false,
    ticketId: 'ticket-4',
  },
  {
    id: '3',
    type: 'new',
    title: 'Ticket assigned to you',
    body: 'Ticket #0001 — O365 Business Premium licenses has been assigned to your queue.',
    time: '1h ago',
    read: false,
    ticketId: 'ticket-1',
  },
  {
    id: '4',
    type: 'update',
    title: 'Status updated',
    body: 'Ticket #0005 — SLA upgrade pricing is now Pending supplier approval.',
    time: '3h ago',
    read: true,
    ticketId: 'ticket-5',
  },
  {
    id: '5',
    type: 'resolved',
    title: 'Ticket closed',
    body: 'Ticket #0009 — Dell Latitude quote matched and accepted by sales.',
    time: 'Yesterday',
    read: true,
    ticketId: 'ticket-9',
  },
];


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

          <NotificationDropdown
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
            notifications={notifications}
            setNotifications={setNotifications}
          />
        </div>
      </AppNavbar.Right>
    </AppNavbar>
  );
}
