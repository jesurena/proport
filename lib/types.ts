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
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'admin' | 'buyer' | 'requestor' | 'super_user';
  account_group?: string;
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
  assignees?: { id: string; name: string; avatar?: string; email?: string }[];
  brandType?: string;
  requestType?: string;
  businessUnitId: string;
  businessUnitName: string;
  aoId?: string;
  aoName?: string;
  ccUsers?: { id: string; name: string; email: string; avatar?: string }[];
  createdAt: string;   // ISO string
  updatedAt: string;   // ISO string
  closedAt?: string;   // ISO string
  replies: Reply[];
  tags?: string[];
  attachments?: Attachment[];
  
  supplierName?: string;
  targetPrice?: number;
  estimatedQuantity?: number;
  customerName?: string;
  projectName?: string;
  brandName?: string;
  GAvatarReq?: string;
  requesterAvatar?: string;
  AccountGroup?: string;
}

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


export const STATUS_META: Record<TicketStatus, { label: string; color: string; chipVariant: string }> = {
  unassigned: { label: 'Unassigned', color: '#71717a', chipVariant: 'unassigned' },
  assigned:   { label: 'Assigned',   color: '#059669', chipVariant: 'assigned' },
  pending:    { label: 'Pending',    color: '#f59e0b', chipVariant: 'pending' },
  answered:   { label: 'Answered',   color: '#0d9488', chipVariant: 'answered' },
  closed:     { label: 'Closed',     color: '#059669', chipVariant: 'closed' },
  escalated:  { label: 'Escalated',  color: '#dc2626', chipVariant: 'escalated' },
  reassigned: { label: 'Reassigned', color: '#4f46e5', chipVariant: 'reassigned' },
  'bu-approval': { label: 'BU Approval', color: '#db2777', chipVariant: 'bu-approval' },
  'bu-declined': { label: 'BU Declined', color: '#dc2626', chipVariant: 'bu-declined' },
  'final-approval': { label: 'Final Approval', color: '#059669', chipVariant: 'final-approval' },
  'adel-declined': { label: 'Declined by Adel', color: '#dc2626', chipVariant: 'adel-declined' },
  'for approval of bu head': { label: 'For Approval of BU Head', color: '#db2777', chipVariant: 'for-approval-of-bu-head' },
  'for-approval-of-bu-head': { label: 'For Approval of BU Head', color: '#db2777', chipVariant: 'for-approval-of-bu-head' },
  'declined by bu head': { label: 'Declined by BU Head', color: '#dc2626', chipVariant: 'bu-declined' },
  'declined-by-bu-head': { label: 'Declined by BU Head', color: '#dc2626', chipVariant: 'bu-declined' },
  'for final approval': { label: 'For Final Approval', color: '#059669', chipVariant: 'final-approval' },
  'for-final-approval': { label: 'For Final Approval', color: '#059669', chipVariant: 'final-approval' },
  'declined by final approver': { label: 'Declined by Final Approver', color: '#dc2626', chipVariant: 'adel-declined' },
  'declined-by-final-approver': { label: 'Declined by Final Approver', color: '#dc2626', chipVariant: 'adel-declined' },
};

export function normalizeStatusKey(status: string | undefined | null, status_id?: number): TicketStatus {
  if (status_id === 5) return 'bu-approval';
  if (status_id === 6) return 'bu-declined';
  if (status_id === 7) return 'final-approval';
  if (status_id === 8) return 'adel-declined';
  if (status_id === 1) return 'pending';
  if (status_id === 2) return 'answered';
  if (status_id === 3) return 'closed';

  const s = String(status || '').toLowerCase().trim();
  if (s === 'bu-approval' || s === 'for approval of bu head' || s === 'for-approval-of-bu-head') {
    return 'bu-approval';
  }
  if (s === 'final-approval' || s === 'for final approval' || s === 'for-final-approval') {
    return 'final-approval';
  }
  if (s === 'bu-declined' || s === 'declined by bu head' || s === 'declined-by-bu-head') {
    return 'bu-declined';
  }
  if (s === 'adel-declined' || s === 'declined by final approver' || s === 'declined-by-final-approver') {
    return 'adel-declined';
  }
  if (s === 'answered') return 'answered';
  if (s === 'closed') return 'closed';
  if (s === 'assigned') return 'assigned';
  if (s === 'reassigned') return 'reassigned';
  if (s === 'unassigned') return 'unassigned';
  if (s === 'pending') return 'pending';
  if (s === 'escalated') return 'escalated';

  return (s as TicketStatus) || 'pending';
}

export const PRIORITY_META: Record<TicketPriority, { label: string; color: string }> = {
  low:      { label: 'Low',      color: '#6b7280' },
  medium:   { label: 'Medium',   color: '#f59e0b' },
  high:     { label: 'High',     color: '#ef4444' },
  critical: { label: 'Critical', color: '#dc2626' },
};

