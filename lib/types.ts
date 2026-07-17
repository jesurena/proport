// ─── Ticket Statuses ────────────────────────────────────────────────────────
export type TicketStatus =
  | 'unassigned'
  | 'assigned'
  | 'pending'
  | 'answered'
  | 'closed'
  | 'escalated'
  | 'reassigned'
  | 'bu-approval'
  | 'bu-declined'
  | 'final-approval'
  | 'adel-declined'
  | 'for approval of bu head'
  | 'for-approval-of-bu-head'
  | 'declined by bu head'
  | 'declined-by-bu-head'
  | 'for final approval'
  | 'for-final-approval'
  | 'declined by final approver'
  | 'declined-by-final-approver';

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

export interface Attachment {
  ticket_id: string;
  reply_id?: string;
  name: string;
  creation_time: string;
  file_type: string;
  size?: number;
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
  aoId?: string;
  aoName?: string;
  cc?: string[];
  createdAt: string;   // ISO string
  updatedAt: string;   // ISO string
  closedAt?: string;   // ISO string
  replies: Reply[];
  tags?: string[];
  attachments?: Attachment[];
  
  // Custom Price Inquiry Fields
  supplierName?: string;
  targetPrice?: number;
  estimatedQuantity?: number;
  customerName?: string;
  projectName?: string;
  brandName?: string;
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
  unassigned: { label: 'Unassigned', color: '#8b8b8b', chipVariant: 'unassigned' },
  assigned:   { label: 'Assigned',   color: '#3b82f6', chipVariant: 'assigned' },
  pending:    { label: 'Pending',    color: '#f59e0b', chipVariant: 'pending' },
  answered:   { label: 'Answered',   color: '#10b981', chipVariant: 'answered' },
  closed:     { label: 'Closed',     color: '#6b7280', chipVariant: 'closed' },
  escalated:  { label: 'Escalated',  color: '#ef4444', chipVariant: 'escalated' },
  reassigned: { label: 'Reassigned', color: '#8b5cf6', chipVariant: 'reassigned' },
  'bu-approval': { label: 'BU Approval', color: '#ec4899', chipVariant: 'bu-approval' },
  'bu-declined': { label: 'BU Declined', color: '#ef4444', chipVariant: 'bu-declined' },
  'final-approval': { label: 'Final Approval', color: '#10b981', chipVariant: 'final-approval' },
  'adel-declined': { label: 'Declined by Adel', color: '#ef4444', chipVariant: 'adel-declined' },
  'for approval of bu head': { label: 'For Approval of BU Head', color: '#ec4899', chipVariant: 'for-approval-of-bu-head' },
  'for-approval-of-bu-head': { label: 'For Approval of BU Head', color: '#ec4899', chipVariant: 'for-approval-of-bu-head' },
  'declined by bu head': { label: 'Declined by BU Head', color: '#ef4444', chipVariant: 'bu-declined' },
  'declined-by-bu-head': { label: 'Declined by BU Head', color: '#ef4444', chipVariant: 'bu-declined' },
  'for final approval': { label: 'For Final Approval', color: '#10b981', chipVariant: 'final-approval' },
  'for-final-approval': { label: 'For Final Approval', color: '#10b981', chipVariant: 'final-approval' },
  'declined by final approver': { label: 'Declined by Final Approver', color: '#ef4444', chipVariant: 'adel-declined' },
  'declined-by-final-approver': { label: 'Declined by Final Approver', color: '#ef4444', chipVariant: 'adel-declined' },
};

export const PRIORITY_META: Record<TicketPriority, { label: string; color: string }> = {
  low:      { label: 'Low',      color: '#6b7280' },
  medium:   { label: 'Medium',   color: '#f59e0b' },
  high:     { label: 'High',     color: '#ef4444' },
  critical: { label: 'Critical', color: '#dc2626' },
};
