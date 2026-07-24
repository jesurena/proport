import React from 'react';

export interface UserProfile {
  id?: string | number;
  name: string;
  avatar?: string | null;
  group?: string | null;
  role?: string | null;
  email?: string | null;
  assignedTickets?: number;
  createdTickets?: number;
}

export interface UserTicketsStats {
  total: number;
  answered: number;
  pending: number;
  declined: number;
  user?: UserProfile | null;
}

export interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
  userId: string | number;
  userName: string;
  period?: 'today' | 'week' | 'all';
  initialTab?: 'activity' | 'tickets' | 'brands';
  onlyBrands?: boolean;
  isMe?: boolean;
}

export interface UserProfilePopoverProps {
  authorId?: string | number;
  authorName: string;
  avatarSrc?: string;
  children: React.ReactNode;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight' | 'top' | 'bottom';
  className?: string;
}
