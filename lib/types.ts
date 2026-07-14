// ─── Ticket Statuses ────────────────────────────────────────────────────────
export type TicketStatus =
  | 'unassigned'
  | 'assigned'
  | 'pending'
  | 'answered'
  | 'closed'
  | 'escalated'
  | 'reassigned';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

// ─── Core Entities ──────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'buyer' | 'sales' | 'super_user';
  department?: string;
}

export interface BusinessUnit {
  id: string;
  name: string;
  code: string;
}

export interface Reply {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string; // ISO string
}

export interface Ticket {
  id: string;
  ticketNumber: number;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  requesterId: string;
  requesterName: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  brandType?: string;
  requestType?: string;
  businessUnitId: string;
  businessUnitName: string;
  createdAt: string;   // ISO string
  updatedAt: string;   // ISO string
  closedAt?: string;   // ISO string
  replies: Reply[];
  tags?: string[];
  
  // Custom Price Inquiry Fields
  supplierName?: string;
  targetPrice?: number;
  estimatedQuantity?: number;
}

// ─── Stat Types ─────────────────────────────────────────────────────────────

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

// ─── Status metadata ────────────────────────────────────────────────────────

export const STATUS_META: Record<TicketStatus, { label: string; color: string; chipVariant: string }> = {
  unassigned: { label: 'Unassigned', color: '#8b8b8b', chipVariant: 'muted' },
  assigned:   { label: 'Assigned',   color: '#3b82f6', chipVariant: 'info' },
  pending:    { label: 'Pending',    color: '#f59e0b', chipVariant: 'warning' },
  answered:   { label: 'Answered',   color: '#10b981', chipVariant: 'success' },
  closed:     { label: 'Closed',     color: '#6b7280', chipVariant: 'default' },
  escalated:  { label: 'Escalated',  color: '#ef4444', chipVariant: 'danger' },
  reassigned: { label: 'Reassigned', color: '#8b5cf6', chipVariant: 'accent' },
};

export const PRIORITY_META: Record<TicketPriority, { label: string; color: string }> = {
  low:      { label: 'Low',      color: '#6b7280' },
  medium:   { label: 'Medium',   color: '#f59e0b' },
  high:     { label: 'High',     color: '#ef4444' },
  critical: { label: 'Critical', color: '#dc2626' },
};
