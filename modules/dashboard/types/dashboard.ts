import type { TicketStatus } from '@/modules/tickets';

export interface StatusCount {
  status: TicketStatus;
  count: number;
}

export interface BusinessUnitCount {
  businessUnit: string;
  count: number;
}

export interface MonthlyTrend {
  month: string;    // e.g. "Jan", "Feb"
  year: number;
  count: number;
}

export interface ActivityItem {
  id: string;
  ticketId: string;
  ticketNumber: string;
  subject: string;
  type: 'reply' | 'status' | 'assignment';
  actorName: string;
  actorAvatar?: string;
  actionText: string;
  detail?: string;
  timestamp: string;
  statusBadge?: string;
}
